/**
 * CoolStay CompressedResult 압축 해제 유틸
 *
 * 서버가 isCompress=true로 반환하는 ZIP(deflate) + Base64 데이터를 해제한다.
 * 구조: Base64 → ZIP(단일 파일) → deflate-raw → JSON
 */

import type { CompressedResult } from "./types"

/** CompressedResult의 base64Data를 해제하여 JSON 객체로 반환 */
export async function decompressResult<T>(compressed: CompressedResult): Promise<T> {
  // 1. Base64 → Uint8Array
  const binaryStr = atob(compressed.base64Data)
  const bytes = new Uint8Array(binaryStr.length)
  for (let i = 0; i < binaryStr.length; i++) {
    bytes[i] = binaryStr.charCodeAt(i)
  }

  // 2. ZIP local file header 파싱 → compressed data 추출
  const filenameLen = bytes[26] | (bytes[27] << 8)
  const extraLen = bytes[28] | (bytes[29] << 8)
  const dataOffset = 30 + filenameLen + extraLen

  // data descriptor (PK\x07\x08) 위치 찾기 → compressed data 끝
  let dataEnd = bytes.length
  for (let i = bytes.length - 22; i >= dataOffset; i--) {
    if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x07 && bytes[i + 3] === 0x08) {
      dataEnd = i
      break
    }
  }

  const compressedData = bytes.slice(dataOffset, dataEnd)

  // 3. DecompressionStream(deflate-raw)으로 해제
  const ds = new DecompressionStream("deflate-raw")
  const writer = ds.writable.getWriter()
  writer.write(compressedData)
  writer.close()

  const reader = ds.readable.getReader()
  const chunks: Uint8Array[] = []
  for (;;) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  const totalLen = chunks.reduce((s, c) => s + c.length, 0)
  const result = new Uint8Array(totalLen)
  let offset = 0
  for (const chunk of chunks) {
    result.set(chunk, offset)
    offset += chunk.length
  }

  // 4. JSON 파싱
  const jsonStr = new TextDecoder().decode(result)
  return JSON.parse(jsonStr) as T
}
