import { Car, Footprints, ParkingCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface VehicleSelectorProps {
  hasVehicle: boolean
  onChange: (hasVehicle: boolean) => void
  parkingInfo?: string
}

export function VehicleSelector({ hasVehicle, onChange, parkingInfo }: VehicleSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => onChange(false)}
          className={cn(
            "flex items-center justify-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-colors",
            !hasVehicle
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-border"
          )}
        >
          <Footprints className="size-5" />
          도보
        </button>
        <button
          onClick={() => onChange(true)}
          className={cn(
            "flex items-center justify-center gap-2 p-4 rounded-xl border-2 text-sm font-medium transition-colors",
            hasVehicle
              ? "border-primary bg-primary/5 text-primary"
              : "border-border text-muted-foreground hover:border-border"
          )}
        >
          <Car className="size-5" />
          차량
        </button>
      </div>

      {hasVehicle && parkingInfo && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm text-muted-foreground">
          <ParkingCircle className="size-4 mt-0.5 shrink-0 text-primary" />
          <span>{parkingInfo}</span>
        </div>
      )}
    </div>
  )
}
