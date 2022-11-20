import {Env} from "../../index";
import {error, success} from "../../utils/utils";
import {validate} from "../../utils/body";

const schema = {
    password: String
};

type Schema = {
    password: string
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

    if (content.password !== "admin") return error(401, "Password is incorrect"); //TODO change this

    return success(204);
}