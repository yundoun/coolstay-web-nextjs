import { Building2, CreditCard, Landmark, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "../types"

const METHODS: { value: PaymentMethod; label: string; icon: React.ElementType; disabled?: boolean }[] = [
  { value: "card", label: "카드결제", icon: CreditCard, disabled: true },
  { value: "transfer", label: "계좌이체", icon: Landmark, disabled: true },
  { value: "phone", label: "휴대폰결제", icon: Smartphone, disabled: true },
  { value: "onsite", label: "현장결제", icon: Building2 },
]

interface PaymentMethodSelectorProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {METHODS.map(({ value: method, label, icon: Icon, disabled }) => (
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
                : "border-border text-muted-foreground hover:border-gray-300"
          )}
        >
          <Icon className="size-6" />
          {label}
          {disabled && <span className="text-[10px] text-muted-foreground/40">준비중</span>}
        </button>
      ))}
    </div>
  )
}
