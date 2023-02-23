import {Env} from "../../../index";
import {success} from "../../../utils/utils";

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    return success(200, {
        id: 0,
        state: "online",
        uptime: Math.round(Math.random() * (Math.random() * 1000000)),
        zones: [
            {
                id: 0,
                powered: true
            },
            {
                id: 1,
                powered: true
            },
            {
                id: 2,
                powered: true
            },
            {
                id: 3,
                powered: false
            },
        ]
    });
}