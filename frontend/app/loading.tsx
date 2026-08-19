import { Loader2 } from "lucide-react"

export default function RootLoading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-40 rounded-full animate-pulse-slow" />
          <Loader2 className="h-10 w-10 animate-spin text-[#D4A017] relative z-10" />
        </div>
        <p className="text-[#6B7280] font-bold">Memuat...</p>
      </div>
    </div>
  )
}
