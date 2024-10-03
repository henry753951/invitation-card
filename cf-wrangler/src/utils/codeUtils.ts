// src/utils/codeUtils.ts

import CryptoJS from "crypto-js";

/**
 * 將 Buffer 轉換為 Base64 URL 安全字串
 * @param buffer Buffer
 * @returns Base64 URL 字串
 */
function toBase64Url(buffer: Buffer): string {
	return buffer.toString("base64").replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/**
 * 將 Base64 URL 字串轉換為 Buffer
 * @param base64Url Base64 URL 字串
 * @returns Buffer
 */
function fromBase64Url(base64Url: string): Buffer {
	// 將 Base64 URL 字串轉回標準 Base64
	let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");

	// 添加缺失的等號填充
	while (base64.length % 4 !== 0) {
		base64 += "=";
	}

	return Buffer.from(base64, "base64");
}

/**
 * 生成包含簽章的 16 字元亂碼
 * @param key 用於 HMAC 的金鑰
 * @returns 16 字元亂碼
 */
export function generateCode(key: string): string {
	// 生成 8 字節的隨機數據
	const data = CryptoJS.lib.WordArray.random(8); // 64 位元

	// 計算 HMAC 簽章
	const hmac = CryptoJS.HmacSHA256(data, key);
	const signature = CryptoJS.lib.WordArray.create(hmac.words.slice(0, 1), 4); // 取前 4 字節

	// 合併數據和簽章
	const combined = data.clone().concat(signature); // 12 字節

	// 將 WordArray 轉換為 Buffer
	const combinedBuffer = Buffer.from(combined.toString(CryptoJS.enc.Hex), "hex");

	// 編碼為 Base64 URL 字串
	const code = toBase64Url(combinedBuffer); // 16 字元

	return code;
}

/**
 * 驗證給定的 16 字元亂碼是否有效
 * @param code 16 字元亂碼
 * @param key 用於 HMAC 的金鑰
 * @returns 是否有效
 */
export function verifyCode(code: string, key: string): boolean {
	try {
		// 檢查碼長度
		if (code.length !== 16) return false;

		// 解碼 Base64 URL 字串
		const combined = fromBase64Url(code);
		if (combined.length !== 12) return false;

		// 分離數據和簽章
		const dataBuffer = combined.slice(0, 8);
		const signatureBuffer = combined.slice(8, 12);

		// 將 Buffer 轉回 WordArray
		const data = CryptoJS.enc.Hex.parse(dataBuffer.toString("hex"));
		const signature = CryptoJS.enc.Hex.parse(signatureBuffer.toString("hex"));

		// 計算期望的簽章
		const hmac = CryptoJS.HmacSHA256(data, key);
		const expectedSignature = CryptoJS.lib.WordArray.create(hmac.words.slice(0, 1), 4); // 取前 4 字節

		// 將簽章轉換為 Buffer 以進行安全比較
		const signatureExpectedBuffer = Buffer.from(expectedSignature.toString(CryptoJS.enc.Hex), "hex");
		const signatureActualBuffer = Buffer.from(signature.toString(CryptoJS.enc.Hex), "hex");

		// 比較簽章
		return signatureExpectedBuffer.equals(signatureActualBuffer);
	} catch (error) {
		// 處理任何解碼或計算錯誤
		console.error("驗證失敗:", error);
		return false;
	}
}
