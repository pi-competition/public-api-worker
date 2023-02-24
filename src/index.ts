import {Router} from 'itty-router'
import {error, success} from "./utils/utils";
import {RemoteConfig} from "./interfaces/RemoteConfig";

const router = Router({base: "/api"});
const DISABLE = false;

export interface Env {
	ENVIRONMENT: "dev" | "production" | "staging";
	COMMIT: string;
	DB: KVNamespace;
}

async function registerRoutes() {
	router.options("*", await import("./utils/cors").then((m) => m.default));
	// root
	router.get("/", await import("./routes/api").then((m) => m.default)).all("/", () => error(405));
	// auth
	router.post("/verify", await import("./routes/api/verify").then((m) => m.default)).all("/verify", () => error(405));
	// cars
	router.get("/cars/status", await import("./routes/api/cars/status").then((m) => m.default)).all("/cars/status", () => error(405));
	router.post("/cars/reset-bulk", await import("./routes/api/cars/reset-bulk").then((m) => m.default)).all("/cars/reset-bulk", () => error(405));
	// car ID middleware
	router.all("/cars/:carId/*", await import("./routes/api/cars/#carId").then((m) => m.middleware));
	//central server
	router.get("/server", await import("./routes/api/server").then((m) => m.default));
	router.post("/server/restart", await import("./routes/api/server/restart").then((m) => m.default));



	router.all("*", async (request: Request, env: Env, ctx: ExecutionContext) => {
		return error(404, "The requested resource could not be found on this server.")
	})
}

registerRoutes();


export default {
	async fetch(
		request: Request,
		env: Env,
		ctx: ExecutionContext & RemoteConfig.AdditionalContext //slightly dodgy, execution context wasnt being used for anything else important ¯\_(ツ)_/¯
	): Promise<Response> {
		if(request.method === "OPTIONS") {
			return success(204)
		}
		if (DISABLE) return error(503);
		const config = await env.DB.get("remoteconfig");
		ctx.config = config ? JSON.parse(config) : {};
		if (ctx.config.maintenance) return error(503);
		if (ctx.config.disabledRoutes) {
			const found = ctx.config.disabledRoutes.find(route => {
				return route.path === new URL(request.url).pathname && route.methods.includes(request.method);
			});
			if (found) return error(503, "Accessing this resource has been temporarily disabled. Please try again later.")
		}

		if (ctx.config.alwaysRequireAuth) {
			const auth = request.headers.get("Authorization");
			if (!auth) return error(401, "You must provide authentication credentials to access this resource.");
			if (auth !== ctx.config.password) return error(403, "You do not have permission to access this resource.");
		}

		if (!new URL(request.url).pathname.startsWith("/api")) return error(418, "The requested resource is not available on this server."); //for non-api requests, requests should be sent to the pages domain
		return await router.handle(request, env, ctx).catch(err => {
			console.error(err);
			return error(500)
		});
	},
};
