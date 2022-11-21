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
                battery: Math.random() * 100,
                uptime: Math.round(Math.random() * (Math.random() * 1000000))
            },
            {
                id: 1,
                state: "online",
                battery: Math.random() * 100,
                uptime: Math.round(Math.random() * (Math.random() * 1000000))
            },
            {
                id: 2,
                state: "busy",
                battery: Math.random() * 100,
                uptime: Math.round(Math.random() * (Math.random() * 1000000))
            },
            {
                id: 3,
                state: "offline",
            }
        ]
    );
}