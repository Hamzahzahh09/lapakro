"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { hasSufficientRole } from "@/lib/roles"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@radix-ui/react-label"

interface ProductResponse {
  id: string
  title: string
  price: number
  category: string
  status: string
}
const categories = [
 { value:"robux", label:"Robux"},
 { value:"gamepass", label:"Game Pass"},
 { value:"avatar", label:"Item Avatar"},
 { value:"account", label:"Akun"},
 { value:"boosting", label:"Boosting"},
 { value:"joki", label:"Joki"},
]

export default function NewProductPage() {
 const router = useRouter()
 const user = useAuthStore((s) => s.user)
 const token = useAuthStore((s) => s.token)
 const [loading, setLoading] = useState(false)
 const [error, setError] = useState("")
  const [form, setForm] = useState({
  title:"",
  description:"",
  price:"",
  category:"",
  stock:"1",
  imageUrl:"",
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Ukuran gambar maksimal 5MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, imageUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
  if (!token || !user) {
  router.push("/login")
  return
  }
  if (!hasSufficientRole(user.role,"seller")) {
  router.push("/")
  }
  }, [token, user, router])

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setLoading(true)
 setError("")

 if (!form.category) {
 setError("Pilih kategori produk")
 setLoading(false)
 return
 }

 try {
  const res = await api.post<{ success: boolean; data: ProductResponse; message: string }>("/products", {
  title: form.title,
  description: form.description,
  price: Number(form.price),
  category: form.category,
  stock: Number(form.stock) || 1,
  images: form.imageUrl ? [form.imageUrl] : [],
  })
  if (res.data) {
  router.push("/seller/products")
  }
  } catch (err: unknown) {
  const apiErr = err as { response?: { data?: { error?: { message?: string | string[] } } } }
  const msg = apiErr.response?.data?.error?.message || "Gagal menambahkan produk"

  setError(Array.isArray(msg) ? msg.join(",") : msg)
 } finally {
 setLoading(false)
 }
 }

 return (
 <div className="min-h-screen bg-gray-50">
 <div className="bg-white border-b">
 <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
 <div className="flex items-center gap-3">
 <Link href="/seller/products"className="text-gray-400 hover:text-gray-600">
 &larr; Kembali
 </Link>
 <div>
 <h1 className="text-2xl font-bold text-gray-900">Tambah Produk Baru</h1>
 <p className="text-sm text-gray-500 mt-0.5">Lengkapi informasi produk yang akan dijual</p>
 </div>
 </div>
 </div>
 </div>

 <div className="max-w-2xl mx-auto px-4 py-8">
 <Card>
 <CardContent className="p-6">
 {error && (
 <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
 <p className="text-sm text-red-700">{error}</p>
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5">
 <Input
 label="Nama Produk"placeholder="Contoh: Robux 1000 + Bonus 50"value={form.title}
 onChange={(e) => setForm({ ...form, title: e.target.value })}
 required
 minLength={3}
 />

 <div className="space-y-1.5">
 <Label className="text-sm font-medium text-slate-700">
 Deskripsi
 </Label>
 <textarea
 value={form.description}
 onChange={(e) => setForm({ ...form, description: e.target.value })}
 placeholder="Deskripsikan produk Anda (minimal 10 karakter)..."rows={5}
 required
 minLength={10}
 className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"/>
 </div>

 <div className="grid gap-4 sm:grid-cols-2">
 <Input
 label="Harga (Rp)"type="number"placeholder="25000"value={form.price}
 onChange={(e) => setForm({ ...form, price: e.target.value })}
 required
 min="0"/>
 <Input
 label="Stok"type="number"placeholder="1"value={form.stock}
 onChange={(e) => setForm({ ...form, stock: e.target.value })}
 min="0"/>
 </div>
 
 <div className="space-y-1.5">
 <Label className="text-sm font-medium text-slate-700">
 Gambar Produk
 </Label>
 <div className="flex items-center gap-4">
 <Input
 type="file"
 accept="image/*"
 onChange={handleImageUpload}
 className="flex-1 cursor-pointer pt-2 file:mr-4 file:py-1 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#FFD700]/20 file:text-[#D4A017] hover:file:bg-[#FFD700]/30"
 />
 {form.imageUrl && (
 <div className="h-12 w-12 rounded-lg border border-[#EAEAEA] overflow-hidden shrink-0">
 {/* eslint-disable-next-line @next/next/no-img-element */}
 <img src={form.imageUrl} alt="Preview" className="h-full w-full object-cover" />
 </div>
 )}
 </div>
 </div>

 <div className="space-y-1.5">
 <Label className="text-sm font-medium text-slate-700">
 Kategori
 </Label>
 <Select
 value={form.category}
 onValueChange={(value) => setForm({ ...form, category: value })}
 >
 <SelectTrigger>
 <SelectValue placeholder="Pilih kategori"/>
 </SelectTrigger>
 <SelectContent>
 {categories.map((cat) => (
 <SelectItem key={cat.value} value={cat.value}>
 {cat.label}
 </SelectItem>
 ))}
 </SelectContent>
 </Select>
 </div>

 <div className="flex gap-3 pt-2">
 <Button type="submit"className="flex-1"disabled={loading}>
 {loading ?"Menyimpan...":"Simpan Produk"}
 </Button>
 <Button
 type="button"variant="outline"onClick={() => router.back()}
 >
 Batal
 </Button>
 </div>
 </form>
 </CardContent>
 </Card>
 </div>
 </div>
 )
}
