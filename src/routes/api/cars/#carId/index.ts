import {Request, Router} from "itty-router";
import {Env} from "../../../../index";
import {error} from "../../../../utils/utils";

export const router = Router({base: `/api/cars`});

async function registerRoutes() {
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