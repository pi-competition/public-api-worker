import {Env} from "../../../index";
import {error, success} from "../../../utils/utils";
import {RemoteConfig} from "../../../interfaces/RemoteConfig";

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext & RemoteConfig.AdditionalContext
): Promise<Response> {
    const auth = request.headers.get("Authorization");
    if (!auth) return error(401, "You must provide authentication credentials to access this resource.");
    if (auth !== ctx.config.password) return error(403, "You do not have permission to access this resource.");
    return success(204)
}