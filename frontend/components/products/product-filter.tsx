"use client"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X } from "lucide-react"
const categories = [
 { id: "robux", label:"Robux"},
 { id: "gamepass", label:"Game Pass"},
 { id: "avatar", label:"Item Avatar"},
 { id: "account", label:"Akun"},
 { id: "boosting", label:"Boosting"},
 { id: "joki", label:"Joki"},
]

interface ProductFilterProps {
 onFilterChange: (filters: FilterValues) => void
}

export interface FilterValues {
 categories: string[]
 minPrice: string
 maxPrice: string
 minRating: string
}

export function ProductFilter({ onFilterChange }: ProductFilterProps) {
 const [selectedCategories, setSelectedCategories] = useState<string[]>([])
 const [minPrice, setMinPrice] = useState("")
 const [maxPrice, setMaxPrice] = useState("")
 const [minRating, setMinRating] = useState("")
 const [mobileOpen, setMobileOpen] = useState(false)

 const applyFilters = () => {
 onFilterChange({
 categories: selectedCategories,
 minPrice,
 maxPrice,
 minRating,
 })
 }

 const clearFilters = () => {
 setSelectedCategories([])
 setMinPrice("")
 setMaxPrice("")
 setMinRating("")
 onFilterChange({
 categories: [],
 minPrice:"",
 maxPrice:"",
 minRating:"",
 })
 }

 const toggleCategory = (id: string) => {
 setSelectedCategories((prev) =>
 prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
 )
 }

 const filterContent = (
 <div className="space-y-5">
 <div className="flex items-center justify-between">
 <h3 className="text-sm font-semibold text-slate-900">
 Filter
 </h3>
 <button
 onClick={clearFilters}
 className="text-xs text-[#D4A017] hover:text-[#A67C0A]">
 Reset
 </button>
 </div>

 <div>
 <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
 Kategori
 </h4>
 <div className="space-y-1.5">
 {categories.map((cat) => (
 <label
 key={cat.id}
 className="flex items-center gap-2 cursor-pointer">
 <input
 type="checkbox"checked={selectedCategories.includes(cat.id)}
 onChange={() => toggleCategory(cat.id)}
 className="h-4 w-4 rounded border-slate-300 text-[#D4A017] focus:ring-[#FFD700]"/>
 <span className="text-sm text-slate-600">
 {cat.label}
 </span>
 </label>
 ))}
 </div>
 </div>

 <div>
 <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
 Rentang Harga
 </h4>
 <div className="flex items-center gap-2">
 <Input
 placeholder="Min"value={minPrice}
 onChange={(e) => setMinPrice(e.target.value)}
 className="h-9 text-sm"/>
 <span className="text-slate-400">-</span>
 <Input
 placeholder="Max"value={maxPrice}
 onChange={(e) => setMaxPrice(e.target.value)}
 className="h-9 text-sm"/>
 </div>
 </div>

 <div>
 <h4 className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">
 Rating Minimal
 </h4>
 <div className="flex gap-1">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 onClick={() => setMinRating(star.toString())}
 className={`h-8 w-8 rounded-lg text-sm font-medium transition-colors ${
 minRating === star.toString()
 ?"bg-[#D4A017] text-white":"bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
 >
 {star}
 </button>
 ))}
 </div>
 </div>

 <Button onClick={applyFilters} className="w-full"size="sm">
 Terapkan Filter
 </Button>
 </div>
 )

 return (
 <>
 <button
 onClick={() => setMobileOpen(true)}
 className="lg:hidden flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-600">
 <SlidersHorizontal className="h-4 w-4"/>
 Filter
 </button>

 <div className="hidden lg:block w-64 shrink-0">{filterContent}</div>

 {mobileOpen && (
 <div className="fixed inset-0 z-50 lg:hidden">
 <div
 className="absolute inset-0 bg-black/50"onClick={() => setMobileOpen(false)}
 />
 <div className="absolute right-0 top-0 h-full w-80 bg-white p-6 overflow-y-auto">
 <div className="flex items-center justify-between mb-6">
 <h2 className="font-semibold text-slate-900">
 Filter
 </h2>
 <button onClick={() => setMobileOpen(false)}>
 <X className="h-5 w-5 text-slate-500"/>
 </button>
 </div>
 {filterContent}
 </div>
 </div>
 )}
 </>
 )
}
