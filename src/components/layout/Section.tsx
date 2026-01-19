"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Container } from "./Container"

const sectionVariants = cva("", {
  variants: {
    spacing: {
      sm: "py-6 md:py-8",
      md: "py-8 md:py-12",
      lg: "py-12 md:py-16",
      xl: "py-16 md:py-24",
    },
    background: {
      default: "bg-background",
      muted: "bg-muted",
      card: "bg-card",
    },
  },
  defaultVariants: {
    spacing: "lg",
    background: "default",
  },
})

export interface SectionProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionVariants> {
  title?: string
  description?: string
  titleClassName?: string
  containerSize?: "wide" | "normal" | "narrow" | "tight"
  containerPadding?: "responsive" | "none"
  headerAction?: React.ReactNode
}

function Section({
  className,
  spacing,
  background,
  title,
  description,
  titleClassName,
  containerSize = "normal",
  containerPadding = "responsive",
  headerAction,
  children,
  ...props
}: SectionProps) {
  return (
    <section
      data-slot="section"
      className={cn(sectionVariants({ spacing, background, className }))}
      {...props}
    >
      <Container size={containerSize} padding={containerPadding}>
        {(title || description || headerAction) && (
          <div className="mb-6 md:mb-8 flex items-end justify-between gap-4">
            <div>
              {title && (
                <h2
                  className={cn(
                    "text-xl font-semibold tracking-tight md:text-2xl lg:text-3xl",
                    titleClassName
                  )}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-muted-foreground md:text-base">
                  {description}
                </p>
              )}
            </div>
            {headerAction && <div className="shrink-0">{headerAction}</div>}
          </div>
        )}
        {children}
      </Container>
    </section>
  )
}

export { Section, sectionVariants }
