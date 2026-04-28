import type {
  BoardListParams,
  BoardListResponse,
  BoardRegisterRequest,
  BoardDeleteRequest,
  PopularKeywordResponse,
} from "../types"

/**
 * 고객센터(CS) 도메인 Repository 포트
 */
export interface CsRepository {
  /** 공지사항 목록/상세 조회 */
  getNoticeList(params?: Omit<BoardListParams, "board_type">): Promise<BoardListResponse>
  /** FAQ 목록 조회 */
  getFaqList(params?: Omit<BoardListParams, "board_type">): Promise<BoardListResponse>
  /** 1:1 문의 목록 조회 */
  getInquiryList(params?: Omit<BoardListParams, "board_type">): Promise<BoardListResponse>
  /** 1:1 문의 등록 */
  registerInquiry(body: BoardRegisterRequest): Promise<void>
  /** 1:1 문의 삭제 */
  deleteInquiry(body: BoardDeleteRequest): Promise<void>
  /** 꿀팁 가이드 목록 조회 */
  getGuideList(params?: Omit<BoardListParams, "board_type">): Promise<BoardListResponse>
  /** 기획전 상세 조회 */
  getExhibitionDetail(boardItemKey: string): Promise<BoardListResponse>
  /** 인기 검색어 */
  getPopularKeywords(): Promise<PopularKeywordResponse>
}
