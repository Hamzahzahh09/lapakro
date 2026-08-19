"use client"
import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { formatRupiah, formatDateShort } from "@/lib/utils"
import { api } from "@/lib/api"
import { Star, Loader2, ShoppingCart, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
interface Review {
 id: string
 buyerId: string
 rating: number
 content: string
 createdAt: string
}

interface ProductDetail {
 id: string
 title: string
 price: number
 category: string
 description: string
 images: string[]
 sellerId: string
 averageRating: number
 reviewCount: number
 soldCount: number
 stock: number
 createdAt: string
}

export default function ProductDetailPage() {
 const params = useParams()
 const router = useRouter()
 const { user, isAuthenticated } = useAuth()
 const [product, setProduct] = useState<ProductDetail | null>(null)
 const [reviews, setReviews] = useState<Review[]>([])
 const [loading, setLoading] = useState(true)
 const [selectedImage, setSelectedImage] = useState(0)
 const [quantity, setQuantity] = useState(1)

  useEffect(() => {
  const id = params?.id as string
  if (!id) return

  let cancelled = false
  Promise.all([
  api.get<{ success: boolean; data: ProductDetail }>(`/products/${id}`),
  api.get<{ success: boolean; data: { reviews: Review[] } }>(`/reviews/product/${id}`),
  ])
  .then(([productRes, reviewsRes]) => {
  if (cancelled) return
  setProduct(productRes.data)
  setReviews(reviewsRes.data?.reviews || [])
  })
  .catch(() => {})
  .finally(() => { if (!cancelled) setLoading(false) })

  return () => { cancelled = true }
  }, [params?.id])

 const handleBuy = () => {
 if (!isAuthenticated || !user) {
 router.push("/login")
 return
 }
 if (!user.isVerified) {
 router.push("/verify-otp")
 return
 }
 router.push(`/transactions/new?productId=${params?.id}&quantity=${quantity}`)
 }

 if (loading) {
 return (
 <div className="flex items-center justify-center min-h-[60vh]">
 <Loader2 className="h-8 w-8 animate-spin text-violet-500"/>
 </div>
 )
 }

 if (!product) {
 return (
 <div className="mx-auto max-w-7xl px-4 py-20 text-center">
 <p className="text-slate-500">Produk tidak ditemukan</p>
 <Button variant="outline"className="mt-4"onClick={() => router.push("/products")}>
 Kembali
 </Button>
 </div>
 )
 }

 const images = product.images?.length ? product.images : [""]

 return (
 <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
 <div className="grid gap-8 lg:grid-cols-3">
 <div className="lg:col-span-2 space-y-6">
 <div className="rounded-xl overflow-hidden bg-slate-100 aspect-square max-w-lg">
 {images[selectedImage] ? (
 <img src={images[selectedImage]} alt={product.title} className="h-full w-full object-cover"/>
 ) : (
 <div className="flex h-full items-center justify-center text-slate-300">
 <svg className="h-24 w-24"fill="none"viewBox="0 0 24 24"stroke="currentColor">
 <path strokeLinecap="round"strokeLinejoin="round"strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
 </svg>
 </div>
 )}
 </div>
 {images.length > 1 && (
 <div className="flex gap-2">
 {images.map((img, i) => (
 <button
 key={i}
 onClick={() => setSelectedImage(i)}
 className={`h-16 w-16 rounded-lg overflow-hidden border-2 ${
 i === selectedImage ?"border-violet-500":"border-transparent"}`}
 >
 {img ? (
 <img src={img} alt=""className="h-full w-full object-cover"/>
 ) : (
 <div className="h-full w-full bg-slate-100"/>
 )}
 </button>
 ))}
 </div>
 )}

 <div>
 <h1 className="text-2xl font-bold text-slate-900">
 {product.title}
 </h1>
 <div className="mt-2 flex items-center gap-2">
 <Badge>{product.category}</Badge>
 <div className="flex items-center gap-1">
 <Star className="h-4 w-4 fill-amber-400 text-amber-400"/>
 <span className="text-sm font-medium">{product.averageRating?.toFixed(1) ||"0.0"}</span>
 <span className="text-sm text-slate-500">
 ({product.reviewCount} ulasan)
 </span>
 </div>
 </div>
 <p className="mt-4 text-3xl font-bold text-violet-500">
 {formatRupiah(product.price)}
 </p>
 <div className="mt-6 whitespace-pre-line text-sm text-slate-600">
 {product.description}
 </div>
 </div>

 <div>
 <h2 className="text-lg font-semibold text-slate-900 mb-4">
 Ulasan Pembeli
 </h2>
 <div className="space-y-4">
 {reviews.length === 0 && (
 <p className="text-sm text-slate-500">Belum ada ulasan</p>
 )}
 {reviews.map((review) => (
 <div key={review.id} className="border-b border-slate-100 pb-4">
 <div className="flex items-center gap-2">
 <span className="text-sm font-medium text-slate-900">
 {review.buyerId?.slice(0, 8)}...
 </span>
 <div className="flex">
 {Array.from({ length: 5 }).map((_, i) => (
 <Star
 key={i}
 className={`h-3.5 w-3.5 ${
 i < review.rating
 ?"fill-amber-400 text-amber-400":"text-slate-300"}`}
 />
 ))}
 </div>
 </div>
 <p className="mt-1 text-sm text-slate-600">
 {review.content}
 </p>
 <p className="mt-1 text-xs text-slate-400">
 {formatDateShort(review.createdAt)}
 </p>
 </div>
 ))}
 </div>
 </div>
 </div>

 <div className="space-y-4">
 <Card>
 <CardContent className="p-4 space-y-4">
 <div className="space-y-1.5 text-xs text-slate-500">
 <p>Terjual: {product.soldCount}</p>
 <p>Stok: {product.stock}</p>
 <p>ID Seller: {product.sellerId?.slice(0, 8)}...</p>
 </div>
 </CardContent>
 </Card>

 <Card>
 <CardContent className="p-4 space-y-4">
 <div>
 <label className="text-sm font-medium text-slate-700">
 Jumlah
 </label>
 <div className="mt-1.5 flex items-center gap-3">
 <button
 onClick={() => setQuantity(Math.max(1, quantity - 1))}
 className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 :bg-slate-700">
 <ChevronLeft className="h-4 w-4"/>
 </button>
 <span className="w-8 text-center text-sm font-medium">{quantity}</span>
 <button
 onClick={() => setQuantity(Math.min(product.stock || 99, quantity + 1))}
 className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-50 :bg-slate-700">
 <ChevronRight className="h-4 w-4"/>
 </button>
 </div>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-sm text-slate-500">Subtotal</span>
 <span className="text-lg font-bold text-violet-500">
 {formatRupiah(product.price * quantity)}
 </span>
 </div>
 <Button className="w-full gap-2"size="lg"onClick={handleBuy}>
 <ShoppingCart className="h-5 w-5"/>
 Beli Sekarang
 </Button>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 )
}
