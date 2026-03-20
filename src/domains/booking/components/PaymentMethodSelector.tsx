import { Building2, CreditCard, Landmark, Smartphone } from "lucide-react"
import { cn } from "@/lib/utils"
import type { PaymentMethod } from "../types"

const METHODS: { value: PaymentMethod; label: string; icon: React.ElementType }[] = [
  { value: "card", label: "카드결제", icon: CreditCard },
  { value: "transfer", label: "계좌이체", icon: Landmark },
  { value: "phone", label: "휴대폰결제", icon: Smartphone },
  { value: "onsite", label: "현장결제", icon: Building2 },
]

interface PaymentMethodSelectorProps {
  value: PaymentMethod
  onChange: (method: PaymentMethod) => void
}

export function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {METHODS.map(({ value: method, label, icon: Icon }) => (
        <button
          key={method}
          onClick={() => onChange(method)}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-colors",
            value === method
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-gray-300"
          )}
        >
          <Icon className="size-6" />
          {label}
        </button>
      ))}
    </div>
  )
}
