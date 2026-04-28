import type { HttpClient } from "@/lib/ports/HttpClient"
import type { CsRepository } from "../ports/CsRepository"
import type {
  BoardListParams,
  BoardListResponse,
  BoardRegisterRequest,
  BoardDeleteRequest,
  PopularKeywordResponse,
} from "../types"

export class ApiCsRepository implements CsRepository {
  constructor(private http: HttpClient) {}

  getNoticeList(params?: Omit<BoardListParams, "board_type">) {
    return this.http.get<BoardListResponse>("/manage/board/list", {
      board_type: "NOTICE" as string,
      ...params,
    })
  }

  getFaqList(params?: Omit<BoardListParams, "board_type">) {
    return this.http.get<BoardListResponse>("/manage/board/list", {
      board_type: "FAQ" as string,
      ...params,
    })
  }

  getInquiryList(params?: Omit<BoardListParams, "board_type">) {
    return this.http.get<BoardListResponse>("/manage/board/list", {
      board_type: "ASK" as string,
      ...params,
    })
  }

  registerInquiry(body: BoardRegisterRequest) {
    return this.http.post<void>("/manage/board/register", body)
  }

  deleteInquiry(body: BoardDeleteRequest) {
    return this.http.post<void>("/manage/board/delete", body)
  }

  getGuideList(params?: Omit<BoardListParams, "board_type">) {
    return this.http.get<BoardListResponse>("/manage/board/list", {
      board_type: "GUIDE" as string,
      ...params,
    })
  }

  getExhibitionDetail(boardItemKey: string) {
    return this.http.get<BoardListResponse>("/manage/board/list", {
      board_type: "EVENT",
      board_item_key: boardItemKey,
    })
  }

  getPopularKeywords() {
    return this.http.get<PopularKeywordResponse>("/manage/popular/keyword")
  }
}
