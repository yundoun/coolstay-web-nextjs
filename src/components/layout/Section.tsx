"use client"

import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Container } from "./Container"

const sectionVariants = cva("", {
  variants: {
    spacing: {
      none: "py-0",
      sm: "py-4",
      md: "py-5",
      lg: "py-6",
      xl: "py-10",
    },
    background: {
      default: "",
      surface: "bg-background",
      muted: "bg-muted",
      card: "bg-card",
    },
  },
  defaultVariants: {
    spacing: "md",
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

/**
 * 홈 섹션 래퍼
 * - Container padding="none"으로 고정
 * - 섹션 헤더(타이틀/액션)는 section-px로 패딩
 * - 자식 컴포넌트도 동일한 section-px를 사용
 *   (가로 스크롤 컴포넌트는 -mx로 빼서 edge-to-edge)
 */
function Section({
  className,
  spacing,
  background,
  title,
  description,
  titleClassName,
  containerSize = "narrow",
  containerPadding = "none",
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
        {(title || headerAction) && (
          <div className="mb-3 flex items-end justify-between gap-4 section-px">
            <div>
              {title && (
                <h2 className={cn("text-base font-bold tracking-tight", titleClassName)}>
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
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
