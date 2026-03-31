"use client"

import { Loader2 } from "lucide-react"
import { Container } from "@/components/layout"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useTerms } from "../hooks/useTerms"

export function TermsPage() {
  const { terms, isLoading, error } = useTerms()

  if (isLoading) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <h1 className="text-2xl font-bold mb-6">이용약관</h1>
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      </Container>
    )
  }

  if (error || terms.length === 0) {
    return (
      <Container size="narrow" padding="responsive" className="py-8">
        <h1 className="text-2xl font-bold mb-6">이용약관</h1>
        <div className="text-center py-8 text-muted-foreground text-sm">
          {error || "약관 정보를 불러올 수 없습니다"}
        </div>
      </Container>
    )
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">이용약관</h1>

      <Tabs defaultValue={terms[0]?.code}>
        <TabsList className="w-full">
          {terms.map((term) => (
            <TabsTrigger key={term.code} value={term.code} className="flex-1 text-xs sm:text-sm">
              {term.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {terms.map((term) => (
          <TabsContent key={term.code} value={term.code} className="mt-4">
            <div className="rounded-xl border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b flex items-center justify-between">
                <h2 className="font-bold text-sm">{term.name}</h2>
                {term.version && (
                  <span className="text-xs text-muted-foreground">v{term.version}</span>
                )}
              </div>
              {term.url ? (
                <iframe
                  src={term.url}
                  className="w-full min-h-[60vh] border-0"
                  title={term.name}
                />
              ) : (
                <div className="p-5 text-sm text-muted-foreground">
                  약관 내용을 불러올 수 없습니다
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Container>
  )
}
