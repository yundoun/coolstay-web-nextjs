import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BookerInfo } from "../types"

interface BookerInfoFormProps {
  value: BookerInfo
  onChange: (info: BookerInfo) => void
}

export function BookerInfoForm({ value, onChange }: BookerInfoFormProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="booker-name">예약자명</Label>
        <Input
          id="booker-name"
          placeholder="이름을 입력하세요"
          value={value.name}
          onChange={(e) => onChange({ ...value, name: e.target.value })}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="booker-phone">연락처</Label>
        <Input
          id="booker-phone"
          type="tel"
          placeholder="010-0000-0000"
          value={value.phone}
          onChange={(e) => onChange({ ...value, phone: e.target.value })}
        />
      </div>
    </div>
  )
}
