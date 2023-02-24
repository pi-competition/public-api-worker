import {Request, Router} from "itty-router";
import {Env} from "../../../../index";
import { RemoteConfig } from "../../../../interfaces/RemoteConfig";
import {error, success} from "../../../../utils/utils";
import {getStatuses} from "../status";

export const router = Router({base: `/api/cars`});

async function registerRoutes() {
    router.get("/:carId/", execute).all("/:carId/", () => error(405));
    router.post("/:carId/reset", await import("./reset").then((m) => m.default)).all("/:carId/reset", () => error(405));
}

registerRoutes();

export async function middleware(
    request: Request,
    env: Env,
    ctx: ExecutionContext
) {
    if (request.params && request.params.carId != null) {
        if (Number(request.params.carId) >= 0 && Number(request.params.carId) <= 3) {
            return router.handle(request, env, ctx);
        }
    }
    return error(400, "Invalid car ID");
}

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext & RemoteConfig.AdditionalContext
): Promise<Response> {
    const id = Number(request.params!.carId);
    //TODO this should be a web request in the future to get 1 car, not a a request to another function
    const status = (await getStatuses(ctx))
        .filter((status) => status.id === id);
    return success(200, status);
}
