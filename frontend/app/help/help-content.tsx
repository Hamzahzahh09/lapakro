"use client"
import { useState, useMemo } from "react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search, ChevronDown, MessageCircle, ShieldCheck, Store, Wallet,
  ShoppingBag, FileText, HelpCircle, CheckCircle2, Clock, Package,
  CreditCard, ArrowRight, UserRound,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Faq {
  id: string
  category: string
  q: string
  a: string
}

const CATEGORIES = [
  { id: "akun", title: "Akun & Keamanan", desc: "Daftar, login, OTP, dan keamanan akun.", icon: UserRound },
  { id: "pembayaran", title: "Pembayaran", desc: "Metode bayar, escrow, refund.", icon: Wallet },
  { id: "pesanan", title: "Pesanan", desc: "Cara belanja, status, komplain.", icon: ShoppingBag },
  { id: "seller", title: "Panduan Penjual", desc: "Buka toko, kirim barang, tarik dana.", icon: Store },
  { id: "kebijakan", title: "Kebijakan LapakRo", desc: "Aturan main dan privasi data.", icon: FileText },
  { id: "lainnya", title: "Lainnya", desc: "Pertanyaan umum seputar LapakRo.", icon: HelpCircle },
]

const FAQS: Faq[] = [
  // ---- Akun & Keamanan ----
  { id: "akun-1", category: "akun", q: "Bagaimana cara mendaftar akun LapakRo?", a: "Buka halaman Daftar, isi nama, email, nomor HP, dan password, lalu verifikasi kode OTP 6 digit yang dikirim ke email kamu. Setelah terverifikasi, akun langsung bisa dipakai belanja." },
  { id: "akun-2", category: "akun", q: "Apa itu verifikasi OTP?", a: "OTP adalah kode 6 digit sekali pakai yang dikirim ke email setelah mendaftar. Akun harus terverifikasi sebelum bisa mengajukan diri sebagai penjual atau memakai fitur tertentu. Kode hanya berlaku singkat — minta kirim ulang bila kedaluwarsa." },
  { id: "akun-3", category: "akun", q: "Saya lupa password, bagaimana cara reset?", a: "Saat ini reset password dilakukan manual. Hubungi Live Chat dengan menyebutkan email terdaftar kamu, tim kami akan membantu memulihkan akses akunmu setelah verifikasi identitas." },
  { id: "akun-4", category: "akun", q: "Bagaimana cara menjaga keamanan akun saya?", a: "Jangan pernah membagikan password dan kode OTP ke siapa pun — termasuk yang mengaku admin LapakRo. Customer service resmi tidak akan pernah meminta password kamu." },
  // ---- Pembayaran ----
  { id: "bayar-1", category: "pembayaran", q: "Metode pembayaran apa saja yang tersedia?", a: "Kami menerima BCA, Mandiri, BNI, dan BRI Virtual Account, GoPay, OVO, DANA, serta QRIS. Semua pembayaran diproses aman melalui Midtrans." },
  { id: "bayar-2", category: "pembayaran", q: "Apakah pembayaran saya aman?", a: "Ya. LapakRo memakai sistem escrow: dana yang kamu bayar ditahan oleh sistem dan baru diteruskan ke penjual setelah kamu mengonfirmasi bahwa barang sudah diterima. Jika dalam 3 hari setelah penjual mengirim kamu tidak memberi kabar, dana otomatis dirilis ke penjual." },
  { id: "bayar-3", category: "pembayaran", q: "Bagaimana cara membayar pesanan?", a: "Buka detail transaksi, tekan tombol Bayar Sekarang, lalu selesaikan pembayaran di halaman Midtrans sesuai metode yang kamu pilih. Batas waktu pembayaran 24 jam sejak sesi pembayaran dibuat." },
  { id: "bayar-4", category: "pembayaran", q: "Saya sudah bayar tapi status belum berubah, kenapa?", a: "Pastikan pembayaran di halaman Midtrans sudah berstatus sukses/settlement. Kemudian buka detail transaksi dan tekan Cek Status Pembayaran untuk menyinkronkan status. Jika dana terdebit tapi status tetap pending lebih dari 1x24 jam, hubungi Live Chat dengan menyertakan bukti bayar." },
  { id: "bayar-5", category: "pembayaran", q: "Apakah dana bisa dikembalikan (refund)?", a: "Bisa. Dana dikembalikan bila pesanan dibatalkan sebelum selesai, atau bila sengketa dimenangkan oleh pembeli setelah peninjauan admin." },
  // ---- Pesanan ----
  { id: "order-1", category: "pesanan", q: "Bagaimana cara membeli Robux atau produk lain?", a: "1) Cari produk di Marketplace. 2) Tentukan jumlah lalu buat pesanan. 3) Bayar lewat tombol Bayar Sekarang. 4) Tunggu penjual mengirim, lalu tekan Konfirmasi Penerimaan setelah barang diterima." },
  { id: "order-2", category: "pesanan", q: "Apa arti tiap status transaksi?", a: "Menunggu Pembayaran/Proses: pesanan dibuat, menunggu dibayar/diproses. Sudah Dibayar • Menunggu Penjual: pembayaran masuk, giliran penjual mengirim barang. Menunggu Konfirmasi Pembeli: barang dikirim, menunggu kamu konfirmasi terima. Selesai: dana diteruskan ke penjual. Dibatalkan/Sengketa: sesuai namanya." },
  { id: "order-3", category: "pesanan", q: "Berapa lama penjual harus mengirim barang?", a: "Penjual diminta mengirim sesegera mungkin setelah pembayaran terkonfirmasi. Pesanan yang tidak dibayar lebih dari 24 jam akan otomatis dibatalkan sistem." },
  { id: "order-4", category: "pesanan", q: "Pesanan tidak sesuai atau penjual tidak merespons, apa yang harus dilakukan?", a: "Langkah pertama: hubungi penjual lewat fitur Chat dan jelaskan masalahnya. Jika tidak ada penyelesaian, ajukan sengketa (dispute) dari halaman transaksi — admin akan menengahi dan memutuskan refund atau penerusan dana berdasarkan bukti kedua belah pihak." },
  { id: "order-5", category: "pesanan", q: "Bagaimana cara mengajukan sengketa (dispute)?", a: "Buka detail transaksi yang bermasalah dan ajukan sengketa dengan melampirkan bukti pendukung seperti screenshot chat dan bukti pembayaran. Tim admin akan meninjau dan memberi keputusan; pantau perkembangannya di halaman transaksi." },
  // ---- Penjual ----
  { id: "sell-1", category: "seller", q: "Bagaimana cara membuka toko dan menjadi penjual?", a: "Pastikan email kamu sudah terverifikasi, lengkapi profil, lalu ajukan diri sebagai penjual dari halaman profil. Pengajuan akan ditinjau admin — kamu bisa memantau statusnya (menunggu/disetujui/ditolak) di halaman yang sama." },
  { id: "sell-2", category: "seller", q: "Kapan dana penjualan masuk ke dompet saya?", a: "Dana masuk setelah pembeli menekan Konfirmasi Penerimaan (escrow dirilis), atau otomatis 3 hari setelah kamu mengirim barang bila pembeli tidak memberi kabar." },
  { id: "sell-3", category: "seller", q: "Bagaimana cara menarik dana dari dompet?", a: "Buka halaman Dompet, tekan Withdraw, lalu ikuti instruksi penarikan ke rekening atau e-wallet yang terdaftar." },
  { id: "sell-4", category: "seller", q: "Bagaimana cara menambah dan mengelola produk?", a: "Masuk ke Dashboard Seller, buka menu Produk, lalu tambah produk baru dengan judul, kategori, harga, stok, dan deskripsi yang jelas. Produk yang melanggar aturan akan diturunkan admin." },
  // ---- Kebijakan ----
  { id: "policy-1", category: "kebijakan", q: "Barang apa saja yang dilarang diperjualbelikan?", a: "Dilarang menjual akun atau item hasil curian, barang ilegal, serta apa pun yang melanggar Syarat Layanan Roblox. Pelanggaran berakibat produk diturunkan hingga akun diblokir." },
  { id: "policy-2", category: "kebijakan", q: "Bagaimana LapakRo melindungi data pribadi saya?", a: "Data seperti nama, email, dan nomor HP hanya dipakai untuk keperluan operasional marketplace (transaksi, verifikasi, dan layanan pelanggan) dan tidak diperjualbelikan ke pihak ketiga." },
  // ---- Lainnya ----
  { id: "other-1", category: "lainnya", q: "Apakah LapakRo terafiliasi dengan Roblox?", a: "Tidak. LapakRo adalah marketplace independen dan tidak berafiliasi dengan Roblox Corporation. Roblox dan Robux adalah merek dagang milik Roblox Corporation." },
  { id: "other-2", category: "lainnya", q: "Kapan customer service bisa dihubungi?", a: "Tim kami siap membantu 24/7 melalui Live Chat. Untuk kendala transaksi, siapkan ID transaksi dan bukti pendukung agar penanganan lebih cepat." },
]

