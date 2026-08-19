import { Suspense } from "react"
import { ProductGrid } from "@/components/products/product-grid"
import { Loader2, Search } from "lucide-react"
export const metadata = {
 title:"Eksplor Produk | LapakRo",
 description:"Temukan berbagai macam aset Roblox, Robux, Game Pass, dan lainnya di LapakRo.",
}

export default function ProductsPage() {
 return (
 <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
 {/* Background decoration */}
 <div className="fixed inset-0 bg-cubes opacity-30 pointer-events-none -z-10"/>
 <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none -z-10"/>

 <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
 <div className="mb-8">
 <div className="flex items-center gap-2 text-sm font-bold text-[#D4A017] mb-2">
 <Search className="h-4 w-4"/>
 <span>MARKETPLACE</span>
 </div>
 <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
 Eksplor Produk
 </h1>
 <p className="mt-2 text-[#6B7280] max-w-2xl">
 Temukan Robux, Game Pass, Limiteds, dan berbagai aset Roblox lainnya dari ribuan penjual terpercaya.
 </p>
 </div>

 <Suspense
 fallback={
 <div className="flex flex-col items-center justify-center py-24 space-y-4 bg-white border border-gray-100 shadow-sm rounded-3xl">
 <div className="relative">
 <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-40 rounded-full animate-pulse-slow"/>
 <Loader2 className="h-10 w-10 animate-spin text-[#D4A017] relative z-10"/>
 </div>
 <p className="text-[#6B7280] font-bold">Memuat marketplace...</p>
 </div>
 }
 >
 <ProductGrid />
 </Suspense>
 </div>
 </div>
 )
}
