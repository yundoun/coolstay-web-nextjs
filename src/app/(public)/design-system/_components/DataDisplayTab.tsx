"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoreHorizontal, Edit, Trash2, Flag } from "lucide-react"

export function DataDisplayTab() {
  return (
    <div className="space-y-8">
      {/* Cards */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Cards</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>숙소명</CardTitle>
              <CardDescription>강남역 도보 5분</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold text-primary">₩89,000~</p>
            </CardContent>
            <CardFooter>
              <Button className="w-full">예약하기</Button>
            </CardFooter>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>리뷰</CardTitle>
              <CardDescription>2024.01.15</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">&ldquo;깨끗하고 좋았어요!&rdquo;</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Badge */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Badge</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </section>

      <Separator />

      {/* Avatar */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Avatar</h2>
        <div className="flex gap-4">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <Avatar><AvatarFallback>JD</AvatarFallback></Avatar>
          <Avatar><AvatarFallback>CS</AvatarFallback></Avatar>
        </div>
      </section>

      <Separator />

      {/* DropdownMenu — 신�� 추가 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Dropdown Menu</h2>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <MoreHorizontal className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Edit className="mr-2 size-4" /> 수정
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Flag className="mr-2 size-4" /> 신고
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 size-4" /> 삭제
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </section>

      <Separator />

      {/* Table */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Table</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>객실명</TableHead>
              <TableHead>인원</TableHead>
              <TableHead>대실</TableHead>
              <TableHead className="text-right">숙박</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">스탠다드 더블</TableCell>
              <TableCell>2명</TableCell>
              <TableCell>₩30,000</TableCell>
              <TableCell className="text-right">₩89,000</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">디럭스 트윈</TableCell>
              <TableCell>2명</TableCell>
              <TableCell>₩40,000</TableCell>
              <TableCell className="text-right">₩120,000</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <Separator />

      {/* Accordion */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Accordion</h2>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger>체크인/체크아웃 시간</AccordionTrigger>
            <AccordionContent>체크인 15:00 / 체크아웃 11:00</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>취소 및 환불 규정</AccordionTrigger>
            <AccordionContent>체크인 3일 전까지 무료 취�� 가능합니다.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>주차 안내</AccordionTrigger>
            <AccordionContent>무료 주차 가능 (선착순)</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <Separator />

      {/* Carousel */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Carousel</h2>
        <Carousel className="w-full max-w-md">
          <CarouselContent>
            {[1, 2, 3, 4].map((i) => (
              <CarouselItem key={i}>
                <Card>
                  <CardContent className="flex aspect-video items-center justify-center p-6 bg-muted">
                    <span className="text-2xl font-semibold">Image {i}</span>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      <Separator />

      {/* Aspect Ratio */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Aspect Ratio</h2>
        <div className="w-[300px]">
          <AspectRatio ratio={16 / 10} className="bg-muted rounded-lg">
            <div className="flex items-center justify-center h-full text-muted-foreground">
              16:10
            </div>
          </AspectRatio>
        </div>
      </section>

      <Separator />

      {/* ScrollArea */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Scroll Area</h2>
        <ScrollArea className="h-[200px] w-full rounded-md border p-4">
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i} className="py-2 border-b last:border-0">
              리뷰 항목 {i + 1}
            </div>
          ))}
        </ScrollArea>
      </section>
    </div>
  )
}
