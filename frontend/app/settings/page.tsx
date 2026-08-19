"use client"
import { useState } from "react"
import { Settings, User, Bell, Shield, Key, Save } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/hooks/use-auth"
export default function SettingsPage() {
 const { user } = useAuth()
 const [activeTab, setActiveTab] = useState("profile")

 return (
 <div className="min-h-screen bg-[#F8FAFC] pt-6 pb-24">
 <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none -z-10"/>
 
 <div className="mx-auto max-w-6xl px-4 sm:px-6">
 <div className="mb-8">
 <div className="flex items-center gap-2 text-sm font-bold text-[#D4A017] mb-2">
 <Settings className="h-4 w-4"/>
 <span>PENGATURAN</span>
 </div>
 <h1 className="text-3xl sm:text-4xl font-black text-[#0F172A]">
 Pengaturan Akun
 </h1>
 </div>

 <div className="flex flex-col md:flex-row gap-8">
 {/* Sidebar Navigation */}
 <aside className="w-full md:w-64 shrink-0">
 <Card className="bg-white border-gray-100 shadow-sm overflow-hidden">
 <div className="flex flex-col">
 <button 
 onClick={() => setActiveTab("profile")}
 className={`flex items-center gap-3 p-4 text-left font-medium transition-colors ${activeTab ==="profile"?"bg-[#FFFBEB] text-[#D4A017] border-l-4 border-[#FFD700]":"text-[#6B7280] hover:bg-gray-50 border-l-4 border-transparent"}`}
 >
 <User className="h-5 w-5"/>
 Profil Pengguna
 </button>
 <button 
 onClick={() => setActiveTab("security")}
 className={`flex items-center gap-3 p-4 text-left font-medium transition-colors ${activeTab ==="security"?"bg-[#FFFBEB] text-[#D4A017] border-l-4 border-[#FFD700]":"text-[#6B7280] hover:bg-gray-50 border-l-4 border-transparent"}`}
 >
 <Shield className="h-5 w-5"/>
 Keamanan & Password
 </button>
 <button 
 onClick={() => setActiveTab("notifications")}
 className={`flex items-center gap-3 p-4 text-left font-medium transition-colors ${activeTab ==="notifications"?"bg-[#FFFBEB] text-[#D4A017] border-l-4 border-[#FFD700]":"text-[#6B7280] hover:bg-gray-50 border-l-4 border-transparent"}`}
 >
 <Bell className="h-5 w-5"/>
 Notifikasi
 </button>
 </div>
 </Card>
 </aside>

 {/* Main Content Area */}
 <main className="flex-1">
 {activeTab ==="profile"&& (
 <Card className="bg-white border border-gray-100 shadow-sm">
 <CardHeader className="border-b border-gray-100 pb-4">
 <CardTitle className="text-[#0F172A]">Informasi Profil</CardTitle>
 <CardDescription>Perbarui foto dan detail personal Anda.</CardDescription>
 </CardHeader>
 <CardContent className="p-6 space-y-6">
 <div className="flex items-center gap-6">
 <div className="h-24 w-24 rounded-full bg-gray-100 border-4 border-white shadow-sm flex items-center justify-center overflow-hidden">
 <User className="h-10 w-10 text-gray-400"/>
 </div>
 <div>
 <Button variant="outline"className="border-gray-200 text-[#0F172A]">Ubah Foto</Button>
 <p className="text-xs text-[#6B7280] mt-2">Format JPG, PNG maksimal 2MB</p>
 </div>
 </div>

 <div className="grid sm:grid-cols-2 gap-4">
 <div className="space-y-2">
 <label className="text-sm font-bold text-[#0F172A]">Nama Lengkap</label>
 <Input defaultValue={user?.name} className="bg-gray-50 border-gray-200 focus:bg-white"/>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-[#0F172A]">Username</label>
 <Input defaultValue={user?.name?.toLowerCase().replace(/\s/g,'')} className="bg-gray-50 border-gray-200 focus:bg-white"/>
 </div>
 <div className="space-y-2 sm:col-span-2">
 <label className="text-sm font-bold text-[#0F172A]">Email</label>
 <Input defaultValue={user?.email} disabled className="bg-gray-100 border-gray-200 text-gray-500"/>
 <p className="text-xs text-[#6B7280]">Email tidak dapat diubah karena terhubung dengan autentikasi akun.</p>
 </div>
 </div>

 <div className="pt-4 border-t border-gray-100 flex justify-end">
 <Button variant="gold"className="font-bold shadow-md">
 <Save className="mr-2 h-4 w-4"/> Simpan Perubahan
 </Button>
 </div>
 </CardContent>
 </Card>
 )}

 {activeTab ==="security"&& (
 <Card className="bg-white border border-gray-100 shadow-sm">
 <CardHeader className="border-b border-gray-100 pb-4">
 <CardTitle className="text-[#0F172A]">Ubah Password</CardTitle>
 <CardDescription>Pastikan akun Anda menggunakan password yang kuat.</CardDescription>
 </CardHeader>
 <CardContent className="p-6 space-y-4">
 <div className="space-y-2">
 <label className="text-sm font-bold text-[#0F172A]">Password Saat Ini</label>
 <Input type="password"placeholder="Masukkan password saat ini"className="bg-gray-50 border-gray-200 focus:bg-white"/>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-[#0F172A]">Password Baru</label>
 <Input type="password"placeholder="Masukkan password baru"className="bg-gray-50 border-gray-200 focus:bg-white"/>
 </div>
 <div className="space-y-2">
 <label className="text-sm font-bold text-[#0F172A]">Konfirmasi Password Baru</label>
 <Input type="password"placeholder="Ketik ulang password baru"className="bg-gray-50 border-gray-200 focus:bg-white"/>
 </div>

 <div className="pt-4 border-t border-gray-100 flex justify-end">
 <Button variant="gold"className="font-bold shadow-md">
 <Key className="mr-2 h-4 w-4"/> Update Password
 </Button>
 </div>
 </CardContent>
 </Card>
 )}

 {activeTab ==="notifications"&& (
 <Card className="bg-white border border-gray-100 shadow-sm">
 <CardHeader className="border-b border-gray-100 pb-4">
 <CardTitle className="text-[#0F172A]">Pengaturan Notifikasi</CardTitle>
 <CardDescription>Pilih notifikasi apa saja yang ingin Anda terima.</CardDescription>
 </CardHeader>
 <CardContent className="p-6">
 <p className="text-[#6B7280] italic">Fitur notifikasi sedang dalam pengembangan.</p>
 </CardContent>
 </Card>
 )}
 </main>
 </div>
 </div>
 </div>
 )
}
