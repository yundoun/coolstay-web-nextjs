"use client"

import { useQuery, useInfiniteQuery } from "@tanstack/react-query"
import {
  getMagazineHome,
  getMagazineRegions,
  getBoardList,
  getBoardDetail,
  getPackageList,
  getPackageDetail,
  getPackageBanners,
} from "../api/magazineApi"
import type { BoardType } from "../types"

/** 매거진 홈 (4개 섹션) */
export function useMagazineHome(provinceCode?: string, districtCode?: string) {
  return useQuery({
    queryKey: ["magazine", "home", provinceCode, districtCode],
    queryFn: () => getMagazineHome({
      provinceCode: provinceCode,
      code: districtCode,
    }),
    retry: 1,
  })
}

/** 지역 선택 (정적 데이터 — 캐시 오래 유지) */
export function useMagazineRegions() {
  return useQuery({
    queryKey: ["magazine", "regions"],
    queryFn: getMagazineRegions,
    staleTime: 1000 * 60 * 30, // 30분
    retry: 1,
  })
}

/** 게시글 목록 (커서 기반 무한 스크롤) */
export function useBoardList(type: BoardType = "ALL") {
  return useInfiniteQuery({
    queryKey: ["magazine", "board", "list", type],
    queryFn: ({ pageParam }) => getBoardList({
      type: type === "ALL" ? undefined : type,
      cursor: pageParam as string | undefined,
      count: 10,
    }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    retry: 1,
  })
}

/** 게시글 상세 */
export function useBoardDetail(key: number | undefined) {
  return useQuery({
    queryKey: ["magazine", "board", "detail", key],
    queryFn: () => getBoardDetail(key!),
    enabled: !!key,
    retry: 1,
  })
}

/** 패키지 목록 (커서 기반 무한 스크롤) */
export function usePackageList() {
  return useInfiniteQuery({
    queryKey: ["magazine", "package", "list"],
    queryFn: ({ pageParam }) => getPackageList({
      cursor: pageParam as string | undefined,
      count: 20,
    }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.next_cursor ?? undefined,
    retry: 1,
  })
}

/** 패키지 상세 */
export function usePackageDetail(key: number | undefined) {
  return useQuery({
    queryKey: ["magazine", "package", "detail", key],
    queryFn: () => getPackageDetail({ key: key! }),
    enabled: !!key,
    retry: 1,
  })
}

/** 패키지 배너 */
export function usePackageBanners(provinceCode?: string, districtCode?: string) {
  return useQuery({
    queryKey: ["magazine", "package", "banner", provinceCode, districtCode],
    queryFn: () => getPackageBanners({
      provinceCode: provinceCode,
      code: districtCode,
    }),
    retry: 1,
  })
}
