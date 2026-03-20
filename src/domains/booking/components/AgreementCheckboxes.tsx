import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import type { AgreementItem } from "../types"

interface AgreementCheckboxesProps {
  agreements: AgreementItem[]
  allAgreed: boolean
  onToggle: (id: string) => void
  onToggleAll: () => void
}

export function AgreementCheckboxes({
  agreements,
  allAgreed,
  onToggle,
  onToggleAll,
}: AgreementCheckboxesProps) {
  return (
    <div className="space-y-3">
      {/* 전체 동의 */}
      <label className="flex items-center gap-3 p-3 rounded-lg border bg-muted/30 cursor-pointer">
        <Checkbox checked={allAgreed} onCheckedChange={onToggleAll} />
        <span className="text-sm font-semibold">전체 동의</span>
      </label>

      <Separator />

      {/* 개별 항목 */}
      <div className="space-y-2 pl-1">
        {agreements.map((item) => (
          <label
            key={item.id}
            className="flex items-center gap-3 py-1.5 cursor-pointer"
          >
            <Checkbox
              checked={item.checked}
              onCheckedChange={() => onToggle(item.id)}
            />
            <span className="text-sm">
              {item.label}
              <span className={item.required ? "text-red-500 ml-1" : "text-muted-foreground ml-1"}>
                ({item.required ? "필수" : "선택"})
              </span>
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
