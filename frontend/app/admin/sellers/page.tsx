"use client"

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Store,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  CreditCard,
  User,
  Gamepad2,
  Calendar,
  AlertCircle,
  Eye,
  ArrowLeft,
  Loader2,
  Check,
  X
} from "lucide-react"

interface PendingSellerUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  isVerified: boolean
  sellerApplicationStatus: string
  sellerApplicationNotes: string | null
  createdAt: string
  updatedAt: string
}

interface ParsedApplication {
  storeName?: string
  storeTagline?: string
  categories?: string[]
  operatingHours?: string
  ownerName?: string
  whatsapp?: string
  robloxUsername?: string
  discord?: string
  payoutBank?: string
  payoutAccountNumber?: string
  payoutAccountName?: string
  experience?: string
  reasons?: string
  appliedAt?: string
}

export default function AdminSellersPage() {
  const [sellers, setSellers] = useState<PendingSellerUser[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedUser, setSelectedUser] = useState<PendingSellerUser | null>(null)

  // Action states
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [rejectTargetUser, setRejectTargetUser] = useState<PendingSellerUser | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [actionMessage, setActionMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const fetchPendingSellers = useCallback(async () => {
    try {
      setLoading(true)
      const res = await api.get<{ success: boolean; data: PendingSellerUser[] }>("/admin/pending-sellers")
      setSellers(res.data || [])
    } catch {
      // handle error
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPendingSellers()
  }, [fetchPendingSellers])

  const handleApprove = async (id: string, name: string) => {
    if (!confirm(`Apakah Anda yakin ingin menyetujui ${name} sebagai seller resmi LapakRo?`)) {
      return
    }

    try {
      setProcessingId(id)
      setActionMessage(null)
      await api.patch(`/admin/sellers/${id}/approve`)
      setActionMessage({ type: "success", text: `Seller ${name} berhasil disetujui!` })
      if (selectedUser?.id === id) {
        setSelectedUser(null)
      }
      fetchPendingSellers()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menyetujui seller"
      setActionMessage({ type: "error", text: msg })
    } finally {
      setProcessingId(null)
    }
  }

  const openRejectDialog = (user: PendingSellerUser) => {
    setRejectTargetUser(user)
    setRejectReason("Data verifikasi tidak sesuai atau informasi rekening belum valid.")
    setRejectModalOpen(true)
  }

  const handleConfirmReject = async () => {
    if (!rejectTargetUser) return

    try {
      setProcessingId(rejectTargetUser.id)
      setActionMessage(null)
      await api.patch(`/admin/sellers/${rejectTargetUser.id}/reject`, { reason: rejectReason })
      setActionMessage({ type: "success", text: `Pengajuan ${rejectTargetUser.name} telah ditolak.` })
      setRejectModalOpen(false)
      setRejectTargetUser(null)
      if (selectedUser?.id === rejectTargetUser.id) {
        setSelectedUser(null)
      }
      fetchPendingSellers()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Gagal menolak aplikasi"
      setActionMessage({ type: "error", text: msg })
    } finally {
      setProcessingId(null)
    }
  }

  const parseNotes = (notes: string | null): ParsedApplication => {
    if (!notes) return {}
    try {
      return JSON.parse(notes)
    } catch {
      return { reasons: notes }
    }
  }

  const filtered = sellers.filter((u) => {
    const term = search.toLowerCase()
    const app = parseNotes(u.sellerApplicationNotes)
    return (
      u.name.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term) ||
      (app.storeName && app.storeName.toLowerCase().includes(term)) ||
      (app.robloxUsername && app.robloxUsername.toLowerCase().includes(term))
    )
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
              <Store className="h-6 w-6 text-[#D4A017]" />
              Aplikasi Pendaftaran Seller
            </h1>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Review dan verifikasi permohonan toko baru dari para calon penjual Roblox LapakRo
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="warning" className="px-3 py-1 font-bold">
            {sellers.length} Menunggu Review
          </Badge>
          <Button onClick={fetchPendingSellers} variant="outline" size="sm">
            Refresh
          </Button>
        </div>
      </div>

      {actionMessage && (
        <div
          className={`p-4 rounded-2xl border text-sm flex items-center justify-between ${
            actionMessage.type === "success"
              ? "bg-emerald-50 border-emerald-200 text-emerald-800"
              : "bg-red-50 border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-red-600" />
            )}
            {actionMessage.text}
          </div>
          <button onClick={() => setActionMessage(null)} className="text-slate-400 hover:text-slate-600">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Cari berdasarkan nama toko, username Roblox, nama pemohon, atau email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 h-10 bg-white"
        />
      </div>

      {/* Main List */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[40vh]">
          <Loader2 className="h-8 w-8 animate-spin text-[#D4A017]" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="border-slate-200 bg-white rounded-3xl">
          <CardContent className="p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 mb-4">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Tidak Ada Aplikasi Menunggu</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              Semua pendaftaran seller telah ditinjau atau tidak ada pengajuan baru saat ini.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filtered.map((u) => {
            const app = parseNotes(u.sellerApplicationNotes)
            const isProcessing = processingId === u.id

            return (
              <Card key={u.id} className="border-slate-200 bg-white shadow-xs hover:shadow-md transition-shadow">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    {/* Left: Store & User Information */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-base sm:text-lg font-black text-slate-900">
                          {app.storeName || u.name}
                        </span>
                        {app.storeTagline && (
                          <span className="text-xs text-slate-500 italic hidden sm:inline">
                            "{app.storeTagline}"
                          </span>
                        )}
                        <Badge variant="warning" className="text-[10px]">
                          Pending Review
                        </Badge>
                      </div>

                      {/* Detail Chips */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>
                            Pemilik: <strong>{app.ownerName || u.name}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Gamepad2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>
                            Roblox: <strong>{app.robloxUsername || "-"}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <MessageSquare className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>
                            WA: <strong>{app.whatsapp || u.phone || "-"}</strong>
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <CreditCard className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span>
                            Rekening: <strong>{app.payoutBank || "-"}</strong> ({app.payoutAccountNumber || "-"})
                          </span>
                        </div>
                      </div>

                      {/* Categories Badges */}
                      {app.categories && app.categories.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 pt-1">
                          <span className="text-[11px] text-slate-400 mr-1">Kategori Dijual:</span>
                          {app.categories.map((c) => (
                            <span
                              key={c}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[11px] font-semibold"
                            >
                              {c}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedUser(u)}
                        className="gap-1.5 text-xs font-bold"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Lihat Detail
                      </Button>

                      {app.whatsapp && (
                        <a
                          href={`https://wa.me/${app.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline" className="text-emerald-700 border-emerald-300 gap-1 text-xs">
                            <MessageSquare className="h-3.5 w-3.5 text-emerald-600" />
                            WA
                          </Button>
                        </a>
                      )}

                      <Button
                        size="sm"
                        onClick={() => handleApprove(u.id, app.storeName || u.name)}
                        disabled={isProcessing}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold gap-1 text-xs"
                      >
                        <Check className="h-3.5 w-3.5" />
                        Setujui
                      </Button>

                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openRejectDialog(u)}
                        disabled={isProcessing}
                        className="text-red-600 border-red-200 hover:bg-red-50 text-xs font-bold gap-1"
                      >
                        <X className="h-3.5 w-3.5" />
                        Tolak
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Modal Detail User Application */}
      {selectedUser && (() => {
        const app = parseNotes(selectedUser.sellerApplicationNotes)
        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <div className="relative w-full max-w-2xl rounded-3xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col animate-scale-up">
              {/* Header Modal */}
              <div className="flex items-center justify-between border-b border-slate-100 p-6 bg-slate-50">
                <div>
                  <h3 className="text-xl font-black text-slate-900">
                    Detail Pendaftaran: {app.storeName || selectedUser.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    ID User: {selectedUser.id} • Terdaftar {new Date(selectedUser.createdAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="rounded-full p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Body Modal */}
              <div className="p-6 overflow-y-auto space-y-6 text-sm">
                {/* 1. Informasi Toko */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
                    <Store className="h-4 w-4" /> 1. Informasi Toko
                  </h4>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <p className="text-xs text-slate-500">Nama Toko:</p>
                      <p className="font-bold text-slate-800">{app.storeName || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Jam Operasional:</p>
                      <p className="font-bold text-slate-800">{app.operatingHours || "-"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Slogan / Bio Toko:</p>
                      <p className="font-medium text-slate-700">{app.storeTagline || "-"}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-xs text-slate-500">Kategori Dijual:</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {app.categories?.map((c) => (
                          <Badge key={c} variant="outline" className="text-xs font-bold">
                            {c}
                          </Badge>
                        )) || "-"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 2. Kontak & Roblox */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
                    <User className="h-4 w-4" /> 2. Kontak & Identitas Roblox
                  </h4>
                  <div className="grid grid-cols-2 gap-3 bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <p className="text-xs text-slate-500">Nama Pemilik:</p>
                      <p className="font-bold text-slate-800">{app.ownerName || selectedUser.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email Akun:</p>
                      <p className="font-bold text-slate-800">{selectedUser.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Nomor WhatsApp:</p>
                      <p className="font-bold text-slate-800">{app.whatsapp || selectedUser.phone || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Username Roblox:</p>
                      <p className="font-bold text-slate-800 text-blue-600">{app.robloxUsername || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Discord Tag:</p>
                      <p className="font-bold text-slate-800">{app.discord || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Email Terverifikasi:</p>
                      <p className="font-bold">{selectedUser.isVerified ? "✅ Ya (Verified)" : "❌ Belum"}</p>
                    </div>
                  </div>
                </div>

                {/* 3. Rekening Payout */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4" /> 3. Rekening Pencairan Saldo
                  </h4>
                  <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-2xl">
                    <div>
                      <p className="text-xs text-slate-500">Bank / E-Wallet:</p>
                      <p className="font-bold text-slate-800">{app.payoutBank || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Nomor Rekening:</p>
                      <p className="font-mono font-bold text-slate-800">{app.payoutAccountNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Atas Nama:</p>
                      <p className="font-bold text-slate-800">{app.payoutAccountName || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* 4. Pengalaman & Komitmen */}
                <div className="space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#D4A017] flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> 4. Pengalaman & Komitmen
                  </h4>
                  <div className="bg-slate-50 p-4 rounded-2xl space-y-2">
                    <div>
                      <p className="text-xs text-slate-500">Pengalaman Jualan:</p>
                      <p className="font-bold text-slate-800">{app.experience || "-"}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500">Alasan / Komitmen:</p>
                      <p className="text-slate-700 italic">"{app.reasons || "Tidak ada catatan tambahan"}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Modal Actions */}
              <div className="border-t border-slate-100 p-4 bg-slate-50 flex items-center justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedUser(null)}>
                  Tutup
                </Button>
                <Button
                  variant="outline"
                  onClick={() => openRejectDialog(selectedUser)}
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Tolak Aplikasi
                </Button>
                <Button
                  onClick={() => handleApprove(selectedUser.id, app.storeName || selectedUser.name)}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  Setujui Sekarang
                </Button>
              </div>
            </div>
          </div>
        )
      })()}

      {/* Reject Reason Dialog */}
      {rejectModalOpen && rejectTargetUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-md rounded-3xl bg-white shadow-2xl p-6 space-y-4 animate-scale-up">
            <h3 className="text-lg font-black text-slate-900">Tolak Pendaftaran Seller</h3>
            <p className="text-xs text-slate-500">
              Tuliskan alasan penolakan agar calon seller memahami hal apa yang perlu diperbaiki saat mengajukan ulang:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-red-500 focus:outline-none min-h-[100px]"
              placeholder="Contoh: Nomor WhatsApp tidak aktif atau nomor rekening tidak valid..."
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  setRejectModalOpen(false)
                  setRejectTargetUser(null)
                }}
              >
                Batal
              </Button>
              <Button onClick={handleConfirmReject} className="bg-red-600 hover:bg-red-700 text-white font-bold">
                Konfirmasi Tolak
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
