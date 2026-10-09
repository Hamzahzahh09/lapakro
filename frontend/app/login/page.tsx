"use client"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
import { Eye, EyeOff, ShieldCheck, Gamepad2, ArrowLeft } from "lucide-react"
import { RobuxCoin, FloatingRobux } from "@/components/ui/robux-decorations"
export default function LoginPage() {
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [showPassword, setShowPassword] = useState(false)
 const [error, setError] = useState("")
 const [loading, setLoading] = useState(false)
 const { login } = useAuth()
 const router = useRouter()

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError("")
 setLoading(true)
 try {
 await login(email, password)
 } catch (err: unknown) {
 setError(err instanceof Error ? err.message :"Login gagal")
 } finally {
 setLoading(false)
 }
 }

 return (
 <div className="flex min-h-screen bg-white">
 {/* Left Panel - Illustration (Hidden on mobile) */}
 <div className="hidden lg:flex flex-1 relative bg-[#F8FAFC] border-r border-gray-100 overflow-hidden flex-col justify-between p-12">
 {/* Decorative elements */}
 <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none"/>
 <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#FFD700] rounded-full blur-[150px] opacity-[0.15] pointer-events-none"/>
 
 <FloatingRobux size="lg"className="top-1/4 right-1/4 opacity-100"delay={0} duration={6} />
 <FloatingRobux size="sm"className="top-1/3 left-1/4 opacity-70"delay={1} duration={4} />
 <FloatingRobux size="md"className="bottom-1/3 right-1/3 opacity-80"delay={2} duration={5} />

 <div className="relative z-10">
 <Link href="/"className="inline-flex items-center gap-2 text-[#475569] hover:text-[#D4A017] transition-colors">
 <ArrowLeft className="h-5 w-5"/>
 <span className="font-semibold">Kembali ke Beranda</span>
 </Link>
 </div>

 <div className="relative z-10 max-w-lg">
 <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white border border-[#FFD700]/30 shadow-gold mb-8">
 <RobuxCoin className="h-10 w-10 drop-shadow-md"/>
 </div>
 <h1 className="text-4xl font-black text-[#0F172A] mb-6 leading-tight">
 Selamat datang kembali di <br />
 <span className="text-[#D4A017]">LapakRo</span>
 </h1>
 <p className="text-lg text-[#6B7280] mb-12">
 Marketplace Roblox terbesar dan terpercaya di Indonesia. Transaksi aman, pengiriman instan.
 </p>

 <div className="space-y-4">
 <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-2xl p-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22C55E]/10 text-[#22C55E]">
 <ShieldCheck className="h-5 w-5"/>
 </div>
 <div>
 <p className="font-bold text-[#0F172A] text-sm">Transaksi 100% Aman</p>
 <p className="text-xs text-[#6B7280]">Garansi dana terlindungi hingga pesanan selesai</p>
 </div>
 </div>
 <div className="flex items-center gap-4 bg-white border border-gray-100 shadow-sm rounded-2xl p-4">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#3B82F6]/10 text-[#3B82F6]">
 <Gamepad2 className="h-5 w-5"/>
 </div>
 <div>
 <p className="font-bold text-[#0F172A] text-sm">10.000+ Penjual Aktif</p>
 <p className="text-xs text-[#6B7280]">Pilihan produk terlengkap setiap hari</p>
 </div>
 </div>
 </div>
 </div>

 <div className="relative z-10 flex items-center gap-4 mt-12 text-[#94A3B8]">
 <span className="text-xs font-medium uppercase tracking-wider">Trusted by</span>
 <div className="h-px flex-1 bg-gray-200"/>
 <span className="text-xs font-bold text-[#475569]">100K+ PENGGUNA</span>
 </div>
 </div>

 {/* Right Panel - Login Form */}
 <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
 <div className="w-full max-w-md">
 {/* Mobile Logo */}
 <div className="lg:hidden text-center mb-8">
 <Link href="/"className="inline-flex items-center gap-2.5 text-2xl font-black tracking-tight">
 <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-[#FFD700]/30 shadow-sm">
 <RobuxCoin className="h-6 w-6 drop-shadow-sm"/>
 </div>
 <span className="text-[#0F172A]">
 Lapak<span className="text-[#D4A017]">Ro</span>
 </span>
 </Link>
 </div>

 <div className="text-center lg:text-left mb-8">
 <h2 className="text-3xl font-black text-[#0F172A] mb-2">Masuk</h2>
 <p className="text-[#6B7280]">Masukkan email dan password untuk melanjutkan</p>
 </div>

 {error && (
 <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-[#EF4444] animate-scale-in">
 {error}
 </div>
 )}

 <form onSubmit={handleSubmit} className="space-y-5">
 <Input
 label="Email"type="email"placeholder="nama@email.com"value={email}
 onChange={(e) => setEmail(e.target.value)}
 required
 />
 <div className="relative">
 <Input
 label="Password"type={showPassword ?"text":"password"}
 placeholder="Masukkan password"value={password}
 onChange={(e) => setPassword(e.target.value)}
 required
 />
 <button
 type="button"onClick={() => setShowPassword(!showPassword)}
 className="absolute right-4 top-[38px] text-[#94A3B8] hover:text-[#0F172A] transition-colors">
 {showPassword ? <EyeOff className="h-5 w-5"/> : <Eye className="h-5 w-5"/>}
 </button>
 </div>

 <div className="flex items-center justify-between pt-2">
 <label className="flex items-center gap-2 cursor-pointer group">
 <input type="checkbox"className="w-4 h-4 rounded border-gray-300 text-[#FFD700] focus:ring-[#FFD700]"/>
 <span className="text-sm font-medium text-[#6B7280] group-hover:text-[#0F172A] transition-colors">Ingat saya</span>
 </label>
 <Link href="#"className="text-sm font-bold text-[#D4A017] hover:text-[#FFB800] transition-colors">
 Lupa Password?
 </Link>
 </div>

 <Button type="submit"variant="gold"size="lg"className="w-full mt-6"disabled={loading}>
 {loading ?"Memproses...":"Masuk ke LapakRo"}
 </Button>
 </form>

 <div className="relative my-8">
 <div className="absolute inset-0 flex items-center">
 <span className="w-full border-t border-gray-200"/>
 </div>
 <div className="relative flex justify-center text-xs">
 <span className="bg-white px-4 text-[#94A3B8] font-medium uppercase tracking-wider">
 Atau masuk dengan
 </span>
 </div>
 </div>

 <Button
 variant="outline"size="lg"className="w-full gap-3 font-bold bg-white text-[#0F172A] hover:bg-gray-50 border-gray-200"onClick={() => {
 window.location.href ="http://localhost:3001/auth/google"}}
 >
 <svg className="h-5 w-5"viewBox="0 0 24 24">
 <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"fill="#4285F4"/>
 <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"fill="#34A853"/>
 <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"fill="#FBBC05"/>
 <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"fill="#EA4335"/>
 </svg>
 Google
 </Button>

 <p className="mt-8 text-center text-sm text-[#6B7280]">
 Belum punya akun?{""}
 <Link href="/register"className="font-bold text-[#D4A017] hover:text-[#FFB800] transition-colors">
 Daftar Sekarang
 </Link>
 </p>
 </div>
 </div>
 </div>
 )
}
