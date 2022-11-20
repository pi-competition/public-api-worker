import {Env} from "../../../index";
import {success} from "../../../utils/utils";

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    // TODO: Implement
    return success(200, [
            {
                id: 0,
                state: "online",
                battery: 100,
                uptime: 3.6e+6
            },
            {
                id: 1,
                state: "online",
                battery: 98,
                uptime: 720000
            },
            {
                id: 2,
                state: "busy",
                battery: 50,
                uptime: 36000
            },
            {
                id: 3,
                state: "offline",
            }
        ]
    );
}