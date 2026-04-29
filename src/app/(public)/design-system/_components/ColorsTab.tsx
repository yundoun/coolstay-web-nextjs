"use client"

import { useEffect, useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"

/** CSS 변수에서 실제 색상값을 읽어오는 헬퍼 */
function useCssVar(varName: string) {
  const [value, setValue] = useState("")
  useEffect(() => {
    const computed = getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
    setValue(computed)
  }, [varName])
  return value
}

function ColorSwatch({ name, cssVar, description }: { name: string; cssVar: string; description?: string }) {
  const color = useCssVar(cssVar)
  return (
    <div className="space-y-2">
      <div
        className="h-20 rounded-lg border"
        style={{ backgroundColor: color || undefined }}
      />
      <p className="text-sm font-medium">{name}</p>
      <p className="text-xs text-muted-foreground font-mono">{cssVar}</p>
      {color && <p className="text-xs text-muted-foreground">{color}</p>}
      {description && <p className="text-xs text-muted-foreground">{description}</p>}
    </div>
  )
}

export function ColorsTab() {
  return (
    <div className="space-y-8">
      {/* Brand Primary */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Brand Primary (Honey Yellow)</h2>
        <div className="grid grid-cols-5 gap-4">
          {[
            { name: "primary-300", cssVar: "--primary-300" },
            { name: "primary-400", cssVar: "--primary-400" },
            { name: "primary-500", cssVar: "--primary-500" },
            { name: "primary-600", cssVar: "--primary-600" },
            { name: "primary-700", cssVar: "--primary-700" },
          ].map((c) => (
            <ColorSwatch key={c.name} name={c.name} cssVar={c.cssVar} />
          ))}
        </div>
      </section>

      <Separator />

      {/* Neutral */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Neutral (Warm Gray)</h2>
        <div className="grid grid-cols-5 gap-4 lg:grid-cols-10">
          {["50", "100", "200", "300", "400", "500", "600", "700", "800", "900"].map((n) => (
            <ColorSwatch key={n} name={n} cssVar={`--neutral-${n}`} />
          ))}
        </div>
      </section>

      <Separator />

      {/* Semantic */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Semantic Colors</h2>
        <div className="grid grid-cols-4 gap-4">
          <ColorSwatch name="Success" cssVar="--success" />
          <ColorSwatch name="Warning" cssVar="--warning" />
          <ColorSwatch name="Error" cssVar="--destructive" />
          <ColorSwatch name="Info" cssVar="--info" />
        </div>
      </section>

      <Separator />

      {/* Theme Tokens */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Theme Tokens</h2>
        <div className="grid grid-cols-4 gap-4 lg:grid-cols-6">
          {[
            { name: "background", cssVar: "--background" },
            { name: "foreground", cssVar: "--foreground" },
            { name: "card", cssVar: "--card" },
            { name: "muted", cssVar: "--muted" },
            { name: "accent", cssVar: "--accent" },
            { name: "border", cssVar: "--border" },
            { name: "ring", cssVar: "--ring" },
            { name: "primary", cssVar: "--primary" },
            { name: "secondary", cssVar: "--secondary" },
          ].map((c) => (
            <ColorSwatch key={c.name} name={c.name} cssVar={c.cssVar} />
          ))}
        </div>
      </section>

      <Separator />

      {/* Social Login */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Social Login</h2>
        <div className="flex gap-4">
          <Button className="bg-[var(--kakao-bg)] text-black hover:bg-[var(--kakao-bg)]/90">
            Kakao Login
          </Button>
          <Button className="bg-[var(--naver-bg)] text-white hover:bg-[var(--naver-bg)]/90">
            Naver Login
          </Button>
        </div>
      </section>
    </div>
  )
}
