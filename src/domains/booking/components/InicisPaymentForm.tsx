"use client"

import { useEffect, useRef, useState } from "react"
import { createInicisFormData, requestInicisPayment } from "../utils/inicis"
import type { InicisPaymentParams } from "../utils/inicis"

interface Props {
  params: InicisPaymentParams | null
  onClose?: () => void
}

/**
 * 이니시스 PC 웹표준 결제 폼 (hidden)
 * params가 세팅되면 자동으로 결제창을 호출합니다.
 */
export function InicisPaymentForm({ params, onClose }: Props) {
  const formRef = useRef<HTMLFormElement>(null)
  const [formData, setFormData] = useState<Record<string, string> | null>(null)

  useEffect(() => {
    if (!params) return
    createInicisFormData(params).then((data) => {
      setFormData(data)
    })
  }, [params])

  useEffect(() => {
    if (!formData || !formRef.current) return

    const timer = setTimeout(() => {
      try {
        requestInicisPayment("inicisPayForm")
      } catch (err) {
        console.error("이니시스 결제창 호출 실패:", err)
        onClose?.()
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [formData, onClose])

  if (!formData) return null

  return (
    <form
      id="inicisPayForm"
      ref={formRef}
      method="POST"
      acceptCharset="UTF-8"
      style={{ display: "none" }}
    >
      {Object.entries(formData).map(([key, value]) => (
        <input key={key} type="hidden" name={key} value={value} />
      ))}
    </form>
  )
}
