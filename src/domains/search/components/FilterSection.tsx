"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

interface FilterSectionProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function FilterSection({
  title,
  children,
  defaultOpen = true,
}: FilterSectionProps) {
  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={defaultOpen ? "item" : undefined}
    >
      <AccordionItem value="item" className="border-none">
        <AccordionTrigger className="py-3 text-sm font-semibold hover:no-underline">
          {title}
        </AccordionTrigger>
        <AccordionContent className="pb-4">{children}</AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
