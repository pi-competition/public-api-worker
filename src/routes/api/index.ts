import {Env} from "../../index";
import {success} from "../../utils/utils";

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    return success(200, {
        environment: env.ENVIRONMENT,
        commit: env.COMMIT.slice(0, 7)
    });
}