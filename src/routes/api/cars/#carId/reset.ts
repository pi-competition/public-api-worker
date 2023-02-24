import {Env} from "../../../../index";
import {error, success} from "../../../../utils/utils";
import {validate} from "../../../../utils/body";
import {getStatuses} from "../status";
import * as Itty from "itty-router";
import {RemoteConfig} from "../../../../interfaces/RemoteConfig";

const schema = {};

export default async function execute(
    request: Request & Itty.Request,
    env: Env,
    ctx: ExecutionContext & RemoteConfig.AdditionalContext
): Promise<Response> {
    const auth = request.headers.get("Authorization");
    if (!auth) return error(401, "You must provide authentication credentials to access this resource.");
    if (auth !== ctx.config.password) return error(403, "You do not have permission to access this resource.");

    let content: any;
    try {
        content = await request.json();
    } catch (e) {

    }
    const valid = validate(schema, content || {});
    if (valid !== true) return valid;
    const id = Number(request.params!.carId);

    //TODO this should be a web request in the future to get 1 car, not a a request to another function
    const ready = (await getStatuses(ctx))
        .filter((status) => status.state === "online" && status.id === id)
        .length > 0;
    if (!ready) {
        return error(400, "The requested action cannot be performed on the specified car at this time");
    }
    return success(204);

}