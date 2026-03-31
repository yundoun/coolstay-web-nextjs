// ─── 약관 조회 ───

export interface Term {
  code: string
  name: string
  url: string
  required_yn: string
  version: string
}

export interface TermListResponse {
  terms: Term[]
}

export interface TermListParams {
  term_code?: string
}
