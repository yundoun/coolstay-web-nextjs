"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import type { Policy } from "../types"

interface PolicySectionProps {
  policies: Policy[]
}

export function PolicySection({ policies }: PolicySectionProps) {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">이용 안내</h2>
      <Accordion type="multiple" className="w-full">
        {policies.map((policy, index) => (
          <AccordionItem key={index} value={`policy-${index}`}>
            <AccordionTrigger className="text-sm font-medium">
              {policy.title}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {policy.content}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}
