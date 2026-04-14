import { Building2, CreditCard, Landmark, Smartphone, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "../types"

const METHODS: { value: PaymentMethod; label: string; icon: React.ElementType; pgDisabled?: boolean }[] = [
  { value: "card", label: "카드결제", icon: CreditCard },
  { value: "transfer", label: "계좌이체", icon: Landmark, pgDisabled: true },
  { value: "phone", label: "휴대폰결제", icon: Smartphone, pgDisabled: true },
  { value: "onsite", label: "현장결제", icon: Building2 },
]

interface PaymentMethodSelectorProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
  /** 현장결제 비활성화 (노쇼 제재 또는 횟수 초과) */
  onsiteDisabled?: boolean
  /** 현장결제 비활성 사유 */
  onsiteDisabledReason?: string
}

export function PaymentMethodSelector({
  value,
  onChange,
  onsiteDisabled,
  onsiteDisabledReason,
}: PaymentMethodSelectorProps) {
  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {METHODS.map(({ value: method, label, icon: Icon, pgDisabled }) => {
          const disabled = pgDisabled || (method === "onsite" && onsiteDisabled)
          return (
            <button
              key={method}
              onClick={() => !disabled && onChange(method)}
              disabled={disabled}
              className={cn(
                "flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-colors",
                disabled
                  ? "border-border text-muted-foreground/40 cursor-not-allowed"
                  : value === method
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-border"
              )}
            >
              <Icon className="size-6" />
              {label}
              {pgDisabled && <span className="text-[10px] text-muted-foreground/40">준비중</span>}
              {method === "onsite" && onsiteDisabled && (
                <span className="text-[10px] text-destructive/70">이용 제한</span>
              )}
            </button>
          )
        })}
      </div>
      {onsiteDisabled && onsiteDisabledReason && (
        <div className="mt-2 flex items-start gap-2 p-3 rounded-lg bg-destructive/5 border border-destructive/20 text-xs text-destructive">
          <AlertTriangle className="size-4 shrink-0 mt-0.5" />
          <span>{onsiteDisabledReason}</span>
        </div>
      )}
    </div>
  )
}
