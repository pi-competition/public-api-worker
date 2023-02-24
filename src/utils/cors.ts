import {Env} from "../index";

export const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
};

export default async function execute(
    request: Request,
    env: Env,
    ctx: ExecutionContext
): Promise<Response> {
    
    return new Response("", {
        headers: corsHeaders,
        status: 204
    });
}