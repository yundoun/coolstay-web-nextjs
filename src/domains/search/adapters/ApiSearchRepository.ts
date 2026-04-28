import type { HttpClient, HttpParams } from "@/lib/ports/HttpClient"
import type { SearchRepository } from "../ports/SearchRepository"
import type {
  RegionsResponse,
  ContentsListResponse,
  TotalListResponse,
  FilterResponse,
  FilterKey,
  MyAreaResponse,
  KeywordListResponse,
  CompressedResult,
} from "@/lib/api/types"
import type { ContentsListParams, FilterParams, FilterListParams, MyAreaParams } from "../api/contentsApi"
import type { KeywordSearchParams, KeywordListSearchParams } from "../api/keywordApi"
import { decompressResult } from "@/lib/api/decompress"

export class ApiSearchRepository implements SearchRepository {
  constructor(private http: HttpClient) {}

  getRegions(categoryCode: string = "ALL,SUBWAY") {
    return this.http.get<RegionsResponse>("/contents/regions/list", {
      category_code: categoryCode,
    })
  }

  getContentsList(params: ContentsListParams) {
    return this.http.get<ContentsListResponse>("/contents/list", { ...params } as HttpParams)
  }

  getTotalList() {
    return this.http.get<TotalListResponse>("/contents/total/list", { isCompress: 0 })
  }

  getFilterKeys(params: FilterParams) {
    return this.http.get<FilterResponse>("/contents/filter", {
      ...params,
      isCompress: 0,
    } as HttpParams)
  }

  getFilterList(params: FilterListParams, filters: FilterKey[]) {
    return this.http.post<ContentsListResponse>(
      "/contents/filter/list",
      { filters },
      { ...params, isCompress: 0 } as HttpParams,
    )
  }

  getMyAreaList(params: MyAreaParams) {
    return this.http.get<MyAreaResponse>("/contents/myArea/list", {
      ...params,
      isCompress: 0,
    } as HttpParams)
  }

  async getKeywordList(): Promise<KeywordListResponse> {
    const compressed = await this.http.get<CompressedResult>("/contents/total/keywordList", {
      isCompress: true,
    } as HttpParams)
    return decompressResult<KeywordListResponse>(compressed)
  }

  getKeywordSearchKeys(params: KeywordSearchParams) {
    return this.http.get<FilterResponse>("/contents/search/keyword", {
      ...params,
      isCompress: 0,
    } as HttpParams)
  }

  getKeywordSearchList(params: KeywordListSearchParams, filters: FilterKey[]) {
    return this.http.post<ContentsListResponse>(
      "/contents/search/keyword/list",
      { filters },
      { ...params, isCompress: 0 } as HttpParams,
    )
  }
}
