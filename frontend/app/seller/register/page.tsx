"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { api } from "@/lib/api"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { RobuxCoin, FloatingRobux } from "@/components/ui/robux-decorations"
import {
  Store,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Gamepad2,
  Send,
  CreditCard,
  Check,
  Phone,
  User as UserIcon,
  HelpCircle,
  TrendingUp,
  Coins,
  ShieldAlert,
  FileText,
  Building,
  MessageSquare
} from "lucide-react"

interface SellerFormData {
  storeName: string
  storeTagline: string
  categories: string[]
  operatingHours: string
  ownerName: string
  whatsapp: string
  robloxUsername: string
  discord: string
  payoutBank: string
  payoutAccountNumber: string
  payoutAccountName: string
  experience: string
  reasons: string
  agreementLegal: boolean
  agreementEscrow: boolean
  agreementFulfillment: boolean
}

const CATEGORY_OPTIONS = [
  { id: "robux", label: "Robux (Gamepass)", desc: "Pengiriman via transfer gamepass/group funds" },
  { id: "gamepass", label: "Item & Gamepass", desc: "Gamepass Blox Fruits, Pet Simulator, Blade Ball, dll." },
  { id: "accounts", label: "Akun Roblox", desc: "Akun verified, stacked item, game progress" },
  { id: "limiteds", label: "Limiteds & Collectibles", desc: "Item limited UGC & Roblox catalog" },
  { id: "service", label: "Jasa Joki / Leveling", desc: "Bantuan leveling, raid, dungeon, grinding" },
]

const PAYOUT_METHODS = [
  { id: "BCA", name: "Bank Central Asia (BCA)", type: "bank" },
  { id: "MANDIRI", name: "Bank Mandiri", type: "bank" },
  { id: "BRI", name: "Bank Rakyat Indonesia (BRI)", type: "bank" },
  { id: "BNI", name: "Bank Negara Indonesia (BNI)", type: "bank" },
  { id: "DANA", name: "DANA E-Wallet", type: "ewallet" },
  { id: "GOPAY", name: "GoPay Indonesia", type: "ewallet" },
  { id: "OVO", name: "OVO Cash", type: "ewallet" },
  { id: "SHOPEEPAY", name: "ShopeePay", type: "ewallet" },
]

