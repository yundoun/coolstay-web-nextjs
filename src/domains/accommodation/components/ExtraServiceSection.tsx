import { Package } from "lucide-react"
import type { AccommodationDetail } from "../types"

interface ExtraServiceSectionProps {
  accommodation: AccommodationDetail
}

export function ExtraServiceSection({ accommodation }: ExtraServiceSectionProps) {
  const visibleServices = accommodation.extraServices.filter((s) => s.visible_yn === "Y")

  if (visibleServices.length === 0) return null

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-3">부가 서비스</h2>

      {visibleServices.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-3">
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
