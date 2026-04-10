/**
 * AES-128-CBC 암호화 유틸 (AOS EncryptUtil.kt 포팅)
 *
 * - Algorithm: AES-128-CBC + PKCS7 Padding
 * - Key: secret의 앞 16바이트 (UTF-8), 부족하면 0으로 패딩
 * - IV: Key와 동일
 * - 출력: Base64 인코딩
 *
 * Web Crypto API(crypto.subtle)는 HTTPS 또는 localhost에서만 사용 가능.
 * HTTP + 네트워크 IP 접속 시 순수 JS 폴백(AES-CBC 직접 구현)을 사용한다.
 */

function getKeyBytes(secret: string): Uint8Array {
  const encoder = new TextEncoder()
  const bytes = encoder.encode(secret)
  const keyBytes = new Uint8Array(16) // 128-bit
  keyBytes.set(bytes.slice(0, 16))
  return keyBytes
}

// ─── AES-CBC 순수 JS 폴백 (crypto.subtle 미지원 환경) ───

// AES S-Box
const SBOX = new Uint8Array([
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16,
])

const RCON = [0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36]

function xtime(a: number): number {
  return (a << 1) ^ ((a & 0x80) ? 0x1b : 0) & 0xff
}

function aesExpandKey(key: Uint8Array): Uint8Array[] {
  const w: number[][] = []
  for (let i = 0; i < 4; i++) w.push([key[4*i], key[4*i+1], key[4*i+2], key[4*i+3]])
  for (let i = 4; i < 44; i++) {
    const t = [...w[i-1]]
    if (i % 4 === 0) {
      const rotated = [t[1], t[2], t[3], t[0]]
      for (let j = 0; j < 4; j++) rotated[j] = SBOX[rotated[j]]
      rotated[0] ^= RCON[i/4 - 1]
      for (let j = 0; j < 4; j++) t[j] = w[i-4][j] ^ rotated[j]
    } else {
      for (let j = 0; j < 4; j++) t[j] = w[i-4][j] ^ t[j]
    }
    w.push(t)
  }
  const roundKeys: Uint8Array[] = []
  for (let r = 0; r < 11; r++) {
    const rk = new Uint8Array(16)
    for (let c = 0; c < 4; c++) for (let j = 0; j < 4; j++) rk[4*c+j] = w[r*4+c][j]
    roundKeys.push(rk)
  }
  return roundKeys
}

function aesEncryptBlock(block: Uint8Array, roundKeys: Uint8Array[]): Uint8Array {
  const s = new Uint8Array(16)
  for (let i = 0; i < 16; i++) s[i] = block[i] ^ roundKeys[0][i]

  for (let round = 1; round <= 10; round++) {
    // SubBytes
    for (let i = 0; i < 16; i++) s[i] = SBOX[s[i]]
    // ShiftRows
    let t: number
    t = s[1]; s[1] = s[5]; s[5] = s[9]; s[9] = s[13]; s[13] = t
    t = s[2]; s[2] = s[10]; s[10] = t; t = s[6]; s[6] = s[14]; s[14] = t
    t = s[15]; s[15] = s[11]; s[11] = s[7]; s[7] = s[3]; s[3] = t
    // MixColumns (skip on last round)
    if (round < 10) {
      for (let c = 0; c < 4; c++) {
        const i = c * 4
        const a0 = s[i], a1 = s[i+1], a2 = s[i+2], a3 = s[i+3]
        s[i]   = xtime(a0) ^ xtime(a1) ^ a1 ^ a2 ^ a3
        s[i+1] = a0 ^ xtime(a1) ^ xtime(a2) ^ a2 ^ a3
        s[i+2] = a0 ^ a1 ^ xtime(a2) ^ xtime(a3) ^ a3
        s[i+3] = xtime(a0) ^ a0 ^ a1 ^ a2 ^ xtime(a3)
      }
    }
    // AddRoundKey
    for (let i = 0; i < 16; i++) s[i] ^= roundKeys[round][i]
  }
  return s
}

function aesCbcEncrypt(data: Uint8Array, key: Uint8Array, iv: Uint8Array): Uint8Array {
  // PKCS7 padding
  const padLen = 16 - (data.length % 16)
  const padded = new Uint8Array(data.length + padLen)
  padded.set(data)
  for (let i = data.length; i < padded.length; i++) padded[i] = padLen

  const roundKeys = aesExpandKey(key)
  const result = new Uint8Array(padded.length)
  let prev = iv

  for (let offset = 0; offset < padded.length; offset += 16) {
    const block = new Uint8Array(16)
    for (let i = 0; i < 16; i++) block[i] = padded[offset + i] ^ prev[i]
    const encrypted = aesEncryptBlock(block, roundKeys)
    result.set(encrypted, offset)
    prev = encrypted
  }
  return result
}

// ─── 공개 API ───

/** AES-128-CBC 암호화 + Base64 반환 */
export async function aesEncrypt(plaintext: string, secret: string): Promise<string> {
  const keyBytes = getKeyBytes(secret)
  const ivBytes = getKeyBytes(secret) // IV = Key (AOS와 동일)
  const data = new TextEncoder().encode(plaintext)

  // crypto.subtle 사용 가능하면 네이티브, 아니면 순수 JS 폴백
  if (typeof crypto !== "undefined" && crypto.subtle) {
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
      data,
    )
    const bytes = new Uint8Array(encrypted)
    let binary = ""
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return btoa(binary)
  }

  // 폴백: 순수 JS AES-CBC
  const encrypted = aesCbcEncrypt(data, keyBytes, ivBytes)
  let binary = ""
  for (let i = 0; i < encrypted.length; i++) {
    binary += String.fromCharCode(encrypted[i])
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
