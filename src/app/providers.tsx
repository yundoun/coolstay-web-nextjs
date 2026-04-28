"use client"

import { useState } from "react"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { DIProvider } from "@/lib/di/DIProvider"
import { defaultContainer } from "@/lib/di/container"

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <DIProvider container={defaultContainer}>
        {children}
      </DIProvider>
    </QueryClientProvider>
  )
}
