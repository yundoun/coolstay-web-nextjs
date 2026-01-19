import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';

// UI Components
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// 개발 모드에서만 접근 가능
export const getServerSideProps: GetServerSideProps = async () => {
  if (process.env.NODE_ENV === 'production') {
    return { notFound: true };
  }
  return { props: {} };
};

export default function DesignSystemPage() {
  const [isDark, setIsDark] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [sliderValue, setSliderValue] = useState([50000]);
  const [progress, setProgress] = useState(60);

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <TooltipProvider>
      <Head>
        <title>Design System | Coolstay (Dev Only)</title>
      </Head>

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
          <div className="container-wide flex h-16 items-center justify-between">
            <h1 className="text-xl font-bold">Coolstay Design System</h1>
            <div className="flex items-center gap-4">
              <Badge variant="outline">35 Components</Badge>
              <Button variant="outline" size="sm" onClick={toggleTheme}>
                {isDark ? 'Light Mode' : 'Dark Mode'}
              </Button>
            </div>
          </div>
        </header>

        <main className="container-wide py-12">
          <Tabs defaultValue="colors" className="space-y-8">
            <TabsList className="flex-wrap">
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="typography">Typography</TabsTrigger>
              <TabsTrigger value="buttons">Buttons</TabsTrigger>
              <TabsTrigger value="forms">Forms</TabsTrigger>
              <TabsTrigger value="data-display">Data Display</TabsTrigger>
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="overlay">Overlay</TabsTrigger>
              <TabsTrigger value="navigation">Navigation</TabsTrigger>
            </TabsList>

            {/* ==================== COLORS ==================== */}
            <TabsContent value="colors" className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-6">Brand Primary (Honey Yellow)</h2>
                <div className="grid grid-cols-5 gap-4">
                  {[
                    { name: '300', color: '#FFDB66' },
                    { name: '400', color: '#FFD033' },
                    { name: '500', color: '#FFC600' },
                    { name: '600', color: '#E6B200' },
                    { name: '700', color: '#A37F00' },
                  ].map((c) => (
                    <div key={c.name} className="space-y-2">
                      <div className="h-20 rounded-lg border" style={{ backgroundColor: c.color }} />
                      <p className="text-sm font-medium">primary-{c.name}</p>
                      <p className="text-xs text-muted-foreground">{c.color}</p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-6">Neutral (Warm Gray)</h2>
                <div className="grid grid-cols-5 gap-4 lg:grid-cols-10">
                  {[
                    { name: '50', color: '#FAFAF9' },
                    { name: '100', color: '#F5F5F4' },
                    { name: '200', color: '#E7E5E4' },
                    { name: '300', color: '#D6D3D1' },
                    { name: '400', color: '#A8A29E' },
                    { name: '500', color: '#78716C' },
                    { name: '600', color: '#57534E' },
                    { name: '700', color: '#44403C' },
                    { name: '800', color: '#292524' },
                    { name: '900', color: '#1C1917' },
                  ].map((c) => (
                    <div key={c.name} className="space-y-2">
                      <div className="h-16 rounded-lg border" style={{ backgroundColor: c.color }} />
                      <p className="text-xs font-medium">{c.name}</p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-6">Semantic Colors</h2>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'Success', color: '#22C55E' },
                    { name: 'Warning', color: '#F59E0B' },
                    { name: 'Error', color: '#EF4444' },
                    { name: 'Info', color: '#3B82F6' },
                  ].map((c) => (
                    <div key={c.name} className="space-y-2">
                      <div className="h-16 rounded-lg" style={{ backgroundColor: c.color }} />
                      <p className="text-sm font-medium">{c.name}</p>
                    </div>
                  ))}
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-6">Social Login</h2>
                <div className="flex gap-4">
                  <Button className="bg-[#FEE500] text-black hover:bg-[#FEE500]/90">Kakao Login</Button>
                  <Button className="bg-[#03C75A] text-white hover:bg-[#03C75A]/90">Naver Login</Button>
                </div>
              </section>
            </TabsContent>

            {/* ==================== TYPOGRAPHY ==================== */}
            <TabsContent value="typography" className="space-y-8">
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
                <h2 className="text-2xl font-bold mb-6">Body & Label</h2>
                <div className="space-y-3">
                  <p className="text-lg">Body LG (18px)</p>
                  <p className="text-base">Body MD (16px) - 기본</p>
                  <p className="text-sm">Body SM (14px)</p>
                  <p className="text-xs">Body XS (12px)</p>
                </div>
              </section>
            </TabsContent>

            {/* ==================== BUTTONS ==================== */}
            <TabsContent value="buttons" className="space-y-8">
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
                  <Button size="icon">
                    <span>+</span>
                  </Button>
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
            </TabsContent>

            {/* ==================== FORMS ==================== */}
            <TabsContent value="forms" className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <section>
                  <h2 className="text-2xl font-bold mb-6">Input & Label</h2>
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
                    <div className="flex items-center space-x-2">
                      <Checkbox id="wifi" />
                      <Label htmlFor="wifi">무료 와이파이</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="parking" />
                      <Label htmlFor="parking">주차 가능</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="breakfast" />
                      <Label htmlFor="breakfast">조식 포함</Label>
                    </div>
                  </div>
                </section>
              </div>

              <Separator />

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

              <div className="grid md:grid-cols-2 gap-8">
                <section>
                  <h2 className="text-2xl font-bold mb-6">Slider (가격 필터)</h2>
                  <div className="space-y-4">
                    <Slider
                      value={sliderValue}
                      onValueChange={setSliderValue}
                      max={200000}
                      step={10000}
                    />
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
            </TabsContent>

            {/* ==================== DATA DISPLAY ==================== */}
            <TabsContent value="data-display" className="space-y-8">
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
                      <p className="text-muted-foreground">"깨끗하고 좋았어요!"</p>
                    </CardContent>
                  </Card>
                </div>
              </section>

              <Separator />

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

              <section>
                <h2 className="text-2xl font-bold mb-6">Avatar</h2>
                <div className="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>CS</AvatarFallback>
                  </Avatar>
                </div>
              </section>

              <Separator />

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

              <section>
                <h2 className="text-2xl font-bold mb-6">Accordion</h2>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>체크인/체크아웃 시간</AccordionTrigger>
                    <AccordionContent>
                      체크인 15:00 / 체크아웃 11:00
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>취소 및 환불 규정</AccordionTrigger>
                    <AccordionContent>
                      체크인 3일 전까지 무료 취소 가능합니다.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>주차 안내</AccordionTrigger>
                    <AccordionContent>
                      무료 주차 가능 (선착순)
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </section>

              <Separator />

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

              <section>
                <h2 className="text-2xl font-bold mb-6">Skeleton</h2>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[250px]" />
                      <Skeleton className="h-4 w-[200px]" />
                    </div>
                  </div>
                </div>
              </section>

              <Separator />

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
            </TabsContent>

            {/* ==================== FEEDBACK ==================== */}
            <TabsContent value="feedback" className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-6">Alert</h2>
                <div className="space-y-4">
                  <Alert>
                    <AlertTitle>안내</AlertTitle>
                    <AlertDescription>예약이 완료되었습니다.</AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertTitle>오류</AlertTitle>
                    <AlertDescription>결제에 실패했습니다. 다시 시도해주세요.</AlertDescription>
                  </Alert>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-6">Progress</h2>
                <div className="space-y-4">
                  <Progress value={progress} className="w-full" />
                  <p className="text-sm text-muted-foreground">예약 진행률: {progress}%</p>
                </div>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-6">Tooltip</h2>
                <div className="flex gap-4">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline">마우스를 올려보세요</Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>툴팁 내용입니다</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
              </section>
            </TabsContent>

            {/* ==================== OVERLAY ==================== */}
            <TabsContent value="overlay" className="space-y-8">
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

              <section>
                <h2 className="text-2xl font-bold mb-6">Collapsible</h2>
                <Collapsible className="w-full space-y-2">
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" className="w-full justify-between">
                      상세 정보 보기
                      <span>▼</span>
                    </Button>
                  </CollapsibleTrigger>
                  <CollapsibleContent className="p-4 border rounded-lg">
                    <p>숨겨진 상세 정보가 여기에 표시됩니다.</p>
                  </CollapsibleContent>
                </Collapsible>
              </section>
            </TabsContent>

            {/* ==================== NAVIGATION ==================== */}
            <TabsContent value="navigation" className="space-y-8">
              <section>
                <h2 className="text-2xl font-bold mb-6">Breadcrumb</h2>
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/">홈</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbLink href="/search">서울</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>강남 호텔</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-6">Tabs</h2>
                <Tabs defaultValue="info" className="w-full">
                  <TabsList>
                    <TabsTrigger value="info">숙소 정보</TabsTrigger>
                    <TabsTrigger value="rooms">객실</TabsTrigger>
                    <TabsTrigger value="reviews">리뷰</TabsTrigger>
                  </TabsList>
                  <TabsContent value="info" className="p-4">숙소 정보 내용</TabsContent>
                  <TabsContent value="rooms" className="p-4">객실 목록</TabsContent>
                  <TabsContent value="reviews" className="p-4">리뷰 목록</TabsContent>
                </Tabs>
              </section>

              <Separator />

              <section>
                <h2 className="text-2xl font-bold mb-6">Pagination</h2>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious href="#" />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#" isActive>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink href="#">3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationNext href="#" />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </section>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </TooltipProvider>
  );
}