export default function SellerRegisterPage() {
  const router = useRouter()
  const { user, isAuthenticated, refreshProfile } = useAuth()

  const [step, setStep] = useState<number>(1)
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [successSubmitted, setSuccessSubmitted] = useState(false)
  const [isReapplying, setIsReapplying] = useState(false)

  // Status check from backend
  const [appStatus, setAppStatus] = useState<string | null>(null)
  const [appNotes, setAppNotes] = useState<string | null>(null)
  const [loadingStatus, setLoadingStatus] = useState(true)

  const [form, setForm] = useState<SellerFormData>({
    storeName: "",
    storeTagline: "",
    categories: ["robux", "gamepass"],
    operatingHours: "08:00 - 22:00 WIB",
    ownerName: user?.name || "",
    whatsapp: user?.phone || "",
    robloxUsername: "",
    discord: "",
    payoutBank: "BCA",
    payoutAccountNumber: "",
    payoutAccountName: user?.name || "",
    experience: "experienced_other",
    reasons: "",
    agreementLegal: false,
    agreementEscrow: false,
    agreementFulfillment: false,
  })

  // Load latest seller application status from backend
  useEffect(() => {
    if (!isAuthenticated) {
      setLoadingStatus(false)
      return
    }

    api.get<{ success: boolean; data: { status: string; notes: string | null } }>("/users/seller-status")
      .then((res) => {
        if (res.data) {
          setAppStatus(res.data.status)
          setAppNotes(res.data.notes)
        }
      })
      .catch(() => {
        // Fallback to local user entity
        if (user) {
          setAppStatus(user.sellerApplicationStatus || "none")
          setAppNotes(user.sellerApplicationNotes || null)
        }
      })
      .finally(() => {
        setLoadingStatus(false)
      })
  }, [isAuthenticated, user])

  // Sync initial user details when user profile becomes available
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        ownerName: prev.ownerName || user.name || "",
        whatsapp: prev.whatsapp || user.phone || "",
        payoutAccountName: prev.payoutAccountName || user.name || "",
      }))
    }
  }, [user])

  const toggleCategory = (catId: string) => {
    setForm((prev) => {
      const exists = prev.categories.includes(catId)
      if (exists) {
        if (prev.categories.length <= 1) return prev // at least 1 category
        return { ...prev, categories: prev.categories.filter((c) => c !== catId) }
      } else {
        return { ...prev, categories: [...prev.categories, catId] }
      }
    })
  }

  // Validate step before proceeding
  const validateStep = (currentStep: number): boolean => {
    setErrorMsg(null)
    if (currentStep === 1) {
      if (!form.storeName.trim()) {
        setErrorMsg("Nama Toko wajib diisi.")
        return false
      }
      if (form.storeName.trim().length < 3) {
        setErrorMsg("Nama Toko minimal 3 karakter.")
        return false
      }
      if (form.categories.length === 0) {
        setErrorMsg("Pilih minimal 1 kategori produk yang akan dijual.")
        return false
      }
      return true
    }

    if (currentStep === 2) {
      if (!form.ownerName.trim()) {
        setErrorMsg("Nama lengkap pemilik wajib diisi.")
        return false
      }
      if (!form.whatsapp.trim()) {
        setErrorMsg("Nomor WhatsApp aktif wajib diisi untuk koordinasi pesanan.")
        return false
      }
      if (form.whatsapp.trim().length < 8) {
        setErrorMsg("Nomor WhatsApp tidak valid.")
        return false
      }
      if (!form.robloxUsername.trim()) {
        setErrorMsg("Username Roblox utama wajib diisi.")
        return false
      }
      return true
    }

    if (currentStep === 3) {
      if (!form.payoutAccountNumber.trim()) {
        setErrorMsg("Nomor rekening / e-wallet wajib diisi.")
        return false
      }
      if (!form.payoutAccountName.trim()) {
        setErrorMsg("Nama pemilik rekening wajib diisi.")
        return false
      }
      return true
    }

    if (currentStep === 4) {
      if (!form.agreementLegal || !form.agreementEscrow || !form.agreementFulfillment) {
        setErrorMsg("Harap centang semua pernyataan persetujuan dan ketentuan seller.")
        return false
      }
      return true
    }

    return true
  }

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(prev + 1, 4))
      window.scrollTo({ top: 300, behavior: "smooth" })
    }
  }

  const handlePrev = () => {
    setErrorMsg(null)
    setStep((prev) => Math.max(prev - 1, 1))
    window.scrollTo({ top: 300, behavior: "smooth" })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep(4)) return

    if (!user?.isVerified) {
      setErrorMsg("Email Anda belum diverifikasi. Silakan verifikasi email terlebih dahulu.")
      return
    }

    setSubmitting(true)
    setErrorMsg(null)

    try {
      // 1. Prepare structured notes payload
      const notesPayload = JSON.stringify({
        storeName: form.storeName.trim(),
        storeTagline: form.storeTagline.trim(),
        categories: form.categories,
        operatingHours: form.operatingHours.trim(),
        ownerName: form.ownerName.trim(),
        whatsapp: form.whatsapp.trim(),
        robloxUsername: form.robloxUsername.trim(),
        discord: form.discord.trim(),
        payoutBank: form.payoutBank,
        payoutAccountNumber: form.payoutAccountNumber.trim(),
        payoutAccountName: form.payoutAccountName.trim(),
        experience: form.experience,
        reasons: form.reasons.trim(),
        appliedAt: new Date().toISOString(),
      })

      // 2. Update user phone if not present
      if (!user.phone && form.whatsapp) {
        try {
          await api.patch("/users/profile", { phone: form.whatsapp.trim() })
        } catch {
          // non-critical, proceed
        }
      }

      // 3. Post seller application
      await api.post("/users/apply-seller", { notes: notesPayload })

      // 4. Refresh auth state
      if (refreshProfile) {
        await refreshProfile()
      }

      setAppStatus("pending")
      setSuccessSubmitted(true)
      setIsReapplying(false)
      window.scrollTo({ top: 150, behavior: "smooth" })
    } catch (err: unknown) {
      const errMessage = err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim pendaftaran"
      setErrorMsg(errMessage)
    } finally {
      setSubmitting(false)
    }
  }

  // Parse notes if existing
  let parsedNotes: Partial<SellerFormData> | null = null
  if (appNotes) {
    try {
      parsedNotes = JSON.parse(appNotes)
    } catch {
      // fallback plain text
    }
  }

  // Helper: Is already seller
  const isApprovedSeller = user?.role === "seller" || user?.role === "admin" || user?.role === "owner" || appStatus === "approved"

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* Top Banner & Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#111827] via-[#1E293B] to-[#0F172A] text-white pt-14 pb-20">
        <div className="absolute inset-0 bg-cubes opacity-20 pointer-events-none" />
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#FFD700] rounded-full blur-[140px] opacity-15 pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#F59E0B] rounded-full blur-[130px] opacity-10 pointer-events-none" />
        <FloatingRobux size="sm" className="top-12 right-20 opacity-40 hidden md:block" delay={0} duration={6} />
        <FloatingRobux size="md" className="bottom-8 left-16 opacity-30 hidden md:block" delay={2} duration={7} />

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#FFD700]/30 bg-[#FFD700]/10 px-4 py-1.5 text-xs font-bold text-[#FFD700] backdrop-blur-md mb-6 shadow-sm">
            <Sparkles className="h-4 w-4" />
            PROGRAM KEMITRAAN RESMI SELLER LAPAKRO
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
            Buka Toko & Raih Cuan dari <span className="text-[#FFD700]">Roblox</span>
          </h1>
          <p className="mx-auto max-w-2xl text-base sm:text-lg text-slate-300">
            Jual Robux, Item, Gamepass, dan Akun Roblox dengan sistem escrow aman 100%,
            pencairan saldo cepat, dan jangkauan ribuan pembeli setiap hari.
          </p>

          {/* Key Advantages Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10 text-left">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#FFD700] mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">Garansi Anti-Scam</p>
              <p className="text-xs text-slate-400 mt-0.5">Sistem escrow melindungi dana Anda sampai pesanan selesai</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#FFD700] mb-3">
                <Coins className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">Biaya Paling Rendah</p>
              <p className="text-xs text-slate-400 mt-0.5">Tanpa biaya pendaftaran. Bebas jualan kapan saja</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#FFD700] mb-3">
                <CreditCard className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">Withdraw Cepat</p>
              <p className="text-xs text-slate-400 mt-0.5">Tarik saldo langsung ke rekening BCA, Mandiri & E-Wallet</p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFD700]/20 text-[#FFD700] mb-3">
                <TrendingUp className="h-5 w-5" />
              </div>
              <p className="text-sm font-bold text-white">Ribuan Pembeli Aktif</p>
              <p className="text-xs text-slate-400 mt-0.5">Komunitas gamers Roblox se-Indonesia menunggu tokomu</p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 -mt-8 relative z-20">
        {/* State 1: Not Authenticated */}
        {!isAuthenticated && (
          <Card className="border-slate-200/80 shadow-xl bg-white rounded-3xl overflow-hidden">
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#FFD700]/20 text-[#D4A017] mb-6">
                <Store className="h-8 w-8" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 mb-2">Masuk untuk Memulai Pendaftaran Toko</h2>
              <p className="text-sm sm:text-base text-slate-600 max-w-md mx-auto mb-8">
                Anda perlu memiliki akun LapakRo terlebih dahulu untuk mendaftar sebagai seller resmi kami.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/login?redirect=/seller/register" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-[#FFD700] text-slate-900 hover:bg-[#FACC15] font-bold px-8 shadow-md">
                    Masuk ke Akun
                  </Button>
                </Link>
                <Link href="/register?redirect=/seller/register" className="w-full sm:w-auto">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto border-slate-300 font-bold px-8">
                    Daftar Akun Baru
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State 2: Authenticated but Email NOT verified */}
        {isAuthenticated && user && !user.isVerified && (
          <Card className="border-amber-200 bg-amber-50/70 shadow-lg rounded-3xl mb-8">
            <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <ShieldAlert className="h-7 w-7" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-amber-900">Verifikasi Email Diperlukan</h3>
                <p className="text-sm text-amber-800 mt-1">
                  Untuk keamanan transaksi dan aktivasi toko seller, silakan verifikasi alamat email Anda (<strong>{user.email}</strong>) terlebih dahulu melalui kode OTP.
                </p>
              </div>
              <Link href="/verify-otp" className="shrink-0 w-full sm:w-auto">
                <Button className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-bold">
                  Verifikasi Sekarang
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}

        {/* State 3: Already Approved Seller */}
        {isAuthenticated && isApprovedSeller && (
          <Card className="border-emerald-200 shadow-xl bg-white rounded-3xl overflow-hidden mb-8">
            <div className="h-3 bg-gradient-to-r from-emerald-400 to-teal-500" />
            <CardContent className="p-8 sm:p-12 text-center">
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-6 animate-bounce-slow">
                <CheckCircle2 className="h-10 w-10" />
              </div>
              <Badge variant="success" className="px-4 py-1.5 text-xs font-bold mb-4">
                SELLER TERVERIFIKASI
              </Badge>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                Selamat! Anda Sudah Terdaftar Sebagai Seller
              </h2>
              <p className="text-slate-600 max-w-lg mx-auto mb-8 text-sm sm:text-base">
                Toko Anda sudah aktif di LapakRo. Anda sekarang dapat menambahkan produk Robux, gamepass, atau item lainnya untuk langsung mulai berjualan!
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/seller/dashboard" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-[#111827] text-white hover:bg-slate-800 font-bold px-8 gap-2">
                    <Store className="h-4 w-4" />
                    Buka Dashboard Seller
                  </Button>
                </Link>
                <Link href="/seller/products/new" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto bg-[#FFD700] text-slate-900 hover:bg-[#FACC15] font-bold px-8 gap-2">
                    <Sparkles className="h-4 w-4" />
                    Tambah Produk Baru
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State 4: Application Pending */}
        {isAuthenticated && !isApprovedSeller && (appStatus === "pending" || successSubmitted) && !isReapplying && (
          <Card className="border-amber-200 shadow-xl bg-white rounded-3xl overflow-hidden mb-8">
            <div className="h-3 bg-gradient-to-r from-[#FFD700] to-amber-500" />
            <CardContent className="p-8 sm:p-12">
              <div className="text-center max-w-2xl mx-auto">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 text-amber-600 mb-6">
                  <Clock className="h-10 w-10 animate-spin-slow" />
                </div>
                <Badge variant="warning" className="px-4 py-1.5 text-xs font-bold mb-4">
                  PENGAJUAN SEDANG DITINJAU
                </Badge>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900 mb-3">
                  Pendaftaran Seller Anda Sedang Direview
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mb-8">
                  Terima kasih telah mendaftar sebagai mitra seller di LapakRo! Tim verifikasi kami sedang memeriksa data dan rekening toko Anda. Proses review biasanya memakan waktu <strong>1x24 jam kerja</strong>.
                </p>

                {/* Progress Steps Timeline */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 my-8 text-center border-y border-slate-100 py-6">
                  <div className="flex flex-col items-center">
                    <div className="h-9 w-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold mb-2">
                      <Check className="h-5 w-5" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">Form Terkirim</p>
                    <p className="text-[11px] text-slate-400">Selesai</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-9 w-9 rounded-full bg-[#FFD700] text-slate-900 flex items-center justify-center text-sm font-bold mb-2 shadow-sm animate-pulse">
                      <Clock className="h-4 w-4" />
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-amber-700">Verifikasi Tim</p>
                    <p className="text-[11px] text-amber-600 font-medium">Dalam Proses</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-9 w-9 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center text-sm font-bold mb-2">
                      3
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-400">Toko Aktif</p>
                    <p className="text-[11px] text-slate-400">Menunggu</p>
                  </div>
                </div>

                {/* Submission Details Summary (if readable) */}
                {parsedNotes && (
                  <div className="bg-slate-50 rounded-2xl p-6 text-left border border-slate-100 mb-8 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1.5">
                      <FileText className="h-4 w-4" /> Ringkasan Data Pengajuan:
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                      <div>
                        <span className="text-slate-500">Nama Toko:</span>{" "}
                        <span className="font-bold text-slate-800">{parsedNotes.storeName || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Username Roblox:</span>{" "}
                        <span className="font-bold text-slate-800">{parsedNotes.robloxUsername || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">WhatsApp:</span>{" "}
                        <span className="font-bold text-slate-800">{parsedNotes.whatsapp || "-"}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Pencairan:</span>{" "}
                        <span className="font-bold text-slate-800">
                          {parsedNotes.payoutBank} - {parsedNotes.payoutAccountNumber} ({parsedNotes.payoutAccountName})
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link href="/" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full sm:w-auto border-slate-300">
                      Kembali ke Beranda
                    </Button>
                  </Link>
                  <a
                    href="https://wa.me/6281234567890?text=Halo%20Admin%20LapakRo,%20saya%20sudah%20mengajukan%20pendaftaran%20seller%20mohon%20dicek"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto"
                  >
                    <Button className="w-full sm:w-auto bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold gap-2">
                      <MessageSquare className="h-4 w-4" />
                      Hubungi CS via WhatsApp
                    </Button>
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* State 5: Application Rejected (Show Reason & Re-apply button) */}
        {isAuthenticated && !isApprovedSeller && appStatus === "rejected" && !isReapplying && (
          <Card className="border-red-200 shadow-xl bg-white rounded-3xl overflow-hidden mb-8">
            <div className="h-3 bg-red-500" />
            <CardContent className="p-8 sm:p-12 text-center max-w-2xl mx-auto">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600 mb-6">
                <AlertCircle className="h-8 w-8" />
              </div>
              <Badge variant="destructive" className="px-4 py-1.5 text-xs font-bold mb-4">
                PENGAJUAN DITOLAK
              </Badge>
              <h2 className="text-2xl font-black text-slate-900 mb-2">
                Pengajuan Seller Belum Dapat Disetujui
              </h2>
              <p className="text-slate-600 text-sm mb-6">
                Mohon maaf, pengajuan pendaftaran seller Anda sebelumnya belum memenuhi kriteria verifikasi.
              </p>

              {appNotes && (
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-left text-sm text-red-800 mb-8">
                  <p className="font-bold text-red-900 mb-1">Catatan dari Admin Verifikasi:</p>
                  <p className="italic">"{appNotes}"</p>
                </div>
              )}

              <Button
                onClick={() => setIsReapplying(true)}
                className="bg-[#111827] hover:bg-slate-800 text-white font-bold px-8"
              >
                Perbaiki Data & Ajukan Ulang
              </Button>
            </CardContent>
          </Card>
        )}

        {/* State 6: Registration Form Wizard (When status is none or reapplying) */}
        {isAuthenticated && !isApprovedSeller && (appStatus === "none" || !appStatus || isReapplying) && (
          <Card className="border-slate-200/90 shadow-2xl bg-white rounded-3xl overflow-hidden">
            {/* Form Wizard Step Header */}
            <div className="border-b border-slate-100 bg-slate-50/70 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#D4A017]">
                    Langkah {step} dari 4
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
                    {step === 1 && "Informasi & Profil Toko"}
                    {step === 2 && "Kontak & Identitas Roblox"}
                    {step === 3 && "Rekening Pencairan Dana"}
                    {step === 4 && "Persetujuan & Kirim Pendaftaran"}
                  </h2>
                </div>
                <div className="hidden sm:flex items-center gap-1.5 bg-white border border-slate-200 px-3 py-1.5 rounded-full text-xs font-semibold text-slate-600 shadow-xs">
                  <Clock className="h-3.5 w-3.5 text-[#D4A017]" />
                  Estimasi Isi: 2 Menit
                </div>
              </div>

              {/* Step Progress Bar */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { num: 1, title: "Toko" },
                  { num: 2, title: "Kontak" },
                  { num: 3, title: "Rekening" },
                  { num: 4, title: "Kirim" },
                ].map((s) => (
                  <div key={s.num} className="space-y-1.5">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        s.num <= step ? "bg-gradient-to-r from-[#FFD700] to-[#D4A017]" : "bg-slate-200"
                      }`}
                    />
                    <p
                      className={`text-[11px] font-bold text-center transition-colors ${
                        s.num === step ? "text-[#D4A017]" : s.num < step ? "text-slate-800" : "text-slate-400"
                      }`}
                    >
                      {s.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <CardContent className="p-6 sm:p-10">
              {errorMsg && (
                <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 animate-shake">
                  <AlertCircle className="h-5 w-5 shrink-0 text-red-500 mt-0.5" />
                  <div>
                    <p className="font-bold">Mohon Periksa Kembali</p>
                    <p className="text-xs mt-0.5">{errorMsg}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* ================= STEP 1: INFORMASI TOKO ================= */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Nama Toko Roblox <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Store className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          value={form.storeName}
                          onChange={(e) => setForm({ ...form, storeName: e.target.value })}
                          placeholder="Contoh: BloxKing Store / RobuxFastID"
                          className="pl-10 h-11 text-base font-semibold"
                          maxLength={50}
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Nama toko akan ditampilkan pada setiap produk yang Anda jual di LapakRo.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Slogan / Deskripsi Singkat Toko
                      </label>
                      <Input
                        value={form.storeTagline}
                        onChange={(e) => setForm({ ...form, storeTagline: e.target.value })}
                        placeholder="Contoh: Pengiriman instan 5 menit, terpercaya sejak 2023"
                        className="h-11"
                        maxLength={120}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Kategori Produk yang Ingin Dijual <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {CATEGORY_OPTIONS.map((cat) => {
                          const isSelected = form.categories.includes(cat.id)
                          return (
                            <div
                              key={cat.id}
                              onClick={() => toggleCategory(cat.id)}
                              className={`cursor-pointer rounded-2xl border p-4 transition-all flex items-start gap-3 ${
                                isSelected
                                  ? "border-[#D4A017] bg-[#FFFBEB] ring-1 ring-[#D4A017]"
                                  : "border-slate-200 hover:border-slate-300 bg-white"
                              }`}
                            >
                              <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border mt-0.5 ${
                                  isSelected ? "bg-[#D4A017] border-[#D4A017] text-white" : "border-slate-300 bg-white"
                                }`}
                              >
                                {isSelected && <Check className="h-3.5 w-3.5" />}
                              </div>
                              <div>
                                <p className="text-sm font-bold text-slate-900">{cat.label}</p>
                                <p className="text-xs text-slate-500 mt-0.5">{cat.desc}</p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Jam Operasional Toko
                      </label>
                      <Input
                        value={form.operatingHours}
                        onChange={(e) => setForm({ ...form, operatingHours: e.target.value })}
                        placeholder="Contoh: 09:00 - 23:00 WIB"
                        className="h-11"
                      />
                      <p className="text-xs text-slate-500 mt-1">
                        Membantu pembeli mengetahui kapan Anda aktif memproses pesanan.
                      </p>
                    </div>
                  </div>
                )}

                {/* ================= STEP 2: KONTAK & IDENTITAS ROBLOX ================= */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Nama Lengkap Pemilik <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <UserIcon className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          value={form.ownerName}
                          onChange={(e) => setForm({ ...form, ownerName: e.target.value })}
                          placeholder="Nama lengkap sesuai KTP / Buku Tabungan"
                          className="pl-10 h-11"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Nomor WhatsApp Aktif <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          value={form.whatsapp}
                          onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                          placeholder="Contoh: 081234567890"
                          className="pl-10 h-11"
                          type="tel"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Digunakan untuk notifikasi pesanan masuk serta bantuan cepat jika ada dispute.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Username Roblox Utama <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Gamepad2 className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                          value={form.robloxUsername}
                          onChange={(e) => setForm({ ...form, robloxUsername: e.target.value })}
                          placeholder="Contoh: Builderman123"
                          className="pl-10 h-11"
                        />
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        Username Roblox ini penting untuk verifikasi kepemilikan gamepass, private server, atau group funds.
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Username / Tag Discord (Opsional)
                      </label>
                      <Input
                        value={form.discord}
                        onChange={(e) => setForm({ ...form, discord: e.target.value })}
                        placeholder="Contoh: robloxer#1234 atau @robloxgamer"
                        className="h-11"
                      />
                    </div>
                  </div>
                )}

                {/* ================= STEP 3: REKENING PENCAIRAN SALDO ================= */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="rounded-2xl bg-blue-50/70 border border-blue-200 p-4 text-xs text-blue-900 flex items-start gap-3">
                      <CreditCard className="h-5 w-5 shrink-0 text-blue-600 mt-0.5" />
                      <div>
                        <p className="font-bold">Informasi Payout / Penarikan Dana</p>
                        <p className="mt-0.5">
                          Saldo hasil penjualan produk Anda di LapakRo akan dicairkan ke rekening atau e-wallet ini. Pastikan nama pemilik rekening sesuai dengan identitas Anda.
                        </p>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Pilih Bank / E-Wallet Tujuan <span className="text-red-500">*</span>
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                        {PAYOUT_METHODS.map((method) => {
                          const isSelected = form.payoutBank === method.id
                          return (
                            <button
                              type="button"
                              key={method.id}
                              onClick={() => setForm({ ...form, payoutBank: method.id })}
                              className={`rounded-xl border p-3 text-center transition-all ${
                                isSelected
                                  ? "border-[#D4A017] bg-[#FFFBEB] font-bold text-slate-900 ring-2 ring-[#D4A017]"
                                  : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"
                              }`}
                            >
                              <span className="block text-xs uppercase font-extrabold">{method.id}</span>
                              <span className="block text-[10px] text-slate-500 mt-0.5">
                                {method.type === "bank" ? "Transfer Bank" : "E-Wallet"}
                              </span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Nomor Rekening / Nomor E-Wallet <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={form.payoutAccountNumber}
                        onChange={(e) => setForm({ ...form, payoutAccountNumber: e.target.value })}
                        placeholder="Contoh: 1234567890 (Bank) atau 081234567890 (DANA/OVO)"
                        className="h-11 font-mono text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Nama Pemilik Rekening (Sesuai Buku Tabungan / E-Wallet) <span className="text-red-500">*</span>
                      </label>
                      <Input
                        value={form.payoutAccountName}
                        onChange={(e) => setForm({ ...form, payoutAccountName: e.target.value })}
                        placeholder="Contoh: AHMAD FAUZI"
                        className="h-11"
                      />
                    </div>
                  </div>
                )}

                {/* ================= STEP 4: PERSETUJUAN & KONFIRMASI ================= */}
                {step === 4 && (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-2">
                        Pengalaman Berjualan Item / Robux Roblox
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                          { id: "beginner", label: "Pemula", desc: "Baru pertama kali ingin mencoba jualan" },
                          { id: "experienced_group", label: "Grup / Medsos", desc: "Pernah jualan di Discord, Facebook, WA" },
                          { id: "experienced_other", label: "Toko Berpengalaman", desc: "Sudah sering jualan di marketplace lain" },
                        ].map((exp) => (
                          <div
                            key={exp.id}
                            onClick={() => setForm({ ...form, experience: exp.id })}
                            className={`cursor-pointer rounded-2xl border p-4 transition-all ${
                              form.experience === exp.id
                                ? "border-[#D4A017] bg-[#FFFBEB] ring-1 ring-[#D4A017]"
                                : "border-slate-200 bg-white hover:border-slate-300"
                            }`}
                          >
                            <p className="text-sm font-bold text-slate-900">{exp.label}</p>
                            <p className="text-xs text-slate-500 mt-1">{exp.desc}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-slate-900 mb-1.5">
                        Alasan / Komitmen Bergabung di LapakRo (Opsional)
                      </label>
                      <textarea
                        value={form.reasons}
                        onChange={(e) => setForm({ ...form, reasons: e.target.value })}
                        placeholder="Contoh: Ingin memperluas jangkauan pembeli, memiliki stok robux dan item legal hasil grinding mandiri..."
                        className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-[#D4A017] focus:outline-none focus:ring-1 focus:ring-[#D4A017] min-h-[90px]"
                      />
                    </div>

                    {/* Ringkasan Data Sebelum Kirim */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 space-y-2">
                      <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                        Rangkuman Pendaftaran
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm pt-1">
                        <div>
                          <span className="text-slate-500">Nama Toko:</span>{" "}
                          <span className="font-bold text-slate-800">{form.storeName || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Kategori:</span>{" "}
                          <span className="font-bold text-slate-800">{form.categories.length} Kategori dipilih</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Roblox Username:</span>{" "}
                          <span className="font-bold text-slate-800">{form.robloxUsername || "-"}</span>
                        </div>
                        <div>
                          <span className="text-slate-500">Rekening Payout:</span>{" "}
                          <span className="font-bold text-slate-800">
                            {form.payoutBank} ({form.payoutAccountNumber})
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkbox Ketentuan & Legalitas */}
                    <div className="space-y-3 pt-2">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agreementLegal}
                          onChange={(e) => setForm({ ...form, agreementLegal: e.target.checked })}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#D4A017] focus:ring-[#D4A017]"
                        />
                        <span className="text-xs sm:text-sm text-slate-700">
                          <strong>Jaminan Produk Legal:</strong> Saya menjamin semua Robux, gamepass, item, dan akun yang saya jual adalah 100% legal dan bukan hasil eksploitasi, phising, hacking, ataupun kecurangan ("dirty robux").
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agreementEscrow}
                          onChange={(e) => setForm({ ...form, agreementEscrow: e.target.checked })}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#D4A017] focus:ring-[#D4A017]"
                        />
                        <span className="text-xs sm:text-sm text-slate-700">
                          <strong>Persetujuan Sistem Escrow:</strong> Saya memahami bahwa dana pembeli ditahan secara aman oleh LapakRo dan baru akan diteruskan ke saldo dompet saya setelah pesanan berhasil terkirim dan dikonfirmasi pembeli.
                        </span>
                      </label>

                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={form.agreementFulfillment}
                          onChange={(e) => setForm({ ...form, agreementFulfillment: e.target.checked })}
                          className="mt-1 h-4 w-4 rounded border-slate-300 text-[#D4A017] focus:ring-[#D4A017]"
                        />
                        <span className="text-xs sm:text-sm text-slate-700">
                          <strong>Komitmen Pelayanan:</strong> Saya bersedia melayani pembeli dengan ramah dan menyelesaikan pesanan tepat waktu sebelum batas otomatis berakhir.
                        </span>
                      </label>
                    </div>
                  </div>
                )}

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                  {step > 1 ? (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handlePrev}
                      className="border-slate-300 font-bold gap-2"
                      disabled={submitting}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Sebelumnya
                    </Button>
                  ) : (
                    <div />
                  )}

                  {step < 4 ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-[#111827] hover:bg-slate-800 text-white font-bold px-7 gap-2"
                    >
                      Lanjut
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={submitting}
                      className="bg-gradient-to-r from-[#FFD700] to-[#D4A017] text-slate-950 hover:opacity-95 font-black px-8 py-2.5 text-base shadow-lg shadow-[#FFD700]/20 gap-2"
                    >
                      {submitting ? (
                        <>
                          <Clock className="h-5 w-5 animate-spin" />
                          Mengirim Pendaftaran...
                        </>
                      ) : (
                        <>
                          <Send className="h-5 w-5" />
                          Kirim Pendaftaran Toko
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* FAQ Section */}
        <div className="mt-16 space-y-4">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900">Pertanyaan Seputar Seller LapakRo</h3>
            <p className="text-sm text-slate-500 mt-1">Semua hal yang perlu Anda ketahui sebelum membuka toko</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#D4A017]" />
                Berapa lama proses verifikasi seller?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Proses peninjauan biasanya selesai dalam waktu 1x24 jam kerja. Anda akan menerima status update langsung di halaman ini atau melalui kontak WhatsApp.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#D4A017]" />
                Apakah ada biaya pendaftaran?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Pendaftaran menjadi seller di LapakRo adalah <strong>100% GRATIS</strong> tanpa biaya registrasi apapun. Kami hanya mengenakan potongan biaya platform kecil saat transaksi Anda berhasil.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#D4A017]" />
                Bagaimana sistem pencairan dana (payout)?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Setelah pesanan selesai dan dikonfirmasi pembeli, dana akan masuk ke Saldo Dompet LapakRo Anda. Anda bisa langsung menarik dana ke rekening Bank (BCA, Mandiri, BRI, BNI) atau E-Wallet (DANA, OVO, GoPay).
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
              <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-[#D4A017]" />
                Apa saja produk yang diperbolehkan?
              </h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                Anda dapat menjual Robux via gamepass/group, item game Roblox (Blox Fruits, Pet Sim, Blade Ball), Akun Roblox, UGC Limiteds, dan jasa joki legal. Dilarang keras menjual produk hasil exploit atau phising.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
