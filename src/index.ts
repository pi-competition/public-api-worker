import {Router} from 'itty-router'
import {error} from "./utils";

const router = Router();

export interface Env {
	ENVIRONMENT: "dev" | "production" | "staging";
	COMMIT: string;
}

async function registerRoutes() {
	router.get("/api", await import("./routes/api").then((m) => m.default));


	router.get("*", async (request: Request, env: Env, ctx: ExecutionContext) => {
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
