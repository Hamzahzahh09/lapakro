"use client"
import Link from "next/link"
import { ShieldCheck, Star, Clock, ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { formatRupiah } from "@/lib/utils"
import type { ProductItem } from "./product-grid"
import { RobuxCoin } from "@/components/ui/robux-decorations"
interface ProductCardProps {
 product: ProductItem
}

export function ProductCard({ product }: ProductCardProps) {
 // Determine gradient based on category
 const getGradient = (category: string) => {
 switch (category.toLowerCase()) {
 case"robux":
 return"from-[#FFD700] to-[#D4A017]"// Gold
 case"gamepass":
 return"from-[#3B82F6] to-[#2563EB]"// Blue
 case"avatar":
 return"from-[#FFD700] to-[#D4A017]"// Gold
 default:
 return"from-gray-200 to-gray-300"// Light gray fallback
 }
 }

 return (
 <Link href={`/products/${product.id}`} className="group relative block h-full">
 <div className="relative flex h-full flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 hover:shadow-premium border border-gray-100 hover:border-[#FFD700] hover:-translate-y-1">
 
 {/* Glow effect on hover */}
 <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none"/>

 {/* Product Image Area */}
 <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-gray-100">
 {product.imageUrl ? (
 <img
 src={product.imageUrl}
 alt={product.title}
 className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"/>
 ) : (
 <div className={`absolute inset-0 bg-gradient-to-br ${getGradient(product.category)} opacity-10`} />
 )}

 {/* Fallback Icon if no image */}
 {!product.imageUrl && (
 <div className="absolute inset-0 flex items-center justify-center">
 <RobuxCoin className="h-12 w-12 opacity-40 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-300"/>
 </div>
 )}

 {/* Badges Overlay */}
 <div className="absolute left-3 top-3 flex flex-col gap-1.5">
 <Badge variant="glass"className="font-bold uppercase tracking-wider text-[10px] bg-white/80 text-[#0F172A] border-white/40 shadow-sm backdrop-blur-md">
 {product.category}
 </Badge>
 {product.stock > 0 && product.stock <= 5 && (
 <Badge variant="destructive"className="font-bold text-[10px] shadow-sm">
 Sisa {product.stock}
 </Badge>
 )}
 </div>
 
 <div className="absolute right-3 top-3">
 {product.instantDelivery && (
 <div className="flex items-center gap-1 rounded-full bg-[#22C55E] px-2 py-1 text-[10px] font-bold text-white shadow-sm"title="Pengiriman Instan 10 Menit">
 <Clock className="h-3 w-3"/>
 <span>Instan</span>
 </div>
 )}
 </div>
 </div>

 {/* Content Area */}
 <div className="flex flex-1 flex-col p-4 relative z-10">
 <div className="mb-1 flex items-center justify-between">
 <div className="flex items-center gap-1.5 text-xs text-[#6B7280]">
 <span className="font-medium truncate max-w-[120px]">{product.seller?.name || "Penjual"}</span>
 {product.seller?.isVerified && (
 <ShieldCheck className="h-3.5 w-3.5 text-[#22C55E]"/>
 )}
 </div>
 
 <div className="flex items-center gap-1 rounded-md bg-[#FFFBEB] px-1.5 py-0.5 border border-[#FFD700]/20">
 <Star className="h-3 w-3 fill-[#FFD700] text-[#D4A017]"/>
 <span className="text-[10px] font-bold text-[#D4A017]">
 {(product.rating || 0).toFixed(1)}
 </span>
 </div>
 </div>

 <h3 className="mb-2 line-clamp-2 text-sm font-bold text-[#0F172A] group-hover:text-[#D4A017] transition-colors">
 {product.title}
 </h3>

 <div className="mt-auto pt-3 flex items-end justify-between border-t border-gray-100">
 <div>
 <p className="text-[10px] text-[#6B7280] mb-0.5">Mulai dari</p>
 <p className="text-base font-black text-[#0F172A]">
 {formatRupiah(product.price)}
 </p>
 </div>
 
 <Button size="icon"variant="secondary"className="h-8 w-8 rounded-xl bg-gray-50 text-[#475569] group-hover:bg-[#FFD700] group-hover:text-[#0F172A] transition-all duration-300 border border-gray-200 group-hover:border-[#D4A017] shadow-sm">
 <ShoppingCart className="h-4 w-4"/>
 </Button>
 </div>
 </div>
 </div>
 </Link>
 )
}
