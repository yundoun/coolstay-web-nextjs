import type { HttpClient, HttpParams } from "@/lib/ports/HttpClient"
import type {
  AccommodationRepository,
  StoreDetailParams,
  RefundPolicyParams,
} from "../ports/AccommodationRepository"
import type {
  DetailsResponse,
  ImagesResponse,
  DailyBookStatusResponse,
  RefundPolicyResponse,
} from "@/lib/api/types"

export class ApiAccommodationRepository implements AccommodationRepository {
  constructor(private http: HttpClient) {}

  getDetail(params: StoreDetailParams) {
    return this.http.get<DetailsResponse>("/contents/details/list", {
      ...params,
      pure_click_yn: params.pure_click_yn ?? "N",
    })
  }

  getImages(motelKey: string) {
    return this.http.get<ImagesResponse>("/contents/images/list", {
      motel_key: motelKey,
    })
  }

  getDailyBookStatus(motelKey: string, roomKey: string) {
    return this.http.get<DailyBookStatusResponse>("/contents/books/daystatus/list", {
      motel_key: motelKey,
      room_key: roomKey,
    })
  }

  getRefundPolicy(params: RefundPolicyParams) {
    return this.http.get<RefundPolicyResponse>("/contents/refund-policy/list", params as unknown as HttpParams)
  }
}
