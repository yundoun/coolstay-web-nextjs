import { Coins } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface MileageInputProps {
  available: number
  used: number
  onChange: (value: number) => void
  onUseAll: () => void
}

export function MileageInput({ available, used, onChange, onUseAll }: MileageInputProps) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium">마일리지</label>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <Coins className="size-3.5" />
          <span>보유: <strong className="text-foreground">{available.toLocaleString()}</strong>P</span>
        </div>
      </div>
      <div className="flex gap-2">
        <Input
          type="number"
          placeholder="최소 3,000P / 1,000P 단위"
          value={used || ""}
          onChange={(e) => onChange(Number(e.target.value))}
          min={0}
          max={available}
          step={1000}
          className="flex-1"
        />
        <Button variant="outline" size="sm" onClick={onUseAll} className="shrink-0">
          전액 사용
        </Button>
      </div>
      {used > 0 && used < 3000 && (
        <p className="text-xs text-red-500 mt-1">최소 3,000P부터 사용 가능합니다.</p>
      )}
    </div>
  )
}
