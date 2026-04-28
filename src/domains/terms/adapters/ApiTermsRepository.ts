import type { HttpClient } from "@/lib/ports/HttpClient"
import type { TermsRepository } from "../ports/TermsRepository"
import type { TermListParams, TermListResponse } from "../types"

export class ApiTermsRepository implements TermsRepository {
  constructor(private http: HttpClient) {}

  getTermList(params?: TermListParams) {
    return this.http.get<TermListResponse>("/manage/terms/list", {
      ...params,
    })
  }
}
