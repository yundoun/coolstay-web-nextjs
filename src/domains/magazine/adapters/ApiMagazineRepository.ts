import type { HttpClient } from "@/lib/ports/HttpClient"
import type { MagazineRepository } from "../ports/MagazineRepository"
import type {
  MagazineHomeResponse,
  RegionsResponse,
  BoardListResponse,
  BoardDetailResponse,
  PackageListResponse,
  PackageDetailResponse,
  PackageBannerResponse,
  BoardType,
} from "../types"

export class ApiMagazineRepository implements MagazineRepository {
  constructor(private http: HttpClient) {}

  getMagazineHome(params?: { provinceCode?: string; code?: string }) {
    return this.http.get<MagazineHomeResponse>("/aiMagazine/home", {
      provinceCode: params?.provinceCode,
      code: params?.code,
    })
  }

  getMagazineRegions() {
    return this.http.get<RegionsResponse>("/aiMagazine/regions")
  }

  getBoardList(params?: { type?: BoardType; cursor?: string; count?: number }) {
    return this.http.get<BoardListResponse>("/aiMagazine/board/list", {
      type: params?.type,
      cursor: params?.cursor,
      count: params?.count ?? 10,
    })
  }

  getBoardDetail(key: number) {
    return this.http.get<BoardDetailResponse>("/aiMagazine/board/detail", { key })
  }

  getPackageList(params?: { cursor?: string; count?: number }) {
    return this.http.get<PackageListResponse>("/aiMagazine/package/list", {
      cursor: params?.cursor,
      count: params?.count ?? 20,
    })
  }

  getPackageDetail(params: { key: number; sales_date?: string; customer_count?: string }) {
    return this.http.get<PackageDetailResponse>("/aiMagazine/package/detail", {
      key: params.key,
      sales_date: params.sales_date,
      customer_count: params.customer_count,
    })
  }

  getPackageBanners(params?: { provinceCode?: string; code?: string }) {
    return this.http.get<PackageBannerResponse>("/aiMagazine/package/banner", {
      provinceCode: params?.provinceCode,
      code: params?.code,
    })
  }
}