const POPULAR = ["Cara membayar", "Refund", "Jadi penjual", "Sengketa", "Tarik dana", "OTP"]

const ORDER_STEPS = [
  { icon: Search, title: "1. Cari & Pesan", desc: "Temukan produk di Marketplace, tentukan jumlah, lalu buat pesanan." },
  { icon: CreditCard, title: "2. Bayar Aman", desc: "Bayar via VA bank, e-wallet, atau QRIS. Dana ditahan sistem (escrow)." },
  { icon: Package, title: "3. Terima Barang", desc: "Penjual mengirim barang ke akun/game kamu sesuai deskripsi." },
  { icon: CheckCircle2, title: "4. Konfirmasi", desc: "Cek barang, tekan Konfirmasi Penerimaan — dana diteruskan ke penjual." },
]

const STATUS_GUIDE = [
  { label: "Menunggu Pembayaran/Proses", desc: "Pesanan baru dibuat, menunggu pembayaran atau diproses.", tone: "bg-amber-50 text-amber-700 border-amber-200" },
  { label: "Sudah Dibayar • Menunggu Penjual", desc: "Dana masuk escrow, giliran penjual mengirim barang.", tone: "bg-[#FFD700]/10 text-[#8a6d03] border-[#FFD700]/40" },
  { label: "Menunggu Konfirmasi Pembeli", desc: "Barang dikirim, menunggu pembeli konfirmasi terima.", tone: "bg-blue-50 text-blue-700 border-blue-200" },
  { label: "Selesai", desc: "Transaksi tuntas, dana diteruskan ke penjual.", tone: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { label: "Dibatalkan / Sengketa", desc: "Dibatalkan kedua belah pihak atau sedang ditengahi admin.", tone: "bg-red-50 text-red-600 border-red-200" },
]

const PAYMENT_METHODS = ["BCA VA", "Mandiri VA", "BNI VA", "BRI VA", "GoPay", "OVO", "DANA", "QRIS"]

export default function HelpContent() {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState("semua")
  const [openId, setOpenId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return FAQS.filter((f) => {
      const matchCat = activeCategory === "semua" || f.category === activeCategory
      const matchQuery = !q || f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q)
      return matchCat && matchQuery
    })
  }, [query, activeCategory])

  const scrollToFaq = () => {
    document.getElementById("faq")?.scrollIntoView({ behavior: "smooth", block: "start" })
  }

  const pickCategory = (id: string) => {
    setActiveCategory(id)
    setOpenId(null)
    scrollToFaq()
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
      <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />

      {/* Hero + Search */}
      <div className="bg-gradient-to-b from-[#FFD700]/20 to-transparent pt-12 pb-16 px-4 sm:px-6">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 mb-5">
            <ShieldCheck className="h-4 w-4 text-[#D4A017]" />
            <span className="text-xs font-bold text-[#8a6d03] tracking-wide uppercase">Pusat Bantuan 24/7</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] mb-4">
            Ada yang bisa kami bantu?
          </h1>
          <p className="text-[#6B7280] text-lg mb-8">
            Cari jawaban dari {FAQS.length} panduan, atau hubungi tim kami kapan saja
          </p>

          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]" />
            <Input
              type="text"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setOpenId(null) }}
              placeholder="Ketik pertanyaan Anda di sini... mis. refund"
              className="h-14 w-full rounded-2xl border-gray-200 bg-white pl-12 pr-4 text-base shadow-sm focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/10"
            />
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <span className="text-xs font-bold text-[#6B7280] self-center mr-1">Populer:</span>
            {POPULAR.map((p) => (
              <button
                key={p}
                onClick={() => { setQuery(p); setActiveCategory("semua"); setOpenId(null); scrollToFaq() }}
                className="text-xs font-bold px-3 py-1.5 rounded-full bg-white border border-gray-200 text-[#0F172A] hover:border-[#D4A017] hover:text-[#8a6d03] transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        {/* Categories */}
        <div className="-mt-4">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon
              const count = FAQS.filter((f) => f.category === cat.id).length
              const active = activeCategory === cat.id
              return (
                <button
                  key={cat.id}
                  onClick={() => pickCategory(active ? "semua" : cat.id)}
                  className={cn(
                    "text-left bg-white rounded-2xl p-5 border shadow-sm transition-all duration-300 hover:-translate-y-1",
                    active
                      ? "border-[#D4A017] ring-2 ring-[#FFD700]/30 shadow-md"
                      : "border-gray-100 hover:border-[#FFD700] hover:shadow-md"
                  )}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFD700]/15 mb-3">
                    <Icon className="h-5 w-5 text-[#D4A017]" />
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-1">{cat.title}</h3>
                  <p className="text-sm text-[#6B7280] mb-2">{cat.desc}</p>
                  <span className="text-xs font-bold text-[#8a6d03]">{count} artikel</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQ */}
        <div id="faq" className="mt-14 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <h2 className="text-2xl font-black text-[#0F172A]">
              {activeCategory === "semua" ? "Semua Pertanyaan" : CATEGORIES.find((c) => c.id === activeCategory)?.title}
            </h2>
            <span className="text-sm font-bold text-[#6B7280]">
              {filtered.length} dari {FAQS.length} artikel
            </span>
          </div>

          {(query || activeCategory !== "semua") && (
            <button
              onClick={() => { setQuery(""); setActiveCategory("semua"); setOpenId(null) }}
              className="mb-4 text-xs font-bold text-[#8a6d03] bg-[#FFD700]/10 border border-[#FFD700]/40 rounded-full px-3 py-1.5 hover:bg-[#FFD700]/20 transition-colors"
            >
              Reset filter ✕
            </button>
          )}

          {filtered.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center">
              <HelpCircle className="mx-auto h-10 w-10 text-[#D4A017] mb-3 opacity-60" />
              <h3 className="font-bold text-[#0F172A] mb-1">Tidak ditemukan</h3>
              <p className="text-sm text-[#6B7280] mb-5">
                Coba kata kunci lain, atau tanyakan langsung ke tim kami.
              </p>
              <Link href="/chat">
                <Button variant="gold" className="font-bold">Tanya via Live Chat</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map((faq) => {
                const open = openId === faq.id
                const cat = CATEGORIES.find((c) => c.id === faq.category)
                return (
                  <div
                    key={faq.id}
                    className={cn(
                      "bg-white border rounded-2xl overflow-hidden transition-all",
                      open ? "border-[#D4A017] shadow-md" : "border-gray-100 hover:border-gray-200"
                    )}
                  >
                    <button
                      onClick={() => setOpenId(open ? null : faq.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 text-left"
                    >
                      <span>
                        <span className="block text-[11px] font-black uppercase tracking-wider text-[#8a6d03] mb-1">
                          {cat?.title}
                        </span>
                        <span className="font-bold text-[#0F172A]">{faq.q}</span>
                      </span>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 text-[#D4A017] transition-transform duration-300",
                          open && "rotate-180"
                        )}
                      />
                    </button>
                    <div
                      className={cn(
                        "grid transition-all duration-300",
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      )}
                    >
                      <div className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed text-[#475569]">{faq.a}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Cara Belanja */}
        <div className="mt-16">
          <h2 className="text-2xl font-black text-[#0F172A] mb-2 text-center">Cara Belanja di LapakRo</h2>
          <p className="text-[#6B7280] text-center mb-8">Empat langkah mudah, dilindungi escrow di setiap tahap.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ORDER_STEPS.map((s) => {
              const Icon = s.icon
              return (
                <div key={s.title} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:border-[#FFD700] hover:-translate-y-1 transition-all">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0F172A] mb-3">
                    <Icon className="h-5 w-5 text-[#FFD700]" />
                  </div>
                  <h3 className="font-bold text-[#0F172A] mb-1">{s.title}</h3>
                  <p className="text-sm text-[#6B7280]">{s.desc}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Status guide */}
        <div className="mt-14 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-1">
            <Clock className="h-5 w-5 text-[#D4A017]" />
            <h2 className="text-xl font-black text-[#0F172A]">Memahami Status Transaksi</h2>
          </div>
          <p className="text-sm text-[#6B7280] mb-5">Status bergerak maju mengikuti alur: bayar → kirim → konfirmasi.</p>
          <div className="space-y-3">
            {STATUS_GUIDE.map((s) => (
              <div key={s.label} className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 py-2 border-b border-gray-50 last:border-0">
                <Badge variant="outline" className={cn("shrink-0 w-fit font-bold", s.tone)}>{s.label}</Badge>
                <p className="text-sm text-[#475569]">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Payment methods */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
          <span className="text-sm font-bold text-[#6B7280]">Pembayaran aman via Midtrans:</span>
          <div className="flex flex-wrap justify-center gap-2">
            {PAYMENT_METHODS.map((m) => (
              <Badge key={m} variant="outline" className="bg-white font-bold text-[#0F172A] border-gray-200">{m}</Badge>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-10 bg-white border border-[#FFD700]/30 bg-gradient-to-r from-white to-[#FFFBEB] rounded-3xl p-8 text-center flex flex-col items-center shadow-sm">
          <div className="h-16 w-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mb-4">
            <MessageCircle className="h-8 w-8 text-[#D4A017]" />
          </div>
          <h2 className="text-2xl font-black text-[#0F172A] mb-2">Masih Butuh Bantuan?</h2>
          <p className="text-[#6B7280] max-w-md mx-auto mb-1">
            Tim kami siap membantu 24/7. Siapkan ID transaksi dan bukti pendukung agar penanganan lebih cepat.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Online sekarang
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link href="/chat" className="w-full sm:w-auto">
              <Button variant="gold" size="lg" className="font-bold shadow-md w-full">
                Buka Live Chat <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/products" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="font-bold w-full border-gray-200">
                <ShoppingBag className="mr-2 h-4 w-4" /> Jelajahi Produk
              </Button>
            </Link>
          </div>
        </div>

        {/* Policy shortcuts */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs font-bold text-[#6B7280]">
          {[
            { label: "Syarat & Ketentuan", cat: "kebijakan" },
            { label: "Kebijakan Privasi", cat: "kebijakan" },
            { label: "Kebijakan Refund", cat: "pembayaran" },
            { label: "Aturan Penjual", cat: "seller" },
          ].map((l) => (
            <button key={l.label} onClick={() => pickCategory(l.cat)} className="hover:text-[#8a6d03] transition-colors">
              {l.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
