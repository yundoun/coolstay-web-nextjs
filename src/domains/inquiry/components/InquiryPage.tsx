"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import {
  MessageSquare,
  Clock,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Send,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { getInquiryList, registerInquiry } from "@/domains/cs/api/csApi"
import type { BoardItem } from "@/domains/cs/types"

const CATEGORIES = ["예약", "결제", "취소/환불", "기타"]

export function InquiryPage() {
  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">1:1 문의</h1>

      <Tabs defaultValue="write">
        <TabsList className="w-full">
          <TabsTrigger value="write" className="flex-1">
            문의 작성
          </TabsTrigger>
          <TabsTrigger value="list" className="flex-1">
            문의 내역
          </TabsTrigger>
        </TabsList>

        <TabsContent value="write" className="mt-4">
          <InquiryForm />
        </TabsContent>

        <TabsContent value="list" className="mt-4">
          <InquiryList />
        </TabsContent>
      </Tabs>
    </Container>
  )
}

function InquiryForm() {
  const [category, setCategory] = useState<string>("")
  const [content, setContent] = useState("")

  const isValid = category && content.trim().length >= 10

  const handleSubmit = async () => {
    if (!isValid) return
    try {
      await registerInquiry({
        board_type: "ASK",
        title: `[${category}] ${content.slice(0, 30)}`,
        option_value: category,
      })
      alert("문의가 접수되었습니다. 빠른 시일 내에 답변드리겠습니다.")
      setCategory("")
      setContent("")
    } catch {
      alert("문의 접수에 실패했습니다")
    }
  }

  return (
    <div className="rounded-xl border bg-card p-5 space-y-5">
      <div className="space-y-2">
        <Label>문의 유형</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger>
            <SelectValue placeholder="카테고리를 선택해주세요" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>문의 내용</Label>
        <Textarea
          placeholder="문의 내용을 입력해주세요 (최소 10자)"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={6}
        />
        <p className="text-xs text-muted-foreground text-right">
          {content.length}자
          {content.length > 0 && content.length < 10 && (
            <span className="text-destructive ml-1">
              (10자 이상 입력해주세요)
            </span>
          )}
        </p>
      </div>

      <Button
        onClick={handleSubmit}
        disabled={!isValid}
        className="w-full"
        size="lg"
      >
        <Send className="size-4 mr-2" />
        문의 접수
      </Button>
    </div>
  )
}

function InquiryList() {
  const { data, isLoading } = useQuery({
    queryKey: ["inquiries"],
    queryFn: () => getInquiryList(),
    retry: 1,
  })
  const items = data?.board_items ?? []
  const [expandedId, setExpandedId] = useState<number | null>(null)

  if (isLoading) {
    return <LoadingSpinner />
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="문의 내역이 없습니다"
        description="궁금한 점이 있으시면 문의를 남겨주세요"
      />
    )
  }

  return (
    <div className="space-y-3">
      {items.map((inquiry) => {
        const expanded = expandedId === inquiry.key
        const hasReply = !!inquiry.reply
        return (
          <div key={inquiry.key} className="rounded-xl border bg-card overflow-hidden">
            <button
              onClick={() => setExpandedId(expanded ? null : inquiry.key)}
              className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    {hasReply ? (
                      <Badge className="text-[10px] bg-green-500">
                        <CheckCircle2 className="size-3 mr-0.5" />
                        답변완료
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="text-[10px]">
                        <Clock className="size-3 mr-0.5" />
                        대기중
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm line-clamp-1 mt-1">{inquiry.title}</p>
                </div>
                <div className="shrink-0 pt-1">
                  {expanded ? (
                    <ChevronUp className="size-4 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="size-4 text-muted-foreground" />
                  )}
                </div>
              </div>
            </button>

            {expanded && (
              <div className="border-t px-4 py-4 space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">문의 내용</p>
                  <p className="text-sm leading-relaxed">{inquiry.description}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-4">
                  {hasReply ? (
                    <>
                      <p className="text-xs font-medium text-primary mb-2">관리자 답변</p>
                      <p className="text-sm leading-relaxed whitespace-pre-line">
                        {inquiry.reply!.text}
                      </p>
                    </>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="size-4" />
                      <span>답변 대기중입니다. 빠른 시일 내에 답변드리겠습니다.</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
