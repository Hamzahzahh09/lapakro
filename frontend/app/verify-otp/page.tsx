"use client"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/use-auth"
import Link from "next/link"
import { Gamepad2 } from "lucide-react"
export default function VerifyOtpPage() {
 const [otp, setOtp] = useState(["","","","","",""])
 const [error, setError] = useState("")
 const [loading, setLoading] = useState(false)
 const [countdown, setCountdown] = useState(60)
 const inputRefs = useRef<(HTMLInputElement | null)[]>([])
 const router = useRouter()
 const { user, verifyOtp, sendOtp } = useAuth()

 useEffect(() => {
 inputRefs.current[0]?.focus()
 }, [])

 useEffect(() => {
 if (countdown > 0) {
 const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
 return () => clearTimeout(timer)
 }
 }, [countdown])

 const handleChange = (index: number, value: string) => {
 if (value.length > 1) return
 const newOtp = [...otp]
 newOtp[index] = value
 setOtp(newOtp)

 if (value && index < 5) {
 inputRefs.current[index + 1]?.focus()
 }
 }

 const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
 if (e.key ==="Backspace"&& !otp[index] && index > 0) {
 inputRefs.current[index - 1]?.focus()
 }
 }

 const handleSubmit = async (e: React.FormEvent) => {
 e.preventDefault()
 setError("")
 const code = otp.join("")
 if (code.length !== 6) {
 setError("Masukkan kode OTP 6 digit")
 return
 }
 
 if (!user?.email) {
 setError("Sesi tidak valid, silakan login ulang")
 router.push("/login")
 return
 }

 setLoading(true)
 try {
 await verifyOtp(user.email, code)
 } catch (err: unknown) {
 setError(err instanceof Error ? err.message :"Verifikasi gagal")
 } finally {
 setLoading(false)
 }
 }

 const resendOtp = async () => {
 if (!user?.email) return
 setCountdown(60)
 try {
 await sendOtp(user.email)
 } catch {
 // silent
 }
 }

 return (
 <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
 <Card className="w-full max-w-md">
 <CardHeader className="text-center">
 <Link href="/"className="mx-auto flex items-center justify-center gap-2 text-2xl font-bold text-[#D4A017]">
 <Gamepad2 className="h-8 w-8"/>
 LapakRo
 </Link>
 <CardTitle className="mt-4 text-xl">Verifikasi OTP</CardTitle>
 <CardDescription>
 Masukkan kode 6 digit yang dikirim ke email Anda
 </CardDescription>
 </CardHeader>
 <CardContent>
 {error && (
 <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
 {error}
 </div>
 )}
 <form onSubmit={handleSubmit}>
 <div className="flex justify-center gap-2">
 {otp.map((digit, index) => (
 <input
 key={index}
 ref={(el) => { inputRefs.current[index] = el }}
 type="text"maxLength={1}
 value={digit}
 onChange={(e) => handleChange(index, e.target.value)}
 onKeyDown={(e) => handleKeyDown(index, e)}
 className="h-12 w-10 rounded-lg border border-slate-300 text-center text-lg font-bold focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:border-[#D4A017] sm:h-14 sm:w-12"inputMode="numeric"autoComplete="one-time-code"/>
 ))}
 </div>
 <Button
 type="submit"className="mt-6 w-full"disabled={loading || otp.join("").length !== 6}
 >
 {loading ?"Memverifikasi...":"Verifikasi"}
 </Button>
 </form>
 <div className="mt-4 text-center">
 {countdown > 0 ? (
 <p className="text-xs text-slate-500">
 Kirim ulang kode dalam {countdown} detik
 </p>
 ) : (
 <button
 onClick={resendOtp}
 className="text-xs font-medium text-[#D4A017] hover:text-[#A67C0A]">
 Kirim ulang kode
 </button>
 )}
 </div>
 </CardContent>
 </Card>
 </div>
 )
}
