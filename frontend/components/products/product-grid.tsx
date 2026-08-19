"use client"
import { useState, useEffect, useCallback } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, ShoppingBag } from "lucide-react"
import { api } from "@/lib/api"
import { ProductCard } from "./product-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
 Select,
 SelectContent,
 SelectItem,
 SelectTrigger,
 SelectValue,
} from "@/components/ui/select"
export interface ProductItem {
 id: string
 title: string
 price: number
 category: string
 imageUrl?: string
 stock: number
 instantDelivery: boolean
 seller: {
 id: string
 name: string
 isVerified: boolean
 }
 rating: number
 soldCount: number
}

const CATEGORIES = [
 { value:"all", label:"Semua Kategori"},
 { value:"robux", label:"Robux"},
 { value:"gamepass", label:"Game Pass"},
 { value:"avatar", label:"Avatar & Items"},
 { value:"account", label:"Akun"},
 { value:"boosting", label:"Boosting/Joki"},
]

const SORTS = [
 { value:"newest", label:"Terbaru"},
 { value:"price_asc", label:"Harga Terendah"},
 { value:"price_desc", label:"Harga Tertinggi"},
 { value:"rating", label:"Rating Tertinggi"},
 { value:"sold", label:"Paling Laris"},
]

export function ProductGrid() {
 const router = useRouter()
 const searchParams = useSearchParams()

 const [products, setProducts] = useState<ProductItem[]>([])
 const [loading, setLoading] = useState(true)
 const [error, setError] = useState("")

 const [search, setSearch] = useState(searchParams.get("search") ||"")
 const [category, setCategory] = useState(searchParams.get("category") ||"all")
 const [sort, setSort] = useState(searchParams.get("sort") ||"newest")

 const fetchProducts = useCallback(async () => {
 setLoading(true)
 setError("")
 try {
 const res = await api.get<{
 success: boolean
 data: ProductItem[]
 total: number
 }>("/products", {
 params: {
 search,
 category: category !=="all"? category : undefined,
 sortBy: sort,
 },
 })
 setProducts(res.data || [])
 } catch (err: unknown) {
 console.error(err)
 setError("Gagal memuat produk")
 setProducts([])
 } finally {
 setLoading(false)
 }
 }, [search, category, sort])

 useEffect(() => {
 // Sync state with URL if URL changes
 const searchParam = searchParams.get("search")
 const categoryParam = searchParams.get("category")
 const sortParam = searchParams.get("sort")

 if (searchParam !== null && searchParam !== search) setTimeout(() => setSearch(searchParam), 0)
 if (categoryParam !== null && categoryParam !== category) setTimeout(() => setCategory(categoryParam), 0)
 if (sortParam !== null && sortParam !== sort) setTimeout(() => setSort(sortParam), 0)
 }, [searchParams, search, category, sort])

 useEffect(() => {
 // Fetch data when filters change
 const delayDebounceFn = setTimeout(() => {
 fetchProducts()
 }, 300)

 return () => clearTimeout(delayDebounceFn)
 }, [fetchProducts])

 const handleFilterChange = (key: string, value: string) => {
 const params = new URLSearchParams(searchParams.toString())
 if (value && value !=="all") {
 params.set(key, value)
 } else {
 params.delete(key)
 }
 router.push(`/products?${params.toString()}`)
 }

 return (
 <div className="space-y-6">
 {/* Premium Filter Header */}
 <div className="bg-white rounded-3xl p-4 md:p-6 border border-gray-100 shadow-sm">
 <div className="flex flex-col gap-4 md:flex-row md:items-center">
 
 {/* Search */}
 <div className="relative flex-1 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280] group-focus-within:text-[#D4A017] transition-colors"/>
 <input
 type="text"placeholder="Cari Robux, gamepass, item..."value={search}
 onChange={(e) => {
 setSearch(e.target.value)
 handleFilterChange("search", e.target.value)
 }}
 className="h-12 w-full rounded-2xl border border-gray-200 bg-gray-50 pl-12 pr-4 text-sm outline-none transition-all focus:border-[#FFD700] focus:bg-white focus:ring-4 focus:ring-[#FFD700]/10 text-[#0F172A]"/>
 </div>

 <div className="flex flex-wrap items-center gap-3">
 {/* Category Select */}
 <div className="w-[180px]">
 <Select
 value={category}
 onValueChange={(val) => {
 setCategory(val)
 handleFilterChange("category", val)
 }}
 >
 <SelectTrigger className="h-12 rounded-2xl bg-gray-50 border-gray-200 focus:bg-white focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/10">
 <div className="flex items-center gap-2">
 <SlidersHorizontal className="h-4 w-4 text-[#6B7280]"/>
 <SelectValue placeholder="Kategori"/>
 </div>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-gray-200 bg-white">
 {CATEGORIES.map((c) => (
 <SelectItem key={c.value} value={c.value} className="rounded-xl focus:bg-[#FFD700]/10 focus:text-[#0F172A]">
 {c.label}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 {/* Sort Select */}
 <div className="w-[180px]">
 <Select
 value={sort}
 onValueChange={(val) => {
 setSort(val)
 handleFilterChange("sort", val)
 }}
 >
 <SelectTrigger className="h-12 rounded-2xl bg-gray-50 border-gray-200 focus:bg-white focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/10">
 <div className="flex items-center gap-2">
 <ArrowUpDown className="h-4 w-4 text-[#6B7280]"/>
 <SelectValue placeholder="Urutkan"/>
 </div>
 </SelectTrigger>
 <SelectContent className="rounded-2xl border-gray-200 bg-white">
 {SORTS.map((s) => (
 <SelectItem key={s.value} value={s.value} className="rounded-xl focus:bg-[#FFD700]/10 focus:text-[#0F172A]">
 {s.label}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>
 </div>
 </div>
 </div>

 {/* Grid Content */}
 <div className="min-h-[400px]">
 {loading ? (
 <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8">
 {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
 <div key={n} className="flex flex-col gap-3">
 <div className="aspect-[4/3] w-full animate-shimmer rounded-2xl bg-gray-200"/>
 <div className="h-4 w-2/3 animate-shimmer rounded-full bg-gray-200"/>
 <div className="h-4 w-1/2 animate-shimmer rounded-full bg-gray-200"/>
 </div>
 ))}
 </div>
 ) : error ? (
 <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
 <div className="h-16 w-16 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
 <RefreshCw className="h-8 w-8 text-red-500 animate-spin-slow"/>
 </div>
 <p className="text-[#0F172A] font-bold text-lg mb-2">{error}</p>
 <Button variant="outline"onClick={fetchProducts} className="mt-4 rounded-xl border-gray-200 bg-white text-[#0F172A] hover:bg-gray-50">
 Coba Lagi
 </Button>
 </div>
 ) : products.length === 0 ? (
 <div className="flex flex-col items-center justify-center py-24 text-center bg-white rounded-3xl border border-dashed border-gray-200">
 <ShoppingBag className="h-16 w-16 text-[#6B7280] mb-4 opacity-50"/>
 <h3 className="text-xl font-bold text-[#0F172A] mb-2">Produk tidak ditemukan</h3>
 <p className="text-[#6B7280] max-w-md mx-auto">
 Maaf, kami tidak dapat menemukan produk yang sesuai dengan filter Anda. Coba gunakan kata kunci atau kategori lain.
 </p>
 <Button variant="gold"onClick={() => { setSearch(""); setCategory("all"); handleFilterChange("search",""); handleFilterChange("category","all") }} className="mt-6 rounded-xl">
 Hapus Filter
 </Button>
 </div>
 ) : (
 <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 lg:gap-8 stagger-children">
 {products.map((product) => (
 <ProductCard key={product.id} product={product} />
 ))}
 </div>
 )}
 </div>
 </div>
 )
}
