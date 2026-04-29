"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SearchBar } from "@/components/ui/search-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"

export function FormsTab() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [sliderValue, setSliderValue] = useState([50000])

  return (
    <div className="space-y-8">
      {/* SearchBar */}
      <section>
        <h2 className="text-2xl font-bold mb-6">SearchBar</h2>
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Hero Variant (홈/검색 페이지)</h3>
            <div className="p-8 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900">
              <SearchBar variant="hero" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Compact Variant (헤더)</h3>
            <div className="max-w-md">
              <SearchBar variant="compact" />
            </div>
          </div>
        </div>
      </section>

      <Separator />

      {/* Input & Textarea */}
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Input &amp; Label</h2>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="hello@coolstay.com" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="disabled">Disabled</Label>
              <Input id="disabled" disabled placeholder="Disabled" />
            </div>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6">Textarea</h2>
          <div className="space-y-2">
            <Label htmlFor="review">리뷰 작성</Label>
            <Textarea id="review" placeholder="숙소 이용 후기를 작성해주세요..." />
          </div>
        </section>
      </div>

      <Separator />

      {/* Select & Checkbox */}
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Select</h2>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="지역 선택" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="seoul">서울</SelectItem>
              <SelectItem value="busan">부산</SelectItem>
              <SelectItem value="jeju">제주</SelectItem>
              <SelectItem value="gangneung">강릉</SelectItem>
            </SelectContent>
          </Select>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6">Checkbox</h2>
          <div className="space-y-3">
            {["무료 와이파이", "주차 가능", "조식 포함"].map((label) => (
              <div key={label} className="flex items-center space-x-2">
                <Checkbox id={label} />
                <Label htmlFor={label}>{label}</Label>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Separator />

      {/* RadioGroup & Switch */}
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Radio Group</h2>
          <RadioGroup defaultValue="stay">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="stay" id="stay" />
              <Label htmlFor="stay">숙박</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rent" id="rent" />
              <Label htmlFor="rent">대실</Label>
            </div>
          </RadioGroup>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6">Switch</h2>
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Switch id="notifications" />
              <Label htmlFor="notifications">알림 받기</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="darkmode" />
              <Label htmlFor="darkmode">다크 모드</Label>
            </div>
          </div>
        </section>
      </div>

      <Separator />

      {/* Slider & Calendar */}
      <div className="grid md:grid-cols-2 gap-8">
        <section>
          <h2 className="text-2xl font-bold mb-6">Slider (가격 필터)</h2>
          <div className="space-y-4">
            <Slider value={sliderValue} onValueChange={setSliderValue} max={200000} step={10000} />
            <p className="text-sm text-muted-foreground">
              최대 가격: ₩{sliderValue[0].toLocaleString()}
            </p>
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-6">Calendar</h2>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
        </section>
      </div>
    </div>
  )
}
