import type { BoardItem } from "@/domains/cs/types"

export type { BoardItem }

export interface EventListParams {
  search_type?: string
  status?: string
  count?: number
  cursor?: string
}
