import { Package, CreditCard } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AccommodationDetail } from "../types"

interface ExtraServiceSectionProps {
  accommodation: AccommodationDetail
}

export function ExtraServiceSection({ accommodation }: ExtraServiceSectionProps) {
  const { extraServices, sitePaymentYn } = accommodation

  const visibleServices = extraServices.filter((s) => s.visible_yn === "Y")
  const hasSitePayment = sitePaymentYn === "Y"

  if (visibleServices.length === 0 && !hasSitePayment) return null

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h2 className="text-xl font-semibold">부가 서비스</h2>
        {hasSitePayment && (
          <Badge className="gap-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
            <CreditCard className="size-3.5" />
            현장결제 가능
          </Badge>
        )}
      </div>

      {visibleServices.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {visibleServices.map((service) => (
            <div
              key={service.code}
              className="flex items-center gap-3 p-3 rounded-xl border bg-card border-border"
            >
              {service.image_url ? (
                <img
                  src={service.image_url}
                  alt={service.name}
                  className="size-8 rounded-md object-cover shrink-0"
                />
              ) : (
                <Package className="size-5 text-primary shrink-0" />
              )}
              <span className="text-sm font-medium truncate">
                {service.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
