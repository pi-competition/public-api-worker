import {Env} from "../../../index";
import {error, success} from "../../../utils/utils";

type Status = {
    id: number,
    state: "online" | "offline" | "busy",
    battery?: number,
    uptime?: number,
}

export async function getStatuses(): Promise<Status[]> {
    //TODO do the actual getting from remote server
    return [
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
}

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    // TODO: Implement
    const statuses = await getStatuses();
    if (!statuses) return error(502, "Failed to get statuses"); //maybe 504?
    return success(200, statuses);
}