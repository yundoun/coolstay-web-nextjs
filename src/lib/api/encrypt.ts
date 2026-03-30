/**
 * AES-128-CBC 암호화 유틸 (AOS EncryptUtil.kt 포팅)
 *
 * - Algorithm: AES-128-CBC + PKCS7 Padding (Web Crypto 자동 처리)
 * - Key: secret의 앞 16바이트 (UTF-8), 부족하면 0으로 패딩
 * - IV: Key와 동일
 * - 출력: Base64 인코딩
 */

function getKeyBytes(secret: string): Uint8Array {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(secret)
  const keyBytes = new Uint8Array(16) // 128-bit
  keyBytes.set(bytes.slice(0, 16))
  return keyBytes
}

/** AES-128-CBC 암호화 + Base64 반환 */
export async function aesEncrypt(plaintext: string, secret: string): Promise<string> {
  const keyBytes = getKeyBytes(secret)
  const ivBytes = getKeyBytes(secret) // IV = Key (AOS와 동일)

  const key = await crypto.subtle.importKey(
    "raw",
    keyBytes.buffer as ArrayBuffer,
    { name: "AES-CBC" },
    false,
    ["encrypt"],
  )

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-CBC", iv: ivBytes.buffer as ArrayBuffer },
    key,
    new TextEncoder().encode(plaintext),
  )

  const bytes = new Uint8Array(encrypted)
  let binary = ""
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

/** app-secret-code 헤더 생성 */
export async function generateSecretCode(accessToken: string, secret: string): Promise<string> {
  const now = new Date()
  const timestamp = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
    String(now.getSeconds()).padStart(2, "0"),
  ].join("")

  const plaintext = `${accessToken}-${timestamp}`
  return aesEncrypt(plaintext, secret)
}
