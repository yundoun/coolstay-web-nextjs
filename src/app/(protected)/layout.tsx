import { Suspense } from "react"
import { ProtectedGuard } from "./guard"

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProtectedGuard>{children}</ProtectedGuard>
    </Suspense>
  )
}
