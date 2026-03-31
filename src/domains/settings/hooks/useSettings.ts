"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import { useCallback } from "react"
import { getUserSettings, updateUserSettings } from "../api/settingsApi"

export function useSettings() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ["settings"],
    queryFn: getUserSettings,
    retry: 1,
  })

  const settings = data?.settings ?? []

  const updateSetting = useCallback(async (code: string, value: string) => {
    const updated = settings.map((s) => s.code === code ? { ...s, value } : s)
    // Optimistic update
    queryClient.setQueryData(["settings"], { ...data, settings: updated })
    try {
      await updateUserSettings({ settings: updated })
    } catch {
      // Rollback
      queryClient.setQueryData(["settings"], data)
    }
  }, [settings, data, queryClient])

  const getSettingValue = useCallback((code: string) => {
    return settings.find((s) => s.code === code)?.value ?? ""
  }, [settings])

  return {
    settings,
    isLoading,
    error: error ? (error instanceof Error ? error.message : "설정을 불러올 수 없습니다") : null,
    updateSetting,
    getSettingValue,
  }
}
