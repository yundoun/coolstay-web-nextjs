import type { HttpClient } from "@/lib/ports/HttpClient"
import type { MileageRepository } from "../ports/MileageRepository"
import type {
  MileageDetailParams,
  MileageDetailResponse,
  MileageDeleteRequest,
} from "../types"

export class ApiMileageRepository implements MileageRepository {
  constructor(private http: HttpClient) {}

  getMileageDetail(params: MileageDetailParams) {
    return this.http.get<MileageDetailResponse>("/benefit/users/mileage/list", {
      ...params,
    })
  }

  deleteMileageStores(body: MileageDeleteRequest) {
    return this.http.post<void>("/benefit/mileage/delete", body)
  }
}
