import {Env} from "../../index";
import {success} from "../../utils";

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    return success(204);
}