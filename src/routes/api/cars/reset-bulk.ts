import {Env} from "../../../index";
import {error, success} from "../../../utils/utils";
import {validate} from "../../../utils/body";

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

    if (content.ids.every(id => id >= 0 && id <= 3)) {
        // TODO: Implement
        return success(204);
    } else {
        return error(400, "One or more invalid car IDs specified");
    }
}