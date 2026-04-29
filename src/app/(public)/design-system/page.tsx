"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TooltipProvider } from "@/components/ui/tooltip"
import {
  ColorsTab,
  TypographyTab,
  ButtonsTab,
  FormsTab,
  DataDisplayTab,
  FeedbackTab,
  OverlayTab,
  NavigationTab,
  LoadingTab,
} from "./_components"

export default function DesignSystemPage() {
  const [isDark, setIsDark] = useState(false)

  // dev 환경에서만 접근 가능
  if (process.env.NODE_ENV === "production") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">This page is only available in development.</p>
      </div>
    )
  }

  const toggleTheme = () => {
    setIsDark(!isDark)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="container-wide flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">Coolstay Design System</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline">Dev Only</Badge>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {isDark ? "Light Mode" : "Dark Mode"}
              </Button>
            </div>
          </div>
        </header>

        <main className="container-wide py-12">
          <Tabs defaultValue="colors" className="space-y-8">
            <TabsList className="flex-wrap">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="data-display">Data Display</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="overlay">Overlay</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
              <TabsTrigger value="loading">Loading</TabsTrigger>
            </TabsList>

            <TabsContent value="colors"><ColorsTab /></TabsContent>
            <TabsContent value="typography"><TypographyTab /></TabsContent>
            <TabsContent value="buttons"><ButtonsTab /></TabsContent>
            <TabsContent value="forms"><FormsTab /></TabsContent>
            <TabsContent value="data-display"><DataDisplayTab /></TabsContent>
            <TabsContent value="feedback"><FeedbackTab /></TabsContent>
            <TabsContent value="overlay"><OverlayTab /></TabsContent>
            <TabsContent value="navigation"><NavigationTab /></TabsContent>
            <TabsContent value="loading"><LoadingTab /></TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  )
}
