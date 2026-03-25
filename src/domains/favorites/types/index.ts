export interface FavoriteAccommodation {
  id: string
  name: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  tags?: string[]
}
