// src/routes/initCard.ts
import { queryFirst, execute } from "../db.js";
import { jsonResponse, errorResponse } from "../utils/response.js";

/**
 * 處理 initCard/:id 請求
 * @param {string} id
 * @param {Request} request
 * @param {Env} env
 * @returns {Promise<Response>}
 */
export async function handleInitCard(id: string, request: Request, env: Env): Promise<Response> {
	let body: { email?: string; name?: string };

	try {
		body = await request.json();
	} catch (e) {
		return errorResponse("Invalid JSON", 400);
	}

	const { email, name } = body;

	if (!email || !name) {
		return errorResponse("Missing email or name", 400);
	}

	// 查詢卡片是否存在
	const selectCard = await queryFirst(
		env,
		`
    SELECT cards.id, cards.nth, users.id as user_id
    FROM cards
    LEFT JOIN users ON cards.user_id = users.id
    WHERE cards.id = ?
    `,
		id,
	);

	if (!selectCard) {
		return errorResponse("Card not found", 404);
	}

	// 檢查使用者是否存在
	let user: Record<string, any> | null = null;
	if (selectCard.user_id) {
		user = await queryFirst(env, "SELECT * FROM users WHERE id = ?", selectCard.user_id);
	}

	if (user) {
		// 使用者已存在，更新名稱和電子郵件
		await execute(
			env,
			`
      UPDATE users
      SET email = ?, name = ?
      WHERE id = ?
      `,
			email,
			name,
			user.id,
		);
	} else {
		// 使用者不存在，創建新使用者並關聯到卡片
		const insertUserResult = await execute(
			env,
			`
      INSERT INTO users (email, name)
      VALUES (?, ?)
      `,
			email,
			name,
		);
		try {
			const userId = insertUserResult.meta.last_row_id;

			await execute(
				env,
				`
      UPDATE cards
      SET user_id = ?
      WHERE id = ?
      `,
				userId,
				id,
			);
		} catch (e) {
			return errorResponse(insertUserResult, 500);
		}
	}

	// 回傳更新後的卡片資料
	const updatedCard = await queryFirst(
		env,
		`
    SELECT cards.id, cards.nth, users.id as user_id, users.email, users.name
    FROM cards
    LEFT JOIN users ON cards.user_id = users.id
    WHERE cards.id = ?
    `,
		id,
	);

	if (!updatedCard) {
		return errorResponse("Failed to retrieve updated card", 500);
	}

	const responseData = {
		id: updatedCard.id,
		nth: updatedCard.nth,
		user: updatedCard.user_id
			? {
					id: updatedCard.user_id,
					email: updatedCard.email,
					name: updatedCard.name,
				}
			: null,
	};

	return jsonResponse(responseData, 200);
}
