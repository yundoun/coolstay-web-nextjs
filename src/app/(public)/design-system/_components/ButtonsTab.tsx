import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export function ButtonsTab() {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-2xl font-bold mb-6">Button Variants</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-6">Button Sizes</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
          <Button size="icon"><span>+</span></Button>
        </div>
      </section>

      <Separator />

      <section>
        <h2 className="text-2xl font-bold mb-6">Button States</h2>
        <div className="flex flex-wrap gap-4">
          <Button>Normal</Button>
          <Button disabled>Disabled</Button>
        </div>
      </section>
    </div>
  )
}
