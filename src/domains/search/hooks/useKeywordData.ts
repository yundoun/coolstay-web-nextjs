import { useQuery } from "@tanstack/react-query"
import {
  getKeywordList,
  getKeywordSearchKeys,
  type KeywordSearchParams,
} from "../api/keywordApi"

// 꿀키워드 전체 목록
export function useKeywordList() {
  return useQuery({
    queryKey: ["contents", "keywordList"],
    queryFn: getKeywordList,
    retry: 1,
  })
}

// 꿀키워드 검색 (store keys)
export function useKeywordSearchKeys(params: KeywordSearchParams | undefined) {
  return useQuery({
    queryKey: ["contents", "keywordSearch", params],
    queryFn: () => getKeywordSearchKeys(params!),
    enabled: !!params,
    retry: 1,
  })
}
