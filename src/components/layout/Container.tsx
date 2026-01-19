"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const containerVariants = cva("mx-auto w-full", {
  variants: {
    size: {
      wide: "max-w-[var(--container-wide)]",
      normal: "max-w-[var(--container-normal)]",
      narrow: "max-w-[var(--container-narrow)]",
      tight: "max-w-[var(--container-tight)]",
    },
    padding: {
      responsive: "px-4 md:px-6 lg:px-10",
      none: "px-0",
    },
  },
  defaultVariants: {
    size: "normal",
    padding: "responsive",
  },
})

export interface ContainerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof containerVariants> {
  as?: React.ElementType
}

function Container({
  className,
  size,
  padding,
  as: Component = "div",
  ...props
}: ContainerProps) {
  return (
    <Component
      data-slot="container"
      className={cn(containerVariants({ size, padding, className }))}
      {...props}
    />
  )
}

export { Container, containerVariants }
