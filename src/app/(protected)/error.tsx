"use client"

import { useEffect } from "react"
import { AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProtectedError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("[ProtectedError]", error)
  }, [error])

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <div className="rounded-full bg-destructive/10 p-4 mb-4">
        <AlertCircle className="size-8 text-destructive" />
      </div>
      <h2 className="text-base font-semibold text-gray-900 mb-1.5">
        페이지를 불러올 수 없습니다
      </h2>
      <p className="text-sm text-gray-500 mb-5 max-w-sm">
        서버에 연결할 수 없거나 일시적인 오류가 발생했습니다.
      </p>
      <Button variant="outline" size="sm" onClick={reset}>
        <RefreshCw className="size-4 mr-1.5" />
        다시 시도
      </Button>
    </div>
  )
}
