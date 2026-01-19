"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const gridVariants = cva("grid", {
  variants: {
    cols: {
      1: "grid-cols-1",
      2: "grid-cols-2",
      3: "grid-cols-3",
      4: "grid-cols-4",
      5: "grid-cols-5",
      6: "grid-cols-6",
      12: "grid-cols-12",
    },
    gap: {
      none: "gap-0",
      sm: "gap-2",
      md: "gap-4",
      lg: "gap-6",
      xl: "gap-8",
    },
    responsive: {
      false: "",
      true: "",
    },
  },
  compoundVariants: [
    {
      responsive: true,
      cols: 2,
      className: "grid-cols-1 sm:grid-cols-2",
    },
    {
      responsive: true,
      cols: 3,
      className: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    },
    {
      responsive: true,
      cols: 4,
      className: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
    },
    {
      responsive: true,
      cols: 5,
      className: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5",
    },
    {
      responsive: true,
      cols: 6,
      className: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6",
    },
  ],
  defaultVariants: {
    cols: 1,
    gap: "md",
    responsive: false,
  },
})

export interface GridProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
  as?: React.ElementType
}

function Grid({
  className,
  cols,
  gap,
  responsive,
  as: Component = "div",
  ...props
}: GridProps) {
  return (
    <Component
      data-slot="grid"
      className={cn(gridVariants({ cols, gap, responsive, className }))}
      {...props}
    />
  )
}

// Grid Item for span control
const gridItemVariants = cva("", {
  variants: {
    colSpan: {
      1: "col-span-1",
      2: "col-span-2",
      3: "col-span-3",
      4: "col-span-4",
      6: "col-span-6",
      12: "col-span-12",
      full: "col-span-full",
    },
    rowSpan: {
      1: "row-span-1",
      2: "row-span-2",
      3: "row-span-3",
      4: "row-span-4",
      full: "row-span-full",
    },
  },
  defaultVariants: {
    colSpan: 1,
    rowSpan: 1,
  },
})

export interface GridItemProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {}

function GridItem({
  className,
  colSpan,
  rowSpan,
  ...props
}: GridItemProps) {
  return (
    <div
      data-slot="grid-item"
      className={cn(gridItemVariants({ colSpan, rowSpan, className }))}
      {...props}
    />
  )
}

export { Grid, GridItem, gridVariants, gridItemVariants }
