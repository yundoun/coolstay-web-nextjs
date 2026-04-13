/** 이니시스 PC 웹표준(INIStdPay) 결제 유틸 */

const INICIS_TEST_MID = "INIpayTest"
const INICIS_TEST_SIGN_KEY = "SU5JTElURV9UUklQTEVERVNfS0VZU1RS"

/** SHA-256 해시 생성 */
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message)
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("")
}

export interface InicisPaymentParams {
  orderId: string
  goodName: string
  price: number
  buyerName: string
  buyerTel: string
  buyerEmail?: string
  /** 결제 수단: Card, DirectBank, HPP */
  payMethod?: string
}

/** 이니시스 PC 웹표준 결제 폼 데이터 생성 */
export async function createInicisFormData(params: InicisPaymentParams) {
  const { orderId, goodName, price, buyerName, buyerTel, buyerEmail, payMethod } = params
  const timestamp = Date.now().toString()

  const signature = await sha256(`oid=${orderId}&price=${price}&timestamp=${timestamp}`)
  const verification = await sha256(
    `oid=${orderId}&price=${price}&signKey=${INICIS_TEST_SIGN_KEY}&timestamp=${timestamp}`
  )
  const mKey = await sha256(INICIS_TEST_SIGN_KEY)

  const origin = typeof window !== "undefined" ? window.location.origin : ""
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || ""

  return {
    version: "1.0",
    mid: INICIS_TEST_MID,
    oid: orderId,
    price: String(price),
    timestamp,
    signature,
    verification,
    mKey,
    use_chkfake: "Y",
    goodname: goodName,
    buyername: buyerName,
    buyertel: buyerTel,
    buyeremail: buyerEmail || "",
    gopaymethod: payMethod || "Card",
    // returnUrl: 결제 인증 완료 후 POST → route handler에서 백엔드 프록시
    returnUrl: `${origin}${basePath}/pg/payment/return.html`,
    closeUrl: `${origin}${basePath}/pg/payment/close.html`,
    currency: "WON",
    acceptmethod: "below1000",
    nointerest: "",
    quotabase: "",
    // P_NOTI 형태로 merchant_uid 전달 (백엔드 프록시용)
    merchantUid: orderId,
  }
}

/** 이니시스 PC 웹표준 결제창 호출 */
export function requestInicisPayment(formId: string) {
  const INIStdPay = (window as unknown as { INIStdPay: { pay: (id: string) => void } }).INIStdPay
  if (!INIStdPay) {
    throw new Error("이니시스 SDK가 로드되지 않았습니다")
  }
  INIStdPay.pay(formId)
}
