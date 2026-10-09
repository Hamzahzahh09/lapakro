"use client"
import { useState } from "react"
import { ShieldCheck, CreditCard, ShoppingBag, ArrowRight, Smartphone, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatRupiah } from "@/lib/utils"
import { useCartStore } from "@/lib/store"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import Link from "next/link"
import { EmptyState } from "@/components/ui/empty-state"

const PAYMENT_METHODS = [
  { id: "bca_va", name: "Bank BCA", icon: "BCA", color: "text-blue-600", bg: "bg-blue-50" },
  { id: "mandiri_va", name: "Bank Mandiri", icon: "Mandiri", color: "text-blue-700", bg: "bg-blue-50" },
  { id: "bni_va", name: "Bank BNI", icon: "BNI", color: "text-orange-600", bg: "bg-orange-50" },
  { id: "bri_va", name: "Bank BRI", icon: "BRI", color: "text-blue-600", bg: "bg-blue-50" },
  { id: "qris", name: "QRIS", icon: <Smartphone className="h-5 w-5 text-green-600" />, color: "text-green-600", bg: "bg-green-50" },
  { id: "gopay", name: "GoPay", icon: "GoPay", color: "text-green-500", bg: "bg-green-50" },
]

export default function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCartStore()
  const { user } = useAuth()
  const [selectedMethod, setSelectedMethod] = useState("bca_va")
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const serviceFee = items.length > 0 ? 2500 : 0
  const total = totalPrice()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
        <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <EmptyState
            icon={<ShoppingBag className="h-12 w-12" />}
            title="Tidak ada pesanan"
            description="Keranjang belanja Anda kosong. Tambahkan produk terlebih dahulu."
            action={{ label: "Kembali ke Marketplace", href: "/products" }}
          />
        </div>
      </div>
    )
  }

  const handlePayNow = async () => {
    if (!user) return
    setIsProcessing(true)
    setErrorMsg("")
    try {
      const description = items.map((i) => `${i.title} x${i.quantity}`).join(", ")
      const res = await api.post<{ success: boolean; data: { paymentUrl: string; snapToken: string } }>(
        "/payment/create",
        {
          amount: total + serviceFee,
          method: selectedMethod,
          description,
          customerDetails: {
            name: user.name,
            email: user.email,
          },
        }
      )

      if (res.success && res.data.paymentUrl) {
        // Redirect ke halaman pembayaran Midtrans
        clearCart()
        window.location.href = res.data.paymentUrl
      } else {
        setErrorMsg("Gagal membuat pembayaran, coba lagi.")
      }
    } catch (err: unknown) {
      const error = err as { message?: string }
      setErrorMsg(error?.message || "Gagal membuat pembayaran, coba lagi.")
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
      <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm font-bold text-[#D4A017] mb-2">
            <CreditCard className="h-4 w-4" />
            <span>PEMBAYARAN</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A]">Checkout</h1>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-[#0F172A]">Metode Pembayaran</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setSelectedMethod(method.id)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-all text-left ${
                        selectedMethod === method.id
                          ? "border-[#FFD700] bg-[#FFFBEB] ring-2 ring-[#FFD700]/20"
                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-lg ${method.bg} flex items-center justify-center font-bold text-xs shadow-sm ${method.color}`}>
                        {typeof method.icon === "string" ? method.icon : method.icon}
                      </div>
                      <span className="font-medium text-[#0F172A] text-sm">{method.name}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white border border-gray-100 shadow-sm">
              <CardHeader className="pb-4 border-b border-gray-100">
                <CardTitle className="text-[#0F172A]">Rincian Pesanan</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-16 w-16 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
                      {item.image ? (
                        <img src={item.image} alt={item.title} className="h-full w-full object-cover rounded-xl" />
                      ) : (
                        <ShoppingBag className="h-6 w-6 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-[#0F172A]">{item.title}</h4>
                      <p className="text-sm text-[#6B7280]">{item.quantity} x {formatRupiah(item.price)}</p>
                      <p className="text-xs text-[#6B7280]">Penjual: {item.seller}</p>
                    </div>
                    <p className="font-bold text-[#0F172A]">{formatRupiah(item.price * item.quantity)}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="bg-white border border-gray-100 shadow-sm sticky top-24">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4 text-[#0F172A]">Ringkasan Belanja</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Total Harga ({items.length} barang)</span>
                    <span>{formatRupiah(total)}</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Biaya Layanan</span>
                    <span>{formatRupiah(serviceFee)}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-100 flex justify-between">
                    <span className="font-bold text-[#0F172A]">Total Tagihan</span>
                    <span className="font-black text-xl text-[#0F172A]">{formatRupiah(total + serviceFee)}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100 text-xs text-[#6B7280]">
                  <ShieldCheck className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <p>Transaksi aman menggunakan Midtrans. Dana akan diteruskan ke penjual setelah pesanan selesai.</p>
                </div>

                {errorMsg && (
                  <p className="text-sm text-red-500 mb-3 text-center">{errorMsg}</p>
                )}

                <Button
                  variant="gold"
                  className="w-full shadow-md font-bold"
                  size="lg"
                  onClick={handlePayNow}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Memproses...</>
                  ) : (
                    <>Bayar Sekarang <ArrowRight className="ml-2 h-4 w-4" /></>
                  )}
                </Button>

                <p className="text-center text-xs text-[#6B7280] mt-3">
                  Anda akan diarahkan ke halaman pembayaran Midtrans
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
