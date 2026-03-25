"use client"

import { useState } from "react"
import {
  CalendarDays,
  Ticket,
  Coins,
  PenLine,
  ArrowLeft,
  BookOpen,
  ChevronRight,
} from "lucide-react"
import { Container } from "@/components/layout"
import { cn } from "@/lib/utils"
import { guidesMock } from "../data/mock"
import type { GuideItem } from "../types"

const iconMap: Record<string, React.ElementType> = {
  calendar: CalendarDays,
  ticket: Ticket,
  coins: Coins,
  pen: PenLine,
}

export function GuidePage() {
  const [selectedGuide, setSelectedGuide] = useState<GuideItem | null>(null)

  if (selectedGuide) {
    return (
      <GuideDetail
        guide={selectedGuide}
        onBack={() => setSelectedGuide(null)}
      />
    )
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">이용 가이드</h1>

      <div className="space-y-3">
        {guidesMock.map((guide) => {
          const Icon = iconMap[guide.icon] || BookOpen
          return (
            <button
              key={guide.id}
              onClick={() => setSelectedGuide(guide)}
              className="w-full text-left flex items-center gap-4 p-4 rounded-xl border bg-card hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-center size-12 rounded-full bg-primary/10 shrink-0">
                <Icon className="size-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">{guide.title}</h3>
                <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                  {guide.summary}
                </p>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/50 shrink-0" />
            </button>
          )
        })}
      </div>
    </Container>
  )
}

function GuideDetail({
  guide,
  onBack,
}: {
  guide: GuideItem
  onBack: () => void
}) {
  const Icon = iconMap[guide.icon] || BookOpen

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft className="size-4" />
        가이드 목록
      </button>

      <div className="rounded-xl border bg-card p-5">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center justify-center size-10 rounded-full bg-primary/10">
            <Icon className="size-5 text-primary" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{guide.title}</h2>
            <p className="text-sm text-muted-foreground">{guide.summary}</p>
          </div>
        </div>

        <div className="space-y-4 mt-6">
          {guide.steps.map((step, idx) => (
            <div key={step.step} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex items-center justify-center size-8 rounded-full text-sm font-bold shrink-0",
                    "bg-primary text-primary-foreground"
                  )}
                >
                  {step.step}
                </div>
                {idx < guide.steps.length - 1 && (
                  <div className="w-px flex-1 bg-border mt-2" />
                )}
              </div>
              <div className="pb-6">
                <h3 className="font-semibold text-sm">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Container>
  )
}
