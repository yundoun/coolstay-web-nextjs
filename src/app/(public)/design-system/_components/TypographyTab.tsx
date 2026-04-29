import { Separator } from "@/components/ui/separator"

export function TypographyTab() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-6">Display</h2>
        <div className="space-y-4">
          <p className="text-7xl font-bold tracking-tight">Display 2XL (72px)</p>
          <p className="text-6xl font-bold tracking-tight">Display XL (60px)</p>
          <p className="text-5xl font-bold tracking-tight">Display LG (48px)</p>
          <p className="text-4xl font-bold tracking-tight">Display MD (36px)</p>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-6">Heading</h2>
        <div className="space-y-3">
          <p className="text-3xl font-bold">Heading XL (30px)</p>
          <p className="text-2xl font-bold">Heading LG (24px)</p>
          <p className="text-xl font-semibold">Heading MD (20px)</p>
          <p className="text-lg font-semibold">Heading SM (18px)</p>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-6">Body &amp; Label</h2>
        <div className="space-y-3">
          <p className="text-lg">Body LG (18px)</p>
          <p className="text-base">Body MD (16px) - 기본</p>
          <p className="text-sm">Body SM (14px)</p>
          <p className="text-xs">Body XS (12px)</p>
        </div>
      </section>
    </div>
  )
}
