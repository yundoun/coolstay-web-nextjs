"use client"

import { Building2, Phone } from "lucide-react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import type { AccommodationDetail } from "../types"

interface BusinessInfoSectionProps {
  accommodation: AccommodationDetail
}

export function BusinessInfoSection({ accommodation }: BusinessInfoSectionProps) {
  const { businessInfo, phoneNumber } = accommodation

  if (!businessInfo) return null

  const {
    trade_name,
    owner_name,
    business_number,
    address,
    phone_number,
    email,
  } = businessInfo

  const callNumber = phoneNumber || phone_number

  const infoRows: { label: string; value: string | undefined }[] = [
    { label: "상호명", value: trade_name },
    { label: "대표자", value: owner_name },
    { label: "사업자등록번호", value: business_number },
    { label: "주소", value: address },
    { label: "전화번호", value: phone_number },
    { label: "이메일", value: email },
  ]

  const visibleRows = infoRows.filter((row) => row.value)

  if (visibleRows.length === 0) return null

  return (
    <div>
      <Accordion type="single" collapsible defaultValue="business-info" className="w-full">
        <AccordionItem value="business-info" className="border-none">
          <AccordionTrigger className="text-xl font-semibold hover:no-underline py-0 mb-4">
            <div className="flex items-center gap-2">
              <Building2 className="size-5 text-muted-foreground" />
              사업자 정보
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 text-sm">
              {visibleRows.map((row) => (
                <div key={row.label} className="flex gap-4">
                  <span className="text-muted-foreground w-28 shrink-0">
                    {row.label}
                  </span>
                  <span className="text-foreground">{row.value}</span>
                </div>
              ))}
            </div>

            {callNumber && (
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  asChild
                >
                  <a href={`tel:${callNumber}`}>
                    <Phone className="size-4" />
                    전화하기
                  </a>
                </Button>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
