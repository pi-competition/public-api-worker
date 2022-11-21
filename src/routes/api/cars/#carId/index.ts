import {Request, Router} from "itty-router";
import {Env} from "../../../../index";
import {error, success} from "../../../../utils/utils";

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
    ctx: ExecutionContext
): Promise<Response> {
    //junk data, will be useful at some point
    return success(200, {
        id: Number(request.params?.carId),
        state: "online",
        battery: Math.random() * 100,
        uptime: Math.round(Math.random() * (Math.random() * 1000000))
    });
}
