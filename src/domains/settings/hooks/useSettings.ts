"use client"

import { useState, useEffect, useCallback } from "react"
import { getUserSettings, updateUserSettings } from "../api/settingsApi"
import type { SettingCode } from "../types"

export function useSettings() {
  const [settings, setSettings] = useState<SettingCode[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const res = await getUserSettings()
      setSettings(res.settings || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "설정을 불러올 수 없습니다")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchSettings() }, [fetchSettings])

  const updateSetting = useCallback(async (code: string, value: string) => {
    const updated = settings.map((s) => s.code === code ? { ...s, value } : s)
    setSettings(updated)
    try {
      await updateUserSettings({ settings: updated })
    } catch {
      setSettings(settings) // rollback
    }
  }, [settings])

  const getSettingValue = useCallback((code: string) => {
    return settings.find((s) => s.code === code)?.value ?? ""
  }, [settings])

  return { settings, isLoading, error, updateSetting, getSettingValue, refresh: fetchSettings }
}
