// src/utils/response.ts

/**
 * 建立 JSON 回應，並包含 CORS 標頭
 * @param {any} data
 * @param {number} status
 * @returns {Response}
 */
export function jsonResponse(data: any, status: number = 200): Response {
	return new Response(JSON.stringify(data), {
		headers: {
			"Content-Type": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
		status,
	});
}

/**
 * 建立錯誤回應，並包含 CORS 標頭
 * @param {string} message
 * @param {number} status
 * @returns {Response}
 */
export function errorResponse(message: string, status: number = 400): Response {
	return jsonResponse({ error: message }, status);
}

/**
 * 處理預檢請求（OPTIONS）
 * @returns {Response}
 */
export function handleOptions(): Response {
	return new Response(null, {
		headers: {
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
			"Access-Control-Allow-Headers": "Content-Type",
		},
		status: 204,
	});
}
