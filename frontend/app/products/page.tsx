"use client"

import { useState, useEffect, useCallback } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { ProductFilter, type FilterValues } from "@/components/products/product-filter"
import { SearchBar } from "@/components/products/search-bar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { LayoutGrid, List, Loader2 } from "lucide-react"
import { api } from "@/lib/api"

interface Product {
  id: string
  title: string
  price: number
  images: string[]
  category: string
  averageRating: number
  reviewCount: number
  soldCount: number
  sellerId: string
  status: string
  createdAt: string
}

interface ApiResponse {
  success: boolean
  data: Product[]
  total: number
  page: number
  limit: number
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterValues>({
    categories: [],
    minPrice: "",
    maxPrice: "",
    minRating: "",
  })
  const [searchQuery, setSearchQuery] = useState("")
  const [sort, setSort] = useState("newest")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    try {
      const params: Record<string, string | number | undefined> = {
        page,
        limit: 20,
        sortBy: sort,
        sortOrder: sort === "price_asc" || sort === "price_desc" ? undefined : "desc",
      }

      if (sort === "termurah") { params.sortBy = "price_asc"; params.sortOrder = undefined }
      if (sort === "termahal") { params.sortBy = "price_desc"; params.sortOrder = undefined }
      if (sort === "terbaru") { params.sortBy = "newest" }
      if (sort === "rating") { params.sortBy = "rating" }

      if (searchQuery) params.search = searchQuery
      if (filters.categories.length > 0) params.category = filters.categories[0]
      if (filters.minPrice) params.minPrice = Number(filters.minPrice)
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice)
      if (filters.minRating) params.minRating = Number(filters.minRating)

      const res = await api.get<ApiResponse>("/products", { params })
      setProducts(res.data || [])
      setTotal(res.total || 0)
      setTotalPages(Math.ceil((res.total || 0) / (res.limit || 20)))
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [page, sort, searchQuery, filters])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setPage(1)
  }

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters)
    setPage(1)
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Semua Produk
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Temukan produk Roblox terbaik dari seller terpercaya
        </p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row items-start sm:items-center justify-between mb-6">
        <div className="w-full sm:w-72">
          <SearchBar onSearch={handleSearch} />
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Select value={sort} onValueChange={(v) => { setSort(v); setPage(1) }}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Terbaru</SelectItem>
              <SelectItem value="termurah">Termurah</SelectItem>
              <SelectItem value="termahal">Termahal</SelectItem>
              <SelectItem value="rating">Rating Tertinggi</SelectItem>
            </SelectContent>
          </Select>
          <div className="hidden sm:flex items-center rounded-lg border border-slate-300 dark:border-slate-600">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none"
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex gap-6">
        <ProductFilter onFilterChange={handleFilterChange} />
        <div className="flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-violet-500" />
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
              <p className="text-lg">Tidak ada produk ditemukan</p>
              <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
            </div>
          ) : (
            <>
              <p className="text-sm text-slate-500 mb-4">{total} produk ditemukan</p>
              <ProductGrid products={products} />
            </>
          )}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Sebelumnya
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const start = Math.max(1, page - 2)
                const p = start + i
                if (p > totalPages) return null
                return (
                  <Button
                    key={p}
                    variant={p === page ? "default" : "outline"}
                    size="icon"
                    className="h-9 w-9"
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </Button>
                )
              })}
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Selanjutnya
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
