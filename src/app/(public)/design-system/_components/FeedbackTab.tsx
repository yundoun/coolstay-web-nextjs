"use client"

import { useState } from "react"
import { AlertCircle, Heart, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { ErrorState } from "@/components/ui/error-state"

export function FeedbackTab() {
  const [progress] = useState(60)

  return (
    <div className="space-y-8">
      {/* Alert */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Alert</h2>
        <div className="space-y-4">
          <Alert>
            <AlertTitle>안내</AlertTitle>
            <AlertDescription>예약이 완료되었습니다.</AlertDescription>
          </Alert>
          <Alert variant="destructive">
            <AlertTitle>오류</AlertTitle>
            <AlertDescription>결제에 실패했습니다. 다시 시도해주세요.</AlertDescription>
          </Alert>
        </div>
      </section>

      <Separator />

      {/* Progress */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Progress</h2>
        <div className="space-y-4">
          <Progress value={progress} className="w-full" />
          <p className="text-sm text-muted-foreground">예약 진행률: {progress}%</p>
        </div>
      </section>

      <Separator />

      {/* Tooltip */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Tooltip</h2>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline">마우스를 올려보세요</Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>툴팁 내용입니다</p>
          </TooltipContent>
        </Tooltip>
      </section>

      <Separator />

      {/* LoadingSpinner — 신규 추가 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Loading Spinner</h2>
        <p className="text-sm text-muted-foreground mb-4">
          사용자 액션 처리 중 (폼 제출, 결제 등)에 사용
        </p>
        <div className="grid grid-cols-3 gap-8">
          <div className="text-center">
            <LoadingSpinner size="sm" />
            <p className="mt-2 text-xs text-muted-foreground">size=&quot;sm&quot;</p>
          </div>
          <div className="text-center">
            <LoadingSpinner size="md" />
            <p className="mt-2 text-xs text-muted-foreground">size=&quot;md&quot; (기본)</p>
          </div>
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="mt-2 text-xs text-muted-foreground">size=&quot;lg&quot;</p>
          </div>
        </div>
      </section>

      <Separator />

      {/* EmptyState — 신규 추가 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Empty State</h2>
        <p className="text-sm text-muted-foreground mb-4">
          데이터가 없을 때 표시
        </p>
        <div className="border rounded-xl p-4">
          <EmptyState
            icon={Heart}
            title="찜한 숙소가 없습니다"
            description="마음에 드는 숙소를 찜해보세요"
            action={{ label: "숙소 둘러보기", href: "/search" }}
          />
        </div>
      </section>

      <Separator />

      {/* ErrorState — 신규 추가 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Error State</h2>
        <p className="text-sm text-muted-foreground mb-4">
          오류 발생 시 표시 (재시도 버튼 포함 가능)
        </p>
        <div className="border rounded-xl p-4">
          <ErrorState
            message="데이터를 불러올 수 없습니다"
            onRetry={() => alert("재시도!")}
          />
        </div>
      </section>
    </div>
  )
}
