// src/routes/generateCardId.ts
import { queryFirst, execute } from "../db";
import { jsonResponse } from "../utils/response";
import { generateCode } from "../utils/codeUtils";

/**
 * 處理 generateCardId 請求
 * @param {Env} env
 * @returns {Promise<Response>}
 */
export async function handleGenerateCardId(env: Env): Promise<Response> {
	const CODE_SECRET_KEY = env.CODE_SECRET_KEY;

	// 生成新的亂碼 ID
	const newId = generateCode(CODE_SECRET_KEY);

	// 確保 ID 的唯一性
	const existingCard = await queryFirst(env, "SELECT id FROM cards WHERE id = ?", newId);
	if (existingCard) {
		// 如果生成的 ID 已存在，重新生成
		// 這種情況極為罕見，但為保險起見
		return handleGenerateCardId(env);
	}

	// 查詢目前最大的 nth 值
	const data = await queryFirst(env, "SELECT MAX(nth) as max FROM cards");
	const nth = data?.max ? data.max + 1 : 1;

	return jsonResponse(
		{
			id: newId,
		},
		201,
	);
}
