import {Env} from "../../../../index";
import {success} from "../../../../utils/utils";
import {validate} from "../../../../utils/body";

const schema = {};

export default async function execute(
    request: Request,
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

    return success(204);

}