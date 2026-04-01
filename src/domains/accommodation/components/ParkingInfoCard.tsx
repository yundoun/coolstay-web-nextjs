import { Car, CheckCircle, XCircle } from "lucide-react"
import type { AccommodationDetail } from "../types"

interface ParkingInfoCardProps {
  accommodation: AccommodationDetail
}

export function ParkingInfoCard({ accommodation }: ParkingInfoCardProps) {
  const { parkingInfo } = accommodation
  const hasParking = !!parkingInfo && parkingInfo.trim().length > 0

  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border bg-card border-border">
      <Car className="size-5 text-primary mt-0.5 shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium">주차 정보</p>
          {hasParking ? (
            <span className="inline-flex items-center gap-1 text-xs text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
              <CheckCircle className="size-3" />
              주차 가능
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
              <XCircle className="size-3" />
              주차 불가
            </span>
          )}
        </div>
        {hasParking && (
          <p className="text-sm text-muted-foreground mt-1">{parkingInfo}</p>
        )}
      </div>
    </div>
  )
}
