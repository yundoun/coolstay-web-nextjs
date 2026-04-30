"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[GlobalError]", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-5 mb-5">
        <AlertCircle className="size-10 text-destructive" />
      </div>
      <h2 className="text-lg font-semibold text-gray-900 mb-2">
        페이지를 불러올 수 없습니다
      </h2>
      <p className="text-sm text-gray-500 mb-6 max-w-sm">
        일시적인 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
      </p>
      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={reset}>
          <RefreshCw className="size-4 mr-1.5" />
          다시 시도
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (window.location.href = "/")}
        >
          홈으로 이동
        </Button>
      </div>
    </div>
  )
}
