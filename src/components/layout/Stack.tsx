"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const stackVariants = cva("flex", {
  variants: {
    direction: {
      row: "flex-row",
      column: "flex-col",
      "row-reverse": "flex-row-reverse",
      "column-reverse": "flex-col-reverse",
    },
    gap: {
      none: "gap-0",
      xs: "gap-1",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
      "2xl": "gap-12",
    },
    align: {
      start: "items-start",
      center: "items-center",
      end: "items-end",
      stretch: "items-stretch",
      baseline: "items-baseline",
    },
    justify: {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
      around: "justify-around",
      evenly: "justify-evenly",
    },
    wrap: {
      wrap: "flex-wrap",
      nowrap: "flex-nowrap",
      "wrap-reverse": "flex-wrap-reverse",
    },
  },
  defaultVariants: {
    direction: "column",
    gap: "md",
    align: "stretch",
    justify: "start",
    wrap: "nowrap",
  },
})

export interface StackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof stackVariants> {
  as?: React.ElementType
}

function Stack({
  className,
  direction,
  gap,
  align,
  justify,
  wrap,
  as: Component = "div",
  ...props
}: StackProps) {
  return (
    <Component
      data-slot="stack"
      className={cn(stackVariants({ direction, gap, align, justify, wrap, className }))}
      {...props}
    />
  )
}

// Convenience components
function HStack({
  direction = "row",
  align = "center",
  ...props
}: StackProps) {
  return <Stack direction={direction} align={align} {...props} />
}

function VStack({
  direction = "column",
  ...props
}: StackProps) {
  return <Stack direction={direction} {...props} />
}

export { Stack, HStack, VStack, stackVariants }
