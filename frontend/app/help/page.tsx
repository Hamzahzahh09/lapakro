import { Search, ChevronDown, MessageCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
export const metadata = {
 title:"Pusat Bantuan | LapakRo",
 description:"Dapatkan bantuan dan temukan jawaban dari pertanyaan Anda di LapakRo.",
}

export default function HelpPage() {
 return (
 <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
 <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10"/>
 
 {/* Hero Section */}
 <div className="bg-gradient-to-b from-[#FFD700]/20 to-transparent pt-12 pb-20 px-4 sm:px-6">
 <div className="mx-auto max-w-3xl text-center">
 <h1 className="text-3xl sm:text-5xl font-black text-[#0F172A] mb-4">
 Ada yang bisa kami bantu?
 </h1>
 <p className="text-[#6B7280] text-lg mb-8">
 Cari topik bantuan atau hubungi layanan pelanggan kami
 </p>
 
 <div className="relative max-w-2xl mx-auto">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B7280]"/>
 <Input 
 type="text"placeholder="Ketik pertanyaan Anda di sini..."className="h-14 w-full rounded-2xl border-gray-200 bg-white pl-12 pr-4 text-base shadow-sm focus:border-[#FFD700] focus:ring-4 focus:ring-[#FFD700]/10"/>
 </div>
 </div>
 </div>

 {/* FAQ Categories */}
 <div className="mx-auto max-w-5xl px-4 sm:px-6 -mt-8">
 <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
 {[
 { title:"Akun & Keamanan", desc: "Masalah login, lupa password, verifikasi 2 langkah."},
 { title:"Pembayaran", desc: "Metode pembayaran, masalah topup, refund."},
 { title:"Pesanan", desc: "Status pesanan, cara belanja, komplain."},
 { title:"Panduan Penjual", desc: "Cara berjualan, tarik dana, kelola toko."},
 { title:"Kebijakan LapakRo", desc: "Syarat dan ketentuan, kebijakan privasi."},
 { title:"Lainnya", desc: "Pertanyaan umum seputar LapakRo."},
 ].map((cat, i) => (
 <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:-translate-y-1 hover:border-[#FFD700] hover:shadow-premium transition-all duration-300 cursor-pointer">
 <h3 className="font-bold text-[#0F172A] text-lg mb-2">{cat.title}</h3>
 <p className="text-sm text-[#6B7280]">{cat.desc}</p>
 </div>
 ))}
 </div>

 {/* Popular FAQ */}
 <div className="mt-16">
 <h2 className="text-2xl font-black text-[#0F172A] mb-6">Pertanyaan Populer</h2>
 <div className="space-y-4">
 {["Bagaimana cara melakukan pembelian Robux?","Berapa lama proses penarikan dana untuk penjual?","Apa yang harus dilakukan jika pesanan tidak sesuai?","Bagaimana cara membuka toko di LapakRo?",
 ].map((faq, i) => (
 <div key={i} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors">
 <span className="font-medium text-[#0F172A]">{faq}</span>
 <ChevronDown className="h-5 w-5 text-[#6B7280]"/>
 </div>
 ))}
 </div>
 </div>

 {/* Contact Support */}
 <div className="mt-16 bg-white border border-[#FFD700]/30 bg-gradient-to-r from-white to-[#FFFBEB] rounded-3xl p-8 text-center flex flex-col items-center shadow-sm">
 <div className="h-16 w-16 bg-[#FFD700]/20 rounded-full flex items-center justify-center mb-4">
 <MessageCircle className="h-8 w-8 text-[#D4A017]"/>
 </div>
 <h2 className="text-2xl font-black text-[#0F172A] mb-2">Masih Butuh Bantuan?</h2>
 <p className="text-[#6B7280] max-w-md mx-auto mb-6">
 Tim layanan pelanggan kami siap membantu Anda 24/7 untuk menyelesaikan masalah yang Anda alami.
 </p>
 <Button variant="gold"size="lg"className="font-bold shadow-md">
 Hubungi Customer Service
 </Button>
 </div>
 </div>
 </div>
 )
}
