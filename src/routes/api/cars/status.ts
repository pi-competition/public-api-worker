import {Env} from "../../../index";
import {error, success} from "../../../utils/utils";
import {RemoteConfig} from "../../../interfaces/RemoteConfig";

type Status = {
    id: number,
    state: "online" | "offline" | "busy",
    battery?: number,
    uptime?: number,
}

export async function getStatuses(ctx: ExecutionContext & RemoteConfig.AdditionalContext): Promise<Status[]> {
    //TODO do the actual getting from remote server
    if (ctx.config.allCarsStatus === "offline") {
        return [
            {id: 0, state: "offline"},
            {id: 1, state: "offline"},
            {id: 2, state: "offline"},
            {id: 3, state: "offline"},
        ];
    }

    return [{id: 0}, {id: 1}, {id: 2}, {id: 3}].map((status: Partial<Status>) => {
        if (status.id === 2) status.state = ctx.config.allCarsStatus || "busy";
        else if (status.id === 3) status.state = ctx.config.allCarsStatus || "offline";
        else status.state = ctx.config.allCarsStatus || "online";
        if (status.state !== "offline") {
            status.battery = Math.random() * 100;
            status.uptime = Math.round(Math.random() * (Math.random() * 1000000))
        }
        return status as Status;
    });
}

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext & RemoteConfig.AdditionalContext
): Promise<Response> {
    // TODO: Implement
    const statuses = await getStatuses(ctx);
    if (!statuses) return error(502, "Failed to get statuses"); //maybe 504?
    return success(200, statuses);
}