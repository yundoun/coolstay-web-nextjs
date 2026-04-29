import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function NavigationTab() {
  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
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

      {/* Tabs */}
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

      {/* Pagination */}
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
    </div>
  )
}
