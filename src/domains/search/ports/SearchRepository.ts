import type {
  RegionsResponse,
  ContentsListResponse,
  TotalListResponse,
  FilterResponse,
  FilterKey,
  MyAreaResponse,
  KeywordListResponse,
} from "@/lib/api/types"
import type { ContentsListParams, FilterParams, FilterListParams, MyAreaParams } from "../api/contentsApi"
import type { KeywordSearchParams, KeywordListSearchParams } from "../api/keywordApi"

/**
 * 검색 도메인 Repository 포트
 *
 * contents + keyword API를 통합한 검색 데이터 접근 인터페이스.
 */
export interface SearchRepository {
  getRegions(categoryCode?: string): Promise<RegionsResponse>
  getContentsList(params: ContentsListParams): Promise<ContentsListResponse>
  getTotalList(): Promise<TotalListResponse>
  getFilterKeys(params: FilterParams): Promise<FilterResponse>
  getFilterList(params: FilterListParams, filters: FilterKey[]): Promise<ContentsListResponse>
  getMyAreaList(params: MyAreaParams): Promise<MyAreaResponse>
  getKeywordList(): Promise<KeywordListResponse>
  getKeywordSearchKeys(params: KeywordSearchParams): Promise<FilterResponse>
  getKeywordSearchList(params: KeywordListSearchParams, filters: FilterKey[]): Promise<ContentsListResponse>
}
