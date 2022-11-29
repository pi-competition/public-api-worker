import {Env} from "../../../index";
import {error, success} from "../../../utils/utils";
import {validate} from "../../../utils/body";
import {getStatuses} from "./status";

const schema = {
    ids: []
};

type Schema = {
    ids: [number];
};


export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    let content: Schema;
    try {
        content = await request.json();
    } catch (e) {
        return error(400, "Invalid JSON");
    }
    const valid = validate(schema, content);
    if (valid !== true) return valid;


    if (content.ids.length > 4) return error(400, "Too many cars specified");
    if (content.ids.length < 1) return error(400, "Specify at least one car");

    let notReadyIds: number[] = (await getStatuses(ctx))
        .filter((status) => status.state !== "online")
        .map((status) => status.id);

    for (let i = 0; i < content.ids.length; i++) {
        let id = content.ids[i];
        if (id < 0 || id > 3) return error(400, "One or more specified car IDs are invalid");
        if (notReadyIds.includes(id)) return error(400, "The requested action cannot be performed on one or more of the specified cars at this time");
        for (let j = i + 1; j < content.ids.length; j++) {
            if (id === content.ids[j]) return error(400, "One or more specified car IDs are duplicates");
        }
    }
    return success(204)

}