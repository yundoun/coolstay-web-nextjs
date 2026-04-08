import { api } from "@/lib/api/client"
import type { Exhibition, HomeMainResponse } from "@/lib/api/types"
import type { BoardListResponse } from "@/domains/cs/types"

/** 기획전 목록 조회 — POST /home/main → result.exhibitions[] */
export async function getExhibitionList(): Promise<Exhibition[]> {
  const data = await api.post<HomeMainResponse>("/home/main", {
    region_code: "ALL_0100000",
    popup_notice_yn: "N",
    coupon_only_yn: "N",
  })
  return data.exhibitions ?? []
}

/** 기획전 상세 조회 — GET /manage/board/list (board_type=MOBILE_BOARD) */
export function getExhibitionDetail(
  key: number,
  boardSubType: string = "EXHIBITION",
) {
  return api.get<BoardListResponse>("/manage/board/list", {
    board_type: "MOBILE_BOARD",
    board_sub_type: boardSubType,
    board_item_key: String(key),
  })
}
