"use client"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatRupiah, formatDate } from "@/lib/utils"
import { Check, X, Eye, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
interface Product {
 id: string
 title: string
 price: number
 category: string
 sellerId: string
 images: string[]
 createdAt: string
}

export default function AdminListingsPage() {
 const [listings, setListings] = useState<Product[]>([])
 const [loading, setLoading] = useState(true)
 const [reviewing, setReviewing] = useState<string | null>(null)

  useEffect(() => {
  let cancelled = false
  api.get<{ success: boolean; data: { data: Product[] } }>("/admin/products?status=pending")
  .then((res) => { if (!cancelled) setListings(res.data?.data || res.data || []) })
  .catch(() => {})
  .finally(() => { if (!cancelled) setLoading(false) })

  return () => { cancelled = true }
  }, [])

  const handleReview = async (id: string, action:"active"|"rejected") => {
  setReviewing(id)
  try {
  if (action === "active") {
  await api.patch(`/admin/products/${id}/approve`);
  } else {
  await api.patch(`/admin/products/${id}/reject`, { reason: "Rejected by admin" });
  }
  setListings((prev) => prev.filter((l) => l.id !== id))
  } catch {}
  setReviewing(null)
  }

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]"/>
 </div>
 )
 }

 return (
 <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
 <div className="mb-6">
 <h1 className="text-2xl font-bold text-slate-900">
 Review Listing
 </h1>
 <p className="text-sm text-slate-500 mt-1">
 {listings.length} produk menunggu review
 </p>
 </div>

 <div className="space-y-3">
 {listings.map((listing) => (
 <Card key={listing.id}>
 <CardContent className="p-4">
 <div className="flex items-center gap-4">
 <div className="h-16 w-16 shrink-0 rounded-lg bg-slate-100 flex items-center justify-center text-slate-300">
 {listing.images?.[0] ? (
 <img src={listing.images[0]} alt=""className="h-full w-full object-cover rounded-lg"/>
 ) : (
 <svg className="h-8 w-8"fill="none"viewBox="0 0 24 24"stroke="currentColor">
 <path strokeLinecap="round"strokeLinejoin="round"strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
 </svg>
 )}
 </div>
 <div className="flex-1 min-w-0">
 <div className="flex items-center gap-2">
 <h3 className="text-sm font-medium text-slate-900 truncate">
 {listing.title}
 </h3>
 <Badge variant="secondary"className="text-xs">{listing.category}</Badge>
 </div>
 <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
 <span>ID: {listing.sellerId?.slice(0, 8)}...</span>
 <span>{formatRupiah(listing.price)}</span>
 <span>Diajukan: {formatDate(listing.createdAt)}</span>
 </div>
 </div>
 <div className="flex items-center gap-1">
 <Button variant="ghost"size="icon"title="Lihat detail">
 <Eye className="h-4 w-4"/>
 </Button>
 <Button
 variant="ghost"size="icon"className="text-emerald-500 hover:text-emerald-600"disabled={reviewing === listing.id}
 onClick={() => handleReview(listing.id,"active")}
 >
 <Check className="h-4 w-4"/>
 </Button>
 <Button
 variant="ghost"size="icon"className="text-red-500 hover:text-red-600"disabled={reviewing === listing.id}
 onClick={() => handleReview(listing.id,"rejected")}
 >
 <X className="h-4 w-4"/>
 </Button>
 </div>
 </div>
 </CardContent>
 </Card>
 ))}
 {listings.length === 0 && (
 <div className="py-12 text-center text-sm text-slate-500">
 Tidak ada produk yang menunggu review
 </div>
 )}
 </div>
 </div>
 )
}
