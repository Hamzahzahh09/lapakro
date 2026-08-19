"use client"
import { useEffect } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center pt-6 pb-24">
      <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10" />

      <div className="mx-auto max-w-lg px-4 text-center">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-red-50 border border-red-100 mb-6">
            <AlertTriangle className="h-12 w-12 text-red-500" />
          </div>
          <h1 className="text-3xl font-black text-[#0F172A] mb-2">Terjadi Kesalahan</h1>
          <p className="text-[#6B7280] max-w-sm mx-auto">
            Maaf, terjadi kesalahan yang tidak terduga. Silakan coba lagi atau hubungi tim support kami.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button
            variant="gold"
            size="lg"
            className="shadow-md font-bold w-full sm:w-auto"
            onClick={reset}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Coba Lagi
          </Button>
          <Link href="/">
            <Button variant="outline" size="lg" className="border-gray-200 font-bold w-full sm:w-auto">
              <Home className="mr-2 h-4 w-4" />
              Kembali ke Beranda
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
