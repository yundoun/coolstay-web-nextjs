"use client"

import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function OverlayTab() {
  return (
    <div className="space-y-8">
      {/* Dialog */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Dialog</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Dialog 열기</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>예약 확인</DialogTitle>
              <DialogDescription>예약 정보를 확인해주세요.</DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p>숙소: 강남 호텔</p>
              <p>날짜: 2024.01.20 ~ 2024.01.21</p>
            </div>
            <DialogFooter>
              <Button variant="outline">취소</Button>
              <Button>확인</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      <Separator />

      {/* Alert Dialog */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Alert Dialog</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">예약 취소</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>정말 취소하시겠습니까?</AlertDialogTitle>
              <AlertDialogDescription>
                예약을 취소하면 되돌릴 수 없습니다. 환불 규정에 따라 처리됩니다.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>돌아가기</AlertDialogCancel>
              <AlertDialogAction>취소하기</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      <Separator />

      {/* Sheet — 신규 추가 */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Sheet (Bottom Sheet / Drawer)</h2>
        <div className="flex gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Right Sheet</Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>필터</SheetTitle>
                <SheetDescription>검색 조건을 설정하세요</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">필터 옵션이 여기에 표시됩니다.</p>
              </div>
            </SheetContent>
          </Sheet>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">Bottom Sheet</Button>
            </SheetTrigger>
            <SheetContent side="bottom" className="rounded-t-2xl">
              <SheetHeader>
                <SheetTitle>옵션 선택</SheetTitle>
                <SheetDescription>원하는 옵션을 선택하세요</SheetDescription>
              </SheetHeader>
              <div className="py-4">
                <p className="text-sm text-muted-foreground">모바일에서 주로 사용되는 바텀 시트입니다.</p>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </section>

      <Separator />

      {/* Popover */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Popover</h2>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">인원 선택</Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="space-y-4">
              <h4 className="font-medium">인원 수</h4>
              <div className="flex items-center justify-between">
                <span>성인</span>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">-</Button>
                  <span>2</span>
                  <Button size="sm" variant="outline">+</Button>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </section>

      <Separator />

      {/* Collapsible */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Collapsible</h2>
        <Collapsible className="w-full space-y-2">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              상세 정보 보기
              <span>&#9660;</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 border rounded-lg">
            <p>숨겨진 상세 정보가 여기에 표시됩니다.</p>
          </CollapsibleContent>
        </Collapsible>
      </section>
    </div>
  )
}
