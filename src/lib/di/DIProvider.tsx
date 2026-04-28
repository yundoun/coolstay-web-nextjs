"use client"

import { createContext, useContext } from "react"
import type { ReactNode } from "react"
import type { Container } from "./types"

const DIContext = createContext<Container | null>(null)

interface DIProviderProps {
  container: Container
  children: ReactNode
}

export function DIProvider({ container, children }: DIProviderProps) {
  return <DIContext.Provider value={container}>{children}</DIContext.Provider>
}

export function useDI(): Container {
  const container = useContext(DIContext)
  if (!container) {
    throw new Error("useDI must be used within a DIProvider")
  }
  return container
}
