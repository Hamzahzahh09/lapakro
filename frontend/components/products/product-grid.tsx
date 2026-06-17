import { ProductCard } from "@/components/products/product-card"

export interface ProductItem {
  id: string
  title: string
  price: number
  images: string[]
  category: string
  averageRating: number
  reviewCount: number
  soldCount: number
  sellerId: string
  createdAt: string
}

interface ProductGridProps {
  products: ProductItem[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <svg className="h-16 w-16 text-slate-300 dark:text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
        <h3 className="mt-4 text-sm font-medium text-slate-900 dark:text-white">
          Tidak ada produk ditemukan
        </h3>
        <p className="mt-1 text-sm text-slate-500">
          Coba ubah filter atau kata kunci pencarian Anda
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
