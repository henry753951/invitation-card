// src/index.ts
import { handleQueryCard } from "./routes/queryCard";
import { handleInitCard } from "./routes/initCard";
import { handleGenerateCardId } from "./routes/generateCardId";

export default {
	async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
		return handleRequest(request, env);
	},
} satisfies ExportedHandler<Env>;

/**
 * 處理傳入的請求並路由到相應的處理器
 * @param {Request} request
 * @param {Env} env
 * @returns {Promise<Response>}
 */
async function handleRequest(request: Request, env: Env): Promise<Response> {
	const url = new URL(request.url);
	const path = url.pathname.split("/").filter(Boolean);
	if (request.method === "OPTIONS") {
		return await handleOptions();
	}

	if (path.length !== 2) {
		const action = path[0];
		if (action === "generateCardId") {
			if (request.method !== "GET") {
				return new Response("Method Not Allowed", { status: 405 });
			}
			const token = url.searchParams.get("token");
			if (token !== env.TOKEN) {
				return new Response("Unauthorized", { status: 401 });
			}
			return await handleGenerateCardId(env);
		}

		return new Response("Not Found", { status: 404 });
	}

	const [action, id] = path;

	try {
		if (action === "queryCard") {
			if (request.method !== "GET") {
				return new Response("Method Not Allowed", { status: 405 });
			}
			return await handleQueryCard(id, env);
		}

		if (action === "initCard") {
			if (request.method !== "POST") {
				return new Response("Method Not Allowed", { status: 405 });
			}
			return await handleInitCard(id, request, env);
		}

		return new Response("Not Found", { status: 404 });
	} catch (error) {
		console.error(error);
		return new Response("Internal Server Error", { status: 500 });
	}
}

async function handleOptions() {
	const corsHeaders = {
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
		"Access-Control-Allow-Headers": "Content-Type",
	};

	return new Response("okay", {
		headers: {
			...corsHeaders,
		},
	});
}
