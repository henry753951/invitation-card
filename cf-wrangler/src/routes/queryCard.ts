// src/routes/queryCard.ts
import { queryFirst, execute } from "../db.js";
import { jsonResponse } from "../utils/response";
import { verifyCode } from "../utils/codeUtils";

/**
 * 處理 queryCard/:id 請求
 * @param {string} id
 * @param {Env} env
 * @returns {Promise<Response>}
 */
export async function handleQueryCard(id: string, env: Env): Promise<Response> {
	const CODE_SECRET_KEY = env.CODE_SECRET_KEY;

	// 驗證 ID 是否合法
	const isValid = verifyCode(id, CODE_SECRET_KEY);
	if (!isValid) {
		return jsonResponse({ error: "Invalid ID" }, 400);
	}

	// 查詢卡片是否存在
	const selectCard = await queryFirst(
		env,
		`
    SELECT cards.id, cards.nth, users.id as user_id, users.email, users.name
    FROM cards
    LEFT JOIN users ON cards.user_id = users.id
    WHERE cards.id = ?
    `,
		id,
	);

	if (selectCard) {
		// 卡片存在，回傳資料
		const responseData = {
			id: selectCard.id,
			nth: selectCard.nth,
			user: selectCard.user_id
				? {
						id: selectCard.user_id,
						email: selectCard.email,
						name: selectCard.name,
					}
				: null,
		};
		return jsonResponse(responseData, 200);
	} else {
		// 卡片不存在，創建新卡片

		const data = await queryFirst(env, "SELECT MAX(nth) as max FROM cards");
		const nth = data?.max ? data.max + 1 : 1;

		await execute(
			env,
			`
      INSERT INTO cards (id, nth, user_id)
      VALUES (?, ?, NULL)
      `,
			id,
			nth,
		);

		const newCard = {
			id: id,
			nth: nth,
			user: null,
		};

		return jsonResponse(newCard, 201);
	}
}
