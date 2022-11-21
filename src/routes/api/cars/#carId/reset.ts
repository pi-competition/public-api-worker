import {Env} from "../../../../index";
import {error, success} from "../../../../utils/utils";
import {validate} from "../../../../utils/body";
import {getStatuses} from "../status";
import * as Itty from "itty-router";

const schema = {};

export default async function execute(
    request: Request & Itty.Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    let content: any;
    try {
        content = await request.json();
    } catch (e) {

    }
    const valid = validate(schema, content || {});
    if (valid !== true) return valid;
    const id = Number(request.params!.carId);

    //TODO this should be a web request in the future to get 1 car, not a a request to another function
    const ready = (await getStatuses())
        .filter((status) => status.state === "online" && status.id === id)
        .length > 0;
    if (!ready) {
        return error(400, "The requested action cannot be performed on the specified car at this time");
    }
    return success(204);

}