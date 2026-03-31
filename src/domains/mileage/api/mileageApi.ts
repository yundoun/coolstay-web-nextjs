import { api } from "@/lib/api/client"
import type { MileageDeleteRequest } from "../types"

/** 마일리지 적립 모텔 삭제 */
export function deleteMileageStores(body: MileageDeleteRequest) {
  return api.post<void>("/benefit/mileage/delete", body)
}

// TODO: 마일리지 목록 조회 API — AOS 앱/서버 코드 확인 후 추가
