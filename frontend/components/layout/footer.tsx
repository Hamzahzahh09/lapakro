import Link from "next/link"
import { ShieldCheck, Zap, HeadphonesIcon, CreditCard } from "lucide-react"
import { RobuxCoin, FloatingRobux } from "@/components/ui/robux-decorations"
export function Footer() {
 return (
 <footer className="relative w-full overflow-hidden border-t border-gray-200 bg-white text-[#0F172A] pt-16 pb-24 md:pb-12">
 {/* Decorative background */}
 <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none"/>
 <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#FFD700] rounded-full blur-[120px] opacity-[0.1] pointer-events-none"/>
 <FloatingRobux size="sm"className="top-20 left-10 opacity-40"delay={0} duration={5} />
 <FloatingRobux size="md"className="bottom-20 right-20 opacity-30"delay={2} duration={6} />

 <div className="relative mx-auto max-w-[1400px] px-4 sm:px-6">
 {/* Top Features Bar */}
 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-gray-100">
 <div className="flex flex-col items-center text-center">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFB800]/10 mb-4 shadow-sm border border-[#FFD700]/10">
 <ShieldCheck className="h-6 w-6 text-[#D4A017]"/>
 </div>
 <h4 className="text-sm font-bold text-[#0F172A] mb-1">Escrow Protected</h4>
 <p className="text-xs text-[#6B7280]">Funds held until delivery</p>
 </div>
 <div className="flex flex-col items-center text-center">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFB800]/10 mb-4 shadow-sm border border-[#FFD700]/10">
 <Zap className="h-6 w-6 text-[#D4A017]"/>
 </div>
 <h4 className="text-sm font-bold text-[#0F172A] mb-1">Instant Delivery</h4>
 <p className="text-xs text-[#6B7280]">Automated fulfillment</p>
 </div>
 <div className="flex flex-col items-center text-center">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFB800]/10 mb-4 shadow-sm border border-[#FFD700]/10">
 <CreditCard className="h-6 w-6 text-[#D4A017]"/>
 </div>
 <h4 className="text-sm font-bold text-[#0F172A] mb-1">Secure Payments</h4>
 <p className="text-xs text-[#6B7280]">Multiple trusted options</p>
 </div>
 <div className="flex flex-col items-center text-center">
 <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[#FFD700]/20 to-[#FFB800]/10 mb-4 shadow-sm border border-[#FFD700]/10">
 <HeadphonesIcon className="h-6 w-6 text-[#D4A017]"/>
 </div>
 <h4 className="text-sm font-bold text-[#0F172A] mb-1">24/7 Support</h4>
 <p className="text-xs text-[#6B7280]">Always here to help</p>
 </div>
 </div>

 {/* Main Footer Content */}
 <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5 pt-12">
 <div className="lg:col-span-2">
 <Link
 href="/"className="flex items-center gap-2.5 text-2xl font-black tracking-tight">
 <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#FFD700] to-[#D4A017] shadow-[0_0_15px_rgba(255,215,0,0.3)]">
 <RobuxCoin className="h-5 w-5 drop-shadow-sm text-white"/>
 </div>
 <span className="text-[#0F172A]">
 Lapak<span className="text-[#D4A017]">Ro</span>
 </span>
 </Link>
 <p className="mt-4 text-sm text-[#6B7280] max-w-sm leading-relaxed">
 The premier marketplace for Roblox players, traders, and developers. 
 Buy and sell Robux, limiteds, game passes, and developer services with zero risk.
 </p>
 <div className="mt-6 flex items-center gap-3">
 <div className="flex h-10 items-center gap-2 rounded-xl border border-[#FFD700]/30 bg-[#FFFBEB] px-4">
 <div className="flex -space-x-2">
 {[1, 2, 3].map((i) => (
 <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`} className="h-6 w-6 rounded-full ring-2 ring-white"alt="User"/>
 ))}
 </div>
 <span className="text-xs font-bold text-[#D4A017]">100K+ Users</span>
 </div>
 </div>
 </div>

 <div>
 <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">
 Marketplace
 </h3>
 <ul className="space-y-3">
 <li>
 <Link href="/products"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 All Products
 </Link>
 </li>
 <li>
 <Link href="/products?category=robux"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Buy Robux
 </Link>
 </li>
 <li>
 <Link href="/products?category=gamepass"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Game Passes
 </Link>
 </li>
 <li>
 <Link href="/products?category=limiteds"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Limited Items
 </Link>
 </li>
 <li>
 <Link href="/products?category=accounts"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Roblox Accounts
 </Link>
 </li>
 </ul>
 </div>

 <div>
 <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">
 Support
 </h3>
 <ul className="space-y-3">
 <li>
 <Link href="/help"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Help Center
 </Link>
 </li>
 <li>
 <Link href="/help"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Safety Center
 </Link>
 </li>
 <li>
 <Link href="/help"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Dispute Resolution
 </Link>
 </li>
 <li>
 <Link href="/help"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Terms of Service
 </Link>
 </li>
 <li>
 <Link href="/help"className="text-sm text-[#6B7280] hover:text-[#D4A017] transition-colors font-medium">
 Privacy Policy
 </Link>
 </li>
 </ul>
 </div>

 <div>
 <h3 className="text-sm font-bold text-[#0F172A] uppercase tracking-wider mb-4">
 Payment Methods
 </h3>
 <div className="flex flex-wrap gap-2">
 {["BCA","BNI","Mandiri","BRI","GoPay","OVO","DANA","QRIS"].map(
 (method) => (
 <span
 key={method}
 className="inline-flex items-center rounded-lg border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-xs font-bold text-[#6B7280]">
 {method}
 </span>
 )
 )}
 </div>
 <div className="mt-6 p-4 rounded-xl border border-[#FFD700]/30 bg-[#FFFBEB] shadow-sm">
 <p className="text-xs font-medium text-[#6B7280]">
 Ready to make money from your Roblox assets?
 </p>
 <Link href="/register"className="mt-2 inline-block text-sm font-black text-[#D4A017] hover:underline">
 Become a Seller →
 </Link>
 </div>
 </div>
 </div>

 <div className="mt-12 flex flex-col md:flex-row items-center justify-between border-t border-gray-200 pt-8">
 <p className="text-xs text-[#6B7280] font-medium">
 &copy; {new Date().getFullYear()} LapakRo Marketplace. All rights reserved.
 </p>
 <p className="mt-2 md:mt-0 text-[10px] text-[#6B7280] max-w-md text-center md:text-right">
 LapakRo is not affiliated with, endorsed, sponsored, or specifically approved by Roblox Corporation. 
 Roblox and Robux are trademarks of Roblox Corporation.
 </p>
 </div>
 </div>
 </footer>
 )
}
