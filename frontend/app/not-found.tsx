import Link from "next/link"
import { Search, Home } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-6 pb-24">
      <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-[#FFD700]/10 to-transparent pointer-events-none -z-10" />

      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-[#FFFBEB] border border-[#FFD700]/20 mb-6">
            <Search className="h-12 w-12 text-[#D4A017]" />
          </div>
          <h1 className="text-7xl font-black text-[#0F172A] mb-2">404</h1>
          <h2 className="text-2xl font-bold text-[#0F172A] mb-3">Halaman Tidak Ditemukan</h2>
          <p className="text-[#6B7280] max-w-sm mx-auto">
            Halaman yang Anda cari mungkin telah dihapus, diganti namanya, atau tidak tersedia.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/">
            <Button variant="gold" size="lg" className="shadow-md font-bold w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="lg" className="border-gray-200 font-bold w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Cari Produk
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
