"use client"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { cn } from "@/lib/utils"
import { faqsMock } from "../data/mock"
import type { FaqCategory } from "../types"

const CATEGORIES: ("전체" | FaqCategory)[] = [
  "전체",
  "예약",
  "결제",
  "취소/환불",
  "회원",
  "기타",
]

export function FaqPage() {
  const [selectedCategory, setSelectedCategory] = useState<"전체" | FaqCategory>("전체")

  const filteredFaqs =
    selectedCategory === "전체"
      ? faqsMock
      : faqsMock.filter((faq) => faq.category === selectedCategory)

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">자주 묻는 질문</h1>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {CATEGORIES.map((category) => (
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

      {/* FAQ Accordion */}
      {filteredFaqs.length > 0 ? (
        <div className="rounded-xl border bg-card overflow-hidden">
          <Accordion type="single" collapsible>
            {filteredFaqs.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger className="px-4 hover:no-underline">
                  <div className="flex items-start gap-3 text-left">
                    <span className="text-primary font-bold shrink-0">Q</span>
                    <div>
                      <Badge variant="outline" className="text-[10px] mb-1">
                        {faq.category}
                      </Badge>
                      <p className="text-sm font-medium">{faq.question}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4">
                  <div className="flex gap-3 pl-0">
                    <span className="text-muted-foreground font-bold shrink-0">A</span>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {faq.answer}
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
          <p className="text-lg font-semibold">해당 카테고리에 FAQ가 없습니다</p>
        </div>
      )}
    </Container>
  )
}
