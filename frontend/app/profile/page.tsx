"use client"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ShieldCheck, User, Mail, Phone, Lock, Upload, LogOut } from "lucide-react"
import { getInitials } from "@/lib/utils"
import { hasSufficientRole } from "@/lib/roles"
export default function ProfilePage() {
 const { user, logout } = useAuth()
 const [isEditing, setIsEditing] = useState(false)

 return (
 <div className="min-h-screen bg-[#F5F5F5] py-8">
 <div className="absolute inset-0 bg-cubes opacity-20 pointer-events-none -z-10"/>
 
 <div className="mx-auto max-w-5xl px-4 sm:px-6">
 <h1 className="text-3xl font-black text-[#111827] mb-8">Profil Saya</h1>

 <div className="grid gap-8 lg:grid-cols-3">
 {/* Profile Card Sidebar */}
 <div className="lg:col-span-1 space-y-6">
 <Card variant="glass-strong"className="overflow-hidden">
 <div className="h-24 bg-gradient-to-r from-[#FFD700] to-[#D4A017] relative">
 <div className="absolute inset-0 bg-cubes opacity-20"/>
 </div>
 <CardContent className="px-6 pb-6 pt-0 relative">
 <div className="flex flex-col items-center -mt-12 mb-4">
 <div className="relative group">
 <Avatar className="h-24 w-24 border-4 border-white shadow-sm">
 <AvatarFallback className="bg-[#111827] text-white text-2xl font-bold">
 {getInitials(user?.name ||"User")}
 </AvatarFallback>
 </Avatar>
 <button className="absolute bottom-0 right-0 p-1.5 bg-white rounded-full border border-[#EAEAEA] text-[#6B7280] hover:text-[#111827] :text-white hover:border-[#D1D5DB] transition-all">
 <Upload className="h-4 w-4"/>
 </button>
 </div>
 </div>

 <div className="text-center space-y-1">
 <h2 className="text-xl font-black text-[#111827] flex items-center justify-center gap-1.5">
 {user?.name}
  {hasSufficientRole(user?.role || "user", "seller") && <ShieldCheck className="h-4 w-4 text-[#22C55E]"/>}
 </h2>
 <p className="text-sm text-[#6B7280]">{user?.email}</p>
 </div>

 <div className="mt-6 flex justify-center">
  <Badge variant={hasSufficientRole(user?.role || "user", "seller") ? "gold" : "outline"} className="px-3 py-1">
  {hasSufficientRole(user?.role || "user", "seller") ? "Penjual Terverifikasi" : "Member LapakRo"}
  </Badge>
 </div>

 <div className="mt-8 pt-6 border-t border-[#EAEAEA]">
 <Button variant="outline"className="w-full text-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444] border-transparent :bg-[#EF4444]/10"onClick={logout}>
 <LogOut className="mr-2 h-4 w-4"/>
 Keluar Akun
 </Button>
 </div>
 </CardContent>
 </Card>
 </div>

 {/* Main Info */}
 <div className="lg:col-span-2 space-y-6">
 <Card variant="glass">
 <CardHeader className="flex flex-row items-center justify-between">
 <div>
 <CardTitle className="text-lg">Informasi Pribadi</CardTitle>
 <CardDescription>Ubah detail profil dan informasi kontak Anda.</CardDescription>
 </div>
 <Button variant={isEditing ?"default":"outline"} size="sm"onClick={() => setIsEditing(!isEditing)}>
 {isEditing ?"Simpan Perubahan":"Edit Profil"}
 </Button>
 </CardHeader>
 <CardContent className="space-y-6">
 <div className="grid gap-6 sm:grid-cols-2">
 <div className="space-y-2">
 <label className="text-sm font-bold text-[#111827] flex items-center gap-2">
 <User className="h-4 w-4 text-[#6B7280]"/>
 Nama Lengkap
 </label>
 <Input disabled={!isEditing} defaultValue={user?.name} />
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-[#111827] flex items-center gap-2">
 <Phone className="h-4 w-4 text-[#6B7280]"/>
 Nomor Telepon
 </label>
 <Input disabled={!isEditing} defaultValue={user?.phone ||"-"} />
 </div>
 <div className="space-y-2 sm:col-span-2">
 <label className="text-sm font-bold text-[#111827] flex items-center gap-2">
 <Mail className="h-4 w-4 text-[#6B7280]"/>
 Alamat Email
 </label>
 <Input disabled defaultValue={user?.email} className="bg-[#F5F5F5]"/>
 <p className="text-xs text-[#6B7280] ml-6">Email tidak dapat diubah karena terhubung dengan akun Anda.</p>
 </div>
 </div>
 </CardContent>
 </Card>

 <Card variant="glass">
 <CardHeader>
 <CardTitle className="text-lg flex items-center gap-2">
 <Lock className="h-5 w-5 text-[#6B7280]"/>
 Keamanan
 </CardTitle>
 </CardHeader>
 <CardContent className="space-y-4">
 <div className="flex items-center justify-between py-2 border-b border-[#EAEAEA]">
 <div>
 <p className="font-bold text-[#111827]">Password</p>
 <p className="text-sm text-[#6B7280]">Terakhir diubah 30 hari yang lalu</p>
 </div>
 <Button variant="outline"size="sm">Ubah</Button>
 </div>
 <div className="flex items-center justify-between py-2">
 <div>
 <p className="font-bold text-[#111827]">Verifikasi 2 Langkah (2FA)</p>
 <p className="text-sm text-[#6B7280]">Amankan akun Anda dengan lapisan ekstra</p>
 </div>
 <Button variant="outline"size="sm"className="text-[#D4A017] border-[#D4A017] hover:bg-[#D4A017]/10">Aktifkan</Button>
 </div>
 </CardContent>
 </Card>
 </div>
 </div>
 </div>
 </div>
 )
}
