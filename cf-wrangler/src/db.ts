// src/db.ts
export async function queryFirst(env: Env, query: string, ...params: any[]): Promise<Record<string, any> | null> {
	return await env.DATABASE.prepare(query)
		.bind(...params)
		.first();
}

/**
 * 執行一個 SQL 命令（如 INSERT, UPDATE）
 * @param {Env} env
 * @param {string} query
 * @param  {...any} params
 * @returns {Promise<any>}
 */
export async function execute(env: Env, query: string, ...params: any[]): Promise<any> {
	return await env.DATABASE.prepare(query)
		.bind(...params)
		.run();
}
