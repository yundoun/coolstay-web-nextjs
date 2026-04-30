import { NextRequest, NextResponse } from "next/server"

const TOUR_API_BASE = "http://apis.data.go.kr/B551011/KorService2/areaBasedList2"
const SERVICE_KEY = "5MgP1ceVGD0WTZ7AwA3LHM1yByrsTVfCX3VFbU4L3GYo1JSCRKLJqd8APK8n5HVgsr1X5TX8ugAmsqdYgYK5sA=="

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const contentTypeId = searchParams.get("contentTypeId") ?? "12"
  const numOfRows = searchParams.get("numOfRows") ?? "10"
  const areaCode = searchParams.get("areaCode")
  const sigunguCode = searchParams.get("sigunguCode")

  const params = new URLSearchParams({
    MobileOS: "ETC",
    MobileApp: "coolstay",
    serviceKey: SERVICE_KEY,
    numOfRows,
    pageNo: "1",
    contentTypeId,
    arrange: "Q",
    _type: "json",
  })
  if (areaCode && areaCode !== "0") params.set("areaCode", areaCode)
  if (sigunguCode && sigunguCode !== "0") params.set("sigunguCode", sigunguCode)

  try {
    const res = await fetch(`${TOUR_API_BASE}?${params.toString()}`, {
      next: { revalidate: 3600 },
    })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json(
      { error: "Tour API request failed" },
      { status: 502 }
    )
  }
}
