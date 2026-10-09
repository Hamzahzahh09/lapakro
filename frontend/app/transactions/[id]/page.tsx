"use client"
import { useState, useEffect, useCallback } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/store"
import { api } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EscrowTimeline } from "@/components/transaction/escrow-timeline"
import { formatRupiah, formatDate } from "@/lib/utils"
import {
  MessageCircle, AlertTriangle, Clock, Package, Loader2,
  ArrowRight, ShieldCheck, CheckCircle2, XCircle, ArrowRightLeft,
  ChevronLeft, User, DollarSign, RefreshCw
} from "lucide-react"

interface TransactionDetail {
  id: string
  productId: string
  buyerId: string
  sellerId: string
  quantity: number
  totalPrice: number | string
  status: string
  escrowReleased: boolean
  notes?: string
  createdAt: string
  updatedAt: string
  completedAt?: string
  cancelledAt?: string
  deliveredAt?: string | null
  deliveryNotes?: string | null
  product?: {
    id: string
    name: string
    title?: string
    category: string
    images?: string[]
  }
  seller?: { id: string; name: string }
  buyer?: { id: string; name: string }
}

export default function TransactionDetailPage() {
  const params = useParams()
  const router = useRouter()
  const token = useAuthStore((s) => s.token)
  const user = useAuthStore((s) => s.user)

  const [transaction, setTransaction] = useState<TransactionDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionLoading, setActionLoading] = useState(false)
  const [contactLoading, setContactLoading] = useState(false)
  const [syncLoading, setSyncLoading] = useState(false)
  const [deliveryNotes, setDeliveryNotes] = useState("")
  const [deliverError, setDeliverError] = useState("")

  const id = params?.id as string

  const fetchTransaction = useCallback(async () => {
    if (!id || !token) return
    setLoading(true)
    setError("")
    try {
      const res = await api.get<{ success: boolean; data: TransactionDetail }>(`/transactions/${id}`)
      setTransaction(res.data)
    } catch (err: unknown) {
      console.error("Gagal memuat transaksi:", err)
      setError("Gagal memuat data transaksi. Pastikan Anda memiliki akses.")
    } finally {
      setLoading(false)
    }
  }, [id, token])

  useEffect(() => {
    if (!token) {
      router.push("/login")
      return
    }
    fetchTransaction()
  }, [fetchTransaction, router, token])

  const isAdmin = user?.role === "admin" || user?.role === "owner"
  const isBuyer = user?.id === transaction?.buyerId
  const isSeller = user?.id === transaction?.sellerId

  const handleContact = async (targetUserId: string) => {
    if (!transaction) return
    setContactLoading(true)
    try {
      const res = await api.post<{ success: boolean; data: { id: string } }>("/chat/conversation", {
        sellerId: targetUserId,
        transactionId: transaction.id,
        productId: transaction.productId || transaction.product?.id,
      })
      if (res.data?.id) {
        router.push(`/chat?id=${res.data.id}`)
      } else {
        router.push("/chat")
      }
    } catch (err) {
      console.error("Gagal membuka chat:", err)
      router.push("/chat")
    } finally {
      setContactLoading(false)
    }
  }

  const handlePay = async () => {
    if (!transaction) return
    setActionLoading(true)
    try {
      const res = await api.post<{ success: boolean; data: { paymentUrl: string; snapToken?: string } }>(
        "/payment/create",
        {
          amount: Number(transaction.totalPrice),
          method: "bca_va",
          transactionId: transaction.id,
          description: `Pembayaran Transaksi ${transaction.id}`,
          customerDetails: {
            name: user?.name,
            email: user?.email,
          },
        }
      )
      if (res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl
      } else {
        alert("Gagal membuat sesi pembayaran: respons kosong dari server")
      }
    } catch (err: unknown) {
      console.error(err)
      const apiErr = err as {
        message?: string
        data?: { message?: string | string[]; error?: { message?: string | string[] } }
      }
      const raw =
        apiErr?.data?.error && typeof apiErr.data.error === "object"
          ? apiErr.data.error.message
          : apiErr?.data?.message || apiErr?.message
      alert(Array.isArray(raw) ? raw.join(", ") : raw || "Gagal membuat sesi pembayaran")
    } finally {
      setActionLoading(false)
    }
  }

  const handleConfirm = async () => {
    if (!transaction) return
    const msg = isAdmin
      ? transaction.status === "pending"
        ? "Konfirmasi pesanan ini atas nama Penjual (telah dikirim)?"
        : "Konfirmasi pesanan ini atas nama Pembeli (telah diterima)?"
      : isSeller
      ? "Konfirmasi bahwa Anda telah mengirim produk kepada pembeli?"
      : "Konfirmasi bahwa Anda telah menerima produk dan transaksi selesai?"

    if (!confirm(msg)) return
    setActionLoading(true)
    try {
      await api.patch(`/transactions/${transaction.id}/confirm`)
      await fetchTransaction()
    } catch (err: unknown) {
      console.error(err)
      alert("Gagal mengkonfirmasi transaksi")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDeliver = async () => {
    if (!transaction) return
    setDeliverError("")
    const notes = deliveryNotes.trim()
    if (notes.length < 5) {
      setDeliverError("Isi bukti pengiriman dulu (minimal 5 karakter) — contoh: kode redeem Robux / username + password akun / cara klaim gamepass.")
      return
    }
    if (!confirm("Kirim produk ini ke pembeli? Status akan berubah menjadi Menunggu Konfirmasi Pembeli.")) return
    setActionLoading(true)
    try {
      await api.patch(`/transactions/${transaction.id}/confirm`, { deliveryNotes: notes })
      setDeliveryNotes("")
      await fetchTransaction()
    } catch (err: unknown) {
      console.error(err)
      setDeliverError("Gagal mengirim produk. Coba lagi.")
    } finally {
      setActionLoading(false)
    }
  }

  const handleForceComplete = async () => {
    if (!transaction) return
    if (!confirm("Selesaikan transaksi ini sebagai Admin? Status akan berubah ke Selesai dan dana akan diteruskan ke penjual.")) return
    setActionLoading(true)
    try {
      await api.patch(`/transactions/${transaction.id}/complete`)
      await fetchTransaction()
    } catch (err: unknown) {
      console.error(err)
      alert("Gagal menyelesaikan transaksi")
    } finally {
      setActionLoading(false)
    }
  }

  const handleCancel = async () => {
    if (!transaction) return
    if (!confirm("Batalkan transaksi ini?")) return
    setActionLoading(true)
    try {
      await api.patch(`/transactions/${transaction.id}/cancel`)
      await fetchTransaction()
    } catch (err: unknown) {
      console.error(err)
      alert("Gagal membatalkan transaksi")
    } finally {
      setActionLoading(false)
    }
  }

  // Tarik status live dari Midtrans (webhook tidak menjangkau localhost).
  // Kalau sudah dibayar, transaksi ikut maju ke awaiting_seller.
  const handleSyncPayment = async () => {
    if (!transaction) return
    setSyncLoading(true)
    try {
      const res = await api.post<{
        success: boolean
        data: { payment: { status: string }; transaction: { status: string } | null }
      }>("/payment/sync", { transactionId: transaction.id })
      const status = res.data?.payment?.status
      if (status === "completed") {
        alert("Pembayaran terkonfirmasi! Menunggu penjual mengirim produk.")
      } else if (status === "pending") {
        alert("Pembayaran masih pending. Selesaikan pembayaran di Midtrans lalu cek lagi.")
      } else if (status) {
        alert(`Status pembayaran: ${status}.`)
      }
      await fetchTransaction()
    } catch (err: unknown) {
      console.error(err)
      alert("Belum ada pembayaran untuk transaksi ini, atau gagal mengecek ke Midtrans.")
    } finally {
      setSyncLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge variant="success" className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Selesai</Badge>
      case "pending":
        return <Badge variant="warning" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Menunggu Pembayaran/Proses</Badge>
      case "awaiting_seller":
        return <Badge variant="warning" className="flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Sudah Dibayar • Menunggu Penjual</Badge>
      case "awaiting_buyer":
        return <Badge variant="default" className="bg-blue-600 flex items-center gap-1"><Clock className="h-3 w-3" /> Menunggu Konfirmasi Pembeli</Badge>
      case "cancelled":
        return <Badge variant="destructive" className="flex items-center gap-1"><XCircle className="h-3 w-3" /> Dibatalkan</Badge>
      case "disputed":
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> Komplain</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
        <Loader2 className="h-10 w-10 animate-spin text-[#D4A017]" />
        <p className="text-sm font-semibold text-gray-500">Memuat detail transaksi...</p>
      </div>
    )
  }

  if (error || !transaction) {
    return (
      <div className="mx-auto max-w-xl px-4 py-20 text-center">
        <div className="h-16 w-16 mx-auto rounded-2xl bg-red-50 flex items-center justify-center mb-4">
          <AlertTriangle className="h-8 w-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h2>
        <p className="text-gray-500 text-sm mb-6">{error || "Transaksi tidak ditemukan"}</p>
        <Button variant="outline" onClick={() => router.push("/transactions")}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Kembali ke Daftar Transaksi
        </Button>
      </div>
    )
  }

  const productName = transaction.product?.title || transaction.product?.name || "Produk Marketplace"
  const productImage = transaction.product?.images?.[0]

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Navigation & Header */}
        <div className="flex items-center justify-between gap-4 mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.push("/transactions")}
            className="text-gray-600 hover:text-gray-900 -ml-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Kembali
          </Button>

          {isAdmin && (
            <Badge variant="outline" className="bg-amber-50 text-amber-800 border-amber-300 gap-1 px-3 py-1 text-xs">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-600" /> Mode Administrator
            </Badge>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs font-mono font-bold text-gray-400 uppercase tracking-wider">
                ID Transaksi: {transaction.id}
              </span>
              <h1 className="text-2xl font-black text-gray-900 mt-1">Detail Pesanan</h1>
              <p className="text-xs text-gray-500 mt-1">
                Dibuat pada {formatDate(transaction.createdAt)}
              </p>
            </div>
            <div>{getStatusBadge(transaction.status)}</div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Escrow Timeline */}
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-base font-bold text-gray-900">
                  Status & Alur Pesanan Aman
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <EscrowTimeline
                  currentStatus={
                    transaction.status === "completed"
                      ? "completed"
                      : transaction.status === "awaiting_buyer"
                      ? "delivered"
                      : transaction.status === "pending"
                      ? "paid"
                      : transaction.status
                  }
                  isDispute={transaction.status === "disputed"}
                />
              </CardContent>
            </Card>

            {/* Product Details */}
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-base font-bold text-gray-900">
                  Rincian Item
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-20 w-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {productImage ? (
                      <img src={productImage} alt={productName} className="h-full w-full object-cover" />
                    ) : (
                      <Package className="h-8 w-8 text-[#D4A017]" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                      {productName}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs bg-gray-50">
                        {transaction.product?.category || "Item"}
                      </Badge>
                      <span className="text-xs text-gray-400">•</span>
                      <span className="text-xs text-gray-600 font-medium">
                        Kuantitas: {transaction.quantity}x
                      </span>
                    </div>
                  </div>
                </div>

                {transaction.notes && (
                  <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 text-xs text-gray-600">
                    <span className="font-bold text-gray-800">Catatan Pesanan: </span>
                    {transaction.notes}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bukti pengiriman dari seller — terlihat setelah langkah "Seller Kirim" */}
            {transaction.deliveryNotes &&
              ["awaiting_buyer", "completed", "disputed"].includes(transaction.status) && (
                <Card className="bg-amber-50/60 border-amber-200 shadow-sm">
                  <CardHeader className="pb-3 border-b border-amber-100">
                    <CardTitle className="text-base font-bold text-gray-900 flex items-center gap-2">
                      <Package className="h-4 w-4 text-[#D4A017]" />
                      Bukti Pengiriman dari Seller
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-4 space-y-2">
                    <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                      {transaction.deliveryNotes}
                    </p>
                    {transaction.deliveredAt && (
                      <p className="text-xs text-gray-500">
                        Dikirim pada {formatDate(transaction.deliveredAt)}
                      </p>
                    )}
                    {isBuyer && transaction.status === "awaiting_buyer" && (
                      <p className="text-xs text-gray-600 bg-white rounded-lg border border-amber-200 p-2">
                        Cek bukti di atas. Jika sudah diterima, klik{" "}
                        <span className="font-bold">Konfirmasi Penerimaan Barang</span>{" "}
                        di panel Tindakan Transaksi. Jika tidak sesuai, hubungi seller
                        via chat atau ajukan komplain kendala.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

            {/* Parties Info */}
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-base font-bold text-gray-900">
                  Informasi Pihak Terkait
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 divide-y divide-gray-100">
                {/* Penjual */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-amber-50 flex items-center justify-center text-[#D4A017]">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Penjual</p>
                      <p className="text-sm font-bold text-gray-900">
                        {transaction.seller?.name || "Seller"}
                      </p>
                    </div>
                  </div>
                  {(!isSeller || isAdmin) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-gray-200 text-xs gap-1.5"
                      disabled={contactLoading}
                      onClick={() => handleContact(transaction.sellerId)}
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Chat Penjual
                    </Button>
                  )}
                </div>

                {/* Pembeli */}
                <div className="py-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                      <User className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Pembeli</p>
                      <p className="text-sm font-bold text-gray-900">
                        {transaction.buyer?.name || "Buyer"}
                      </p>
                    </div>
                  </div>
                  {(!isBuyer || isAdmin) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-xl border-gray-200 text-xs gap-1.5"
                      disabled={contactLoading}
                      onClick={() => handleContact(transaction.buyerId)}
                    >
                      <MessageCircle className="h-3.5 w-3.5" /> Chat Pembeli
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar / Actions */}
          <div className="space-y-6">
            {/* Price Card */}
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-base font-bold text-gray-900">
                  Ringkasan Pembayaran
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Harga Satuan</span>
                  <span className="font-medium text-gray-800">
                    {formatRupiah(Number(transaction.totalPrice) / (transaction.quantity || 1))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Jumlah</span>
                  <span className="font-medium text-gray-800">{transaction.quantity}x</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Biaya Layanan & Perlindungan</span>
                  <span className="font-medium text-green-600">Gratis (Promo)</span>
                </div>
                <hr className="border-gray-100 my-2" />
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-gray-900">Total Pembayaran</span>
                  <span className="text-xl font-black text-[#D4A017]">
                    {formatRupiah(Number(transaction.totalPrice))}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card className="bg-white border-gray-100 shadow-sm">
              <CardHeader className="pb-3 border-b border-gray-50">
                <CardTitle className="text-base font-bold text-gray-900">
                  Tindakan Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {/* Admin Actions */}
                {isAdmin && (
                  <div className="space-y-2">
                    <p className="text-xs font-bold text-amber-700 bg-amber-50 p-2 rounded-lg border border-amber-200">
                      Tindakan Admin: Anda memiliki wewenang penuh untuk mengeksekusi tahapan transaksi ini.
                    </p>

                    {(transaction.status === "pending" || transaction.status === "awaiting_seller") && (
                      <Button
                        variant="gold"
                        className="w-full font-bold gap-2 rounded-xl"
                        disabled={actionLoading}
                        onClick={handleConfirm}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Konfirmasi Kirim (Langkah Seller)
                      </Button>
                    )}

                    {transaction.status === "awaiting_buyer" && (
                      <Button
                        variant="gold"
                        className="w-full font-bold gap-2 rounded-xl"
                        disabled={actionLoading}
                        onClick={handleConfirm}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Konfirmasi Terima (Langkah Buyer)
                      </Button>
                    )}

                    {transaction.status !== "completed" && transaction.status !== "cancelled" && (
                      <Button
                        variant="default"
                        className="w-full font-bold gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white"
                        disabled={actionLoading}
                        onClick={handleForceComplete}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRightLeft className="h-4 w-4" />}
                        Selesaikan Transaksi (Rilis Dana)
                      </Button>
                    )}

                    {transaction.status !== "completed" && transaction.status !== "cancelled" && (
                      <Button
                        variant="destructive"
                        className="w-full font-bold gap-2 rounded-xl"
                        disabled={actionLoading}
                        onClick={handleCancel}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />}
                        Batalkan Transaksi
                      </Button>
                    )}
                  </div>
                )}

                {/* Normal User Actions */}
                {!isAdmin && (
                  <div className="space-y-2">
                    {/* Buyer: Bayar sekarang */}
                    {transaction.status === "pending" && isBuyer && (
                      <Button
                        variant="gold"
                        className="w-full font-bold gap-2 rounded-xl"
                        disabled={actionLoading}
                        onClick={handlePay}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <DollarSign className="h-4 w-4" />}
                        Bayar Sekarang <ArrowRight className="h-4 w-4" />
                      </Button>
                    )}

                    {/* Buyer/Seller: sinkronkan status dari Midtrans (localhost tanpa webhook) */}
                    {(transaction.status === "pending" || transaction.status === "awaiting_seller") && (isBuyer || isSeller) && (
                      <Button
                        variant="outline"
                        className="w-full rounded-xl border-gray-200 gap-2"
                        disabled={syncLoading}
                        onClick={handleSyncPayment}
                      >
                        {syncLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                        {syncLoading ? "Mengecek..." : "Cek Status Pembayaran"}
                      </Button>
                    )}

                    {/* Seller: Kirim produk (langkah "Seller Kirim") */}
                    {(transaction.status === "pending" || transaction.status === "awaiting_seller") && isSeller && (
                      <div className="rounded-xl border border-amber-200 bg-amber-50/60 p-3 space-y-2">
                        <p className="text-xs font-bold text-amber-800">
                          Langkah 3 — Seller Kirim
                        </p>
                        <p className="text-xs text-gray-600">
                          Masukkan bukti pengiriman (kode redeem / akun / cara klaim).
                          Setelah dikirim, status berubah jadi{" "}
                          <span className="font-semibold">Menunggu Konfirmasi Pembeli</span>{" "}
                          dan pembeli bisa melihat bukti ini.
                        </p>
                        <textarea
                          value={deliveryNotes}
                          onChange={(e) => setDeliveryNotes(e.target.value)}
                          placeholder="Contoh: Kode redeem: XXXX-XXXX — redeem di roblox.com/redeem, atau Username: xxx Password: xxx..."
                          rows={4}
                          className="w-full rounded-xl border border-amber-200 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#D4A017] focus:border-transparent"
                        />
                        {deliverError && (
                          <p className="text-xs font-medium text-red-600">{deliverError}</p>
                        )}
                        <Button
                          variant="gold"
                          className="w-full font-bold gap-2 rounded-xl"
                          disabled={actionLoading}
                          onClick={handleDeliver}
                        >
                          {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                          Kirim Produk Sekarang
                        </Button>
                      </div>
                    )}

                    {/* Buyer: Konfirmasi penerimaan */}
                    {transaction.status === "awaiting_buyer" && isBuyer && (
                      <Button
                        variant="gold"
                        className="w-full font-bold gap-2 rounded-xl"
                        disabled={actionLoading}
                        onClick={handleConfirm}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                        Konfirmasi Penerimaan Barang
                      </Button>
                    )}

                    {/* Pembatalan jika belum selesai */}
                    {transaction.status === "pending" && (isBuyer || isSeller) && (
                      <Button
                        variant="outline"
                        className="w-full border-red-200 text-red-600 hover:bg-red-50 rounded-xl"
                        disabled={actionLoading}
                        onClick={handleCancel}
                      >
                        {actionLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4 mr-1" />}
                        Batalkan Pesanan
                      </Button>
                    )}
                  </div>
                )}

                {/* Chat button for quick communication */}
                <Button
                  variant="outline"
                  className="w-full rounded-xl border-gray-200 gap-2 mt-2"
                  disabled={contactLoading}
                  onClick={() => handleContact(isBuyer ? transaction.sellerId : transaction.buyerId)}
                >
                  <MessageCircle className="h-4 w-4" />
                  {contactLoading ? "Menghubungkan..." : isBuyer ? "Chat Penjual" : isSeller ? "Chat Pembeli" : "Buka Chat"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
