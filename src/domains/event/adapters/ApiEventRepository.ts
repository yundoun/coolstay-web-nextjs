import type { HttpClient } from "@/lib/ports/HttpClient"
import type { EventRepository } from "../ports/EventRepository"
import type { BoardListResponse } from "@/domains/cs/types"
import type { EventListParams } from "../types"

export class ApiEventRepository implements EventRepository {
  constructor(private http: HttpClient) {}

  getEventList(params?: EventListParams) {
    return this.http.get<BoardListResponse>("/manage/board/list", {
      board_type: "EVENT" as string,
      ...params,
    })
  }

  getEventDetail(key: number) {
    return this.http.get<BoardListResponse>("/manage/board/list", {
      board_type: "EVENT" as string,
      board_item_key: String(key),
    })
  }
}
