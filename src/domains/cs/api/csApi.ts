import { api } from "@/lib/api/client"
import type {
  BoardListParams,
  BoardListResponse,
  BoardRegisterRequest,
  BoardDeleteRequest,
} from "../types"

/** 공지사항 목록/상세 조회 */
export function getNoticeList(params?: Omit<BoardListParams, "board_type">) {
  return api.get<BoardListResponse>("/manage/board/list", {
    board_type: "NOTICE",
    ...params,
  })
}

/** FAQ 목록 조회 */
export function getFaqList(params?: Omit<BoardListParams, "board_type">) {
  return api.get<BoardListResponse>("/manage/board/list", {
    board_type: "FAQ",
    ...params,
  })
}

/** 1:1 문의 목록 조회 */
export function getInquiryList(params?: Omit<BoardListParams, "board_type">) {
  return api.get<BoardListResponse>("/manage/board/list", {
    board_type: "INQUIRY",
    ...params,
  })
}

/** 1:1 문의 등록 */
export function registerInquiry(body: BoardRegisterRequest) {
  return api.post<void>("/manage/board/register", body)
}

/** 1:1 문의 삭제 */
export function deleteInquiry(body: BoardDeleteRequest) {
  return api.post<void>("/manage/board/delete", body)
}

/** 꿀팁 가이드 목록 조회 */
export function getGuideList(params?: Omit<BoardListParams, "board_type">) {
  return api.get<BoardListResponse>("/manage/board/list", {
    board_type: "GUIDE",
    ...params,
  })
}
