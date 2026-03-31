"use client"

import { useState, useEffect, useCallback } from "react"
import { HelpCircle, Loader2 } from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { getFaqList } from "@/domains/cs/api/csApi"
import type { BoardItem } from "@/domains/cs/types"

export function FaqPage() {
  const [items, setItems] = useState<BoardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchList = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await getFaqList()
      setItems(res.board_items ?? [])
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchList() }, [fetchList])

  // 태그 기반 카테고리 추출
  const allTags = [...new Set(items.flatMap((item) => item.tags ?? []))]
  const categories = ["전체", ...allTags]
  const [selectedCategory, setSelectedCategory] = useState("전체")

  const filteredItems =
    selectedCategory === "전체"
      ? items
      : items.filter((item) => item.tags?.includes(selectedCategory))

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">자주 묻는 질문</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : (
        <>
          {/* Category Filter */}
          {categories.length > 1 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:bg-muted"
                  )}
                >
                  {category}
                </button>
              ))}
            </div>
          )}

          {/* FAQ Accordion */}
          {filteredItems.length > 0 ? (
            <div className="rounded-xl border bg-card overflow-hidden">
              <Accordion type="single" collapsible>
                {filteredItems.map((faq) => (
                  <AccordionItem key={faq.key} value={faq.key}>
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-start gap-3 text-left">
                        <span className="text-primary font-bold shrink-0">Q</span>
                        <div>
                          {faq.tags?.[0] && (
                            <Badge variant="outline" className="text-[10px] mb-1">
                              {faq.tags[0]}
                            </Badge>
                          )}
                          <p className="text-sm font-medium">{faq.title}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4">
                      <div className="flex gap-3 pl-0">
                        <span className="text-muted-foreground font-bold shrink-0">A</span>
                        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                          {faq.description}
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="rounded-full bg-muted p-6 mb-4">
                <HelpCircle className="size-10 text-muted-foreground" />
              </div>
              <p className="text-lg font-semibold">FAQ가 없습니다</p>
            </div>
          )}
        </>
      )}
    </Container>
  )
}
