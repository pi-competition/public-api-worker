import {Router} from 'itty-router'
import {error} from "./utils/utils";

const router = Router({base: "/api"});

export interface Env {
	ENVIRONMENT: "dev" | "production" | "staging";
	COMMIT: string;
}

async function registerRoutes() {
	router.options("*", await import("./utils/cors").then((m) => m.default))
	// root
	router.get("/", await import("./routes/api").then((m) => m.default)).all("/", () => error(405));
	// auth
	router.post("/verify", await import("./routes/api/verify").then((m) => m.default)).all("/verify", () => error(405));
	// cars
	router.get("/cars/status", await import("./routes/api/cars/status").then((m) => m.default)).all("/cars/status", () => error(405));
	router.post("/cars/reset-bulk", await import("./routes/api/cars/reset-bulk").then((m) => m.default)).all("/cars/reset-bulk", () => error(405));
	// car ID middleware
	router.all("/cars/:carId/*", await import("./routes/api/cars/#carId").then((m) => m.middleware));



	router.all("*", async (request: Request, env: Env, ctx: ExecutionContext) => {
		return error(404, "The requested resource could not be found on this server.")
	})
}

registerRoutes();

export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext
	): Promise<Response> {
		return await router.handle(request, env, ctx).catch(err => {
			console.error(err);
			return error(500)
		});
	},
};