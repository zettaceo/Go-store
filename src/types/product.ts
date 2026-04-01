export type MediaType = 'image' | 'video'

export interface MediaItem {
  id: string
  type: MediaType
  url: string
  thumbnailUrl?: string
  alt?: string
}

export interface ProductVariant {
  id: string
  label: string
  inStock: boolean
  availableSizes: string[]
  media: MediaItem[]
  price: number | null
}

export interface Product {
  id: string
  slug: string
  name: string
  category: string
  subcategory: string
  coverImage: string
  featured?: boolean
  isNew?: boolean
  tags: string[]
  variants: ProductVariant[]
  price: number | null
  active: boolean
  driveFolder?: string
}

export interface Category {
  slug: string
  label: string
  parentLabel: string
  count: number
}

export interface NavGroup {
  label: string
  slug: string
  categories: Category[]
}

export interface DB {
  meta: {
    totalProducts: number
    generatedAt: string
    rootFolderId: string
    version: string
  }
  navGroups: NavGroup[]
  products: Product[]
}
