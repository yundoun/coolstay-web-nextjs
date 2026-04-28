import type { HttpClient } from "@/lib/ports/HttpClient"
import type { ExhibitionRepository } from "../ports/ExhibitionRepository"
import type { Exhibition, HomeMainResponse } from "@/lib/api/types"
import type { BoardListResponse } from "@/domains/cs/types"

export class ApiExhibitionRepository implements ExhibitionRepository {
  constructor(private http: HttpClient) {}

  async getExhibitionList(): Promise<Exhibition[]> {
    const data = await this.http.post<HomeMainResponse>("/home/main", {
      region_code: "ALL_0100000",
      popup_notice_yn: "N",
      coupon_only_yn: "N",
    })
    return data.exhibitions ?? []
  }

  getExhibitionDetail(key: number, boardSubType: string = "EXHIBITION") {
    return this.http.get<BoardListResponse>("/manage/board/list", {
      board_type: "MOBILE_BOARD",
      board_sub_type: boardSubType,
      board_item_key: String(key),
    })
  }
}
