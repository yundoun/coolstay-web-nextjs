import { api } from "@/lib/api/client"
import type {
  MileageDetailParams,
  MileageDetailResponse,
  MileageDeleteRequest,
} from "../types"

/** 마일리지 상세 조회 (숙소별 적립 내역) */
export function getMileageDetail(params: MileageDetailParams) {
  return api.get<MileageDetailResponse>("/benefit/users/mileage/list", params)
}

/** 마일리지 적립 모텔 삭제 */
export function deleteMileageStores(body: MileageDeleteRequest) {
  return api.post<void>("/benefit/mileage/delete", body)
}
