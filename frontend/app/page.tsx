"use client"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/components/products/product-card"
import type { ProductItem } from "@/components/products/product-grid"
import { ArrowRight, ShieldCheck, Zap, Gamepad2, ShoppingBag, Users, Star, Loader2 } from "lucide-react"
import { api } from "@/lib/api"
import { useAuthStore } from "@/lib/store"
import { hasSufficientRole } from "@/lib/roles"
import { RobuxCoin, FloatingRobux, TrustBadge } from "@/components/ui/robux-decorations"
const categories = [
 { id: "robux", name: "Robux", icon: Gamepad2, desc: "Buy Robux safely"},
 { id: "gamepass", name: "Game Pass", icon: Zap, desc: "Blox Fruits, etc."},
 { id: "avatar", name: "Items", icon: ShoppingBag, desc: "Limiteds & avatar"},
 { id: "account", name: "Accounts", icon: Users, desc: "Level up fast"},
 { id: "boosting", name: "Boosting", icon: Zap, desc: "Rank up service"},
 { id: "joki", name: "Services", icon: Star, desc: "Hire pro players"},
]

export default function HomePage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [products, setProducts] = useState<ProductItem[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuthStore()
  const canBecomeSeller = !user || !hasSufficientRole(user.role, "seller")

 useEffect(() => {
 api
 .get<{ success: boolean; data: ProductItem[]; total: number }>("/products", {
 params: { limit: 8, sortBy:"newest"},
 })
 .then((res) => setProducts(res.data || []))
 .catch(() => setProducts([]))
 .finally(() => setLoading(false))
 }, [])

 const handleSearch = (e: React.FormEvent) => {
 e.preventDefault()
 if (searchQuery.trim()) {
 router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`)
 }
 }

 return (
 <div className="flex flex-col min-h-screen bg-white">
 {/* Premium Hero Section */}
 <section className="relative overflow-hidden bg-gradient-hero pt-24 pb-32 lg:pt-32 lg:pb-40 text-[#0F172A] border-b border-gray-100">
 {/* Background elements */}
 <div className="absolute inset-0 bg-cubes opacity-30 pointer-events-none"/>
 <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#FFD700] rounded-full blur-[150px] opacity-[0.15] pointer-events-none translate-x-1/3 -translate-y-1/3"/>
 <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFB800] rounded-full blur-[120px] opacity-[0.1] pointer-events-none -translate-x-1/2 translate-y-1/2"/>
 
 {/* Floating decorations */}
 <FloatingRobux size="lg"className="top-24 right-32 opacity-100 hidden lg:block"delay={0} duration={5} />
 <FloatingRobux size="sm"className="top-40 right-1/4 opacity-80 hidden lg:block"delay={1} duration={4} />
 <FloatingRobux size="md"className="bottom-24 right-1/3 opacity-90 hidden lg:block"delay={2} duration={6} />
 <FloatingRobux size="sm"className="top-1/3 left-12 opacity-70 hidden lg:block"delay={1.5} duration={5.5} />

 <div className="mx-auto max-w-[1400px] px-4 sm:px-6 relative z-10">
 <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
 
 {/* Hero Left Content */}
 <div className="flex-1 text-center lg:text-left max-w-3xl mx-auto lg:mx-0">
 <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#FFD700]/40 bg-[#FFD700]/10 mb-6 animate-slide-down">
 <Star className="h-4 w-4 text-[#D4A017]"/>
 <span className="text-xs font-bold text-[#D4A017] tracking-wide uppercase">The #1 Trusted Roblox Marketplace</span>
 </div>
 
 <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.1] animate-slide-up text-[#0F172A]"style={{ animationDelay:'100ms'}}>
 Buy & Sell <br className="hidden sm:block"/>
 <span className="gradient-gold-text">Roblox Assets</span> Safely
 </h1>
 
 <p className="text-lg sm:text-xl text-[#475569] mb-10 max-w-2xl mx-auto lg:mx-0 animate-slide-up leading-relaxed"style={{ animationDelay:'200ms'}}>
 The trusted marketplace for Roblox players, traders, and developers. Buy Robux, limiteds, game passes, and developer services with zero risk.
 </p>
 
 <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start animate-slide-up"style={{ animationDelay:'300ms'}}>
 <Link href="/products"className="w-full sm:w-auto">
 <Button variant="gold"size="xl"className="w-full text-lg shadow-gold-lg">
 Start Shopping
 <ArrowRight className="ml-2 h-5 w-5"/>
 </Button>
 </Link>
  {canBecomeSeller && (
  <Link href="/register"className="w-full sm:w-auto">
  <Button variant="outline"size="xl"className="w-full text-lg bg-white border-gray-200 text-[#0F172A] hover:bg-gray-50 hover:border-gray-300">
  Become a Seller
  </Button>
  </Link>
  )}
  </div>

 <div className="mt-10 flex items-center gap-6 justify-center lg:justify-start animate-slide-up"style={{ animationDelay:'400ms'}}>
 <div className="flex -space-x-3">
 {[1, 2, 3, 4].map((i) => (
 <img key={i} src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} className="h-10 w-10 rounded-full ring-2 ring-white bg-gray-100"alt="User"/>
 ))}
 </div>
 <div className="flex flex-col">
 <div className="flex items-center gap-1">
 {[1, 2, 3, 4, 5].map((i) => (
 <Star key={i} className="h-4 w-4 fill-[#FFD700] text-[#FFD700]"/>
 ))}
 </div>
 <span className="text-xs text-[#475569] font-medium mt-1">Trusted by 100,000+ players</span>
 </div>
 </div>
 </div>

 {/* Hero Right Illustration */}
 <div className="flex-1 hidden lg:block relative h-[600px] w-full animate-fade-in"style={{ animationDelay:'200ms'}}>
 <div className="absolute inset-0 flex items-center justify-center">
 {/* Main Abstract Shape */}
 <div className="relative w-[450px] h-[450px]">
 {/* Outer Ring */}
 <div className="absolute inset-0 rounded-full border border-[#FFD700]/20 animate-spin-slow"/>
 <div className="absolute inset-8 rounded-full border border-[#FFD700]/30 animate-spin-slow"style={{ animationDirection:'reverse'}} />
 
 {/* Central glowing orb */}
 <div className="absolute inset-20 rounded-full bg-gradient-to-br from-[#FFD700] to-[#D4A017] opacity-20 blur-3xl animate-pulse-slow"/>

 {/* UI Cards floating around */}
 <div className="absolute -top-4 -left-12 animate-float-delayed">
 <TrustBadge icon={ShieldCheck} title="100% Secure"description="Escrow protection"/>
 </div>
 
 <div className="absolute bottom-12 -right-8 animate-float">
 <div className="glass-strong p-4 rounded-2xl flex items-center gap-4 shadow-xl">
 <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
 <Check className="h-6 w-6 text-green-500"/>
 </div>
 <div>
 <p className="text-xs text-[#6B7280] font-medium">Transaction Complete</p>
 <p className="text-sm font-bold text-[#0F172A]">+ 10,000 Robux</p>
 </div>
 </div>
 </div>

 <div className="absolute top-1/3 -right-16 animate-float-slow">
 <div className="glass-strong p-4 rounded-2xl shadow-xl">
 <div className="flex items-center gap-3 mb-2">
 <RobuxCoin className="h-6 w-6"/>
 <span className="font-bold text-[#0F172A]">Best Value</span>
 </div>
 <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
 <div className="h-full bg-[#FFD700] w-3/4"/>
 </div>
 </div>
 </div>

 {/* Center piece */}
 <div className="absolute inset-0 flex items-center justify-center animate-float">
 <div className="w-48 h-48 rounded-full bg-white border border-[#FFD700]/40 shadow-gold-lg flex items-center justify-center relative overflow-hidden">
 <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDIxNSwwLDAuMSkiLz48L3N2Zz4=')] opacity-50"/>
 <RobuxCoin className="w-24 h-24 drop-shadow-[0_10px_15px_rgba(255,215,0,0.4)]"/>
 </div>
 </div>

 </div>
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Trust Bar */}
 <section className="bg-[#F8FAFC] border-b border-gray-100 py-8">
 <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
 <div className="flex flex-wrap justify-center sm:justify-between items-center gap-8 opacity-60">
 {['Roblox Traders','Dev Studio','Gaming Corp','Esports Team','Collectors'].map((partner, i) => (
 <span key={i} className="text-xl font-black tracking-widest uppercase text-[#475569]">
 {partner}
 </span>
 ))}
 </div>
 </div>
 </section>

 {/* Categories */}
 <section className="py-20 bg-white">
 <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
 <div className="text-center mb-12">
 <h2 className="text-3xl font-black text-[#0F172A]">
 Explore Marketplace
 </h2>
 <p className="mt-4 text-[#6B7280] max-w-2xl mx-auto">
 Everything you need for your Roblox journey in one secure platform.
 </p>
 </div>
 
 <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
 {categories.map((cat, i) => {
 const Icon = cat.icon
 return (
 <Link
 key={cat.id}
 href={`/products?category=${cat.id}`}
 className="group relative bg-[#F8FAFC] border border-gray-100 rounded-2xl p-6 hover-lift text-center overflow-hidden hover-gold-border shadow-sm hover:bg-white"style={{ animationDelay: `${i * 100}ms` }}
 >
 <div className="absolute inset-0 bg-gradient-to-br from-[#FFD700]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
 <div className="relative z-10 flex flex-col items-center">
 <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-sm mb-4 group-hover:bg-[#FFD700] group-hover:shadow-gold transition-all duration-300">
 <Icon className="h-7 w-7 text-[#0F172A] transition-colors"/>
 </div>
 <h3 className="text-base font-bold text-[#0F172A] mb-1 group-hover:text-[#D4A017] transition-colors">
 {cat.name}
 </h3>
 <p className="text-xs text-[#6B7280]">
 {cat.desc}
 </p>
 </div>
 </Link>
 )
 })}
 </div>
 </div>
 </section>

 {/* Featured Products */}
 <section className="py-20 bg-[#F8FAFC] relative overflow-hidden border-y border-gray-100">
 {/* Decorative elements */}
 <div className="absolute top-1/2 left-0 w-96 h-96 bg-[#FFD700]/10 rounded-full blur-[100px] pointer-events-none -translate-y-1/2"/>
 
 <div className="mx-auto max-w-[1400px] px-4 sm:px-6 relative z-10">
 <div className="flex flex-col sm:flex-row items-center justify-between mb-10 gap-4">
 <div>
 <h2 className="text-3xl font-black text-[#0F172A]">
 Trending Now
 </h2>
 <p className="mt-2 text-[#6B7280]">
 Most popular products verified by our community
 </p>
 </div>
 <Link
 href="/products"className="inline-flex items-center gap-2 text-sm font-bold text-[#D4A017] hover:text-[#FFB800] transition-colors bg-[#FFD700]/10 hover:bg-[#FFD700]/20 px-4 py-2 rounded-xl">
 View All Products
 <ArrowRight className="h-4 w-4"/>
 </Link>
 </div>

 <div className="mt-8">
 {loading ? (
 <div className="flex flex-col items-center justify-center py-20 space-y-4">
 <div className="relative">
 <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-40 rounded-full"/>
 <Loader2 className="h-10 w-10 animate-spin text-[#D4A017] relative z-10"/>
 </div>
 <p className="text-[#6B7280] font-medium">Loading marketplace...</p>
 </div>
 ) : products.length === 0 ? (
 <div className="py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
 <ShoppingBag className="mx-auto h-12 w-12 text-[#6B7280] mb-4 opacity-50"/>
 <h3 className="text-lg font-bold text-[#0F172A] mb-2">Marketplace is empty</h3>
  <p className="text-[#6B7280] mb-6">{canBecomeSeller ? "Be the first seller to list a product!" : "No products available yet."}</p>
  {canBecomeSeller && (
  <Link href="/register">
  <Button variant="gold">Become a Seller</Button>
  </Link>
  )}
 </div>
 ) : (
 <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 stagger-children">
 {products.map((product) => (
 <ProductCard key={product.id} product={product} />
 ))}
 </div>
 )}
 </div>
 </div>
 </section>

 {/* How it works */}
 <section className="py-24 bg-white">
 <div className="mx-auto max-w-[1400px] px-4 sm:px-6">
 <div className="text-center mb-16">
 <h2 className="text-3xl font-black text-[#0F172A]">
 How LapakRo Works
 </h2>
 <p className="mt-4 text-[#6B7280] max-w-2xl mx-auto">
 We use an advanced escrow system to ensure every transaction is 100% secure.
 </p>
 </div>

 <div className="grid md:grid-cols-3 gap-12 relative">
 {/* Connecting Line (Desktop) */}
 <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-transparent via-[#FFD700] to-transparent opacity-50"/>

 {[
 {
 icon: ShoppingBag,
 title:"1. Choose & Order",
 desc: "Find what you need and place an order. Your payment is held securely in our escrow system."},
 {
 icon: ShieldCheck,
 title:"2. Escrow Protection",
 desc: "The seller is notified to deliver your order. We hold your money until you receive the item."},
 {
 icon: Gamepad2,
 title:"3. Receive & Enjoy",
 desc: "Confirm delivery in the system, and we release the funds to the seller. Everyone wins!"}
 ].map((step, i) => {
 const Icon = step.icon
 return (
 <div key={i} className="relative z-10 flex flex-col items-center text-center">
 <div className="w-24 h-24 rounded-full bg-white shadow-gold flex items-center justify-center mb-6 border border-[#FFD700]/30 hover:scale-105 transition-transform duration-300">
 <Icon className="h-10 w-10 text-[#D4A017]"/>
 </div>
 <h3 className="text-xl font-bold text-[#0F172A] mb-3">
 {step.title}
 </h3>
 <p className="text-[#6B7280] leading-relaxed">
 {step.desc}
 </p>
 </div>
 )
 })}
 </div>
 </div>
 </section>

 {/* CTA Banner */}
 <section className="py-20 relative overflow-hidden bg-white">
 <div className="mx-auto max-w-[1400px] px-4 sm:px-6 relative z-10">
 <div className="bg-gradient-to-r from-[#FFD700] to-[#FFB800] rounded-3xl p-10 md:p-16 flex flex-col md:flex-row items-center justify-between shadow-gold-lg overflow-hidden relative">
 {/* Inner decorations */}
 <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-20 rounded-full blur-3xl"/>
 <RobuxCoin className="absolute -bottom-10 -left-10 w-40 h-40 opacity-10 text-white"/>
 <div className="absolute right-0 top-0 w-1/2 h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xNSI+PHBhdGggZD0iTTM2IDM0djItSDI0di0yaDEyek0zNiAyNHYySDI0di0yaDEyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"/>
 
  <div className="relative z-10 text-center md:text-left mb-8 md:mb-0 max-w-xl">
  {hasSufficientRole(user?.role || "user", "seller") ? (
  <>
  <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
  Welcome to Your Store!
  </h2>
  <p className="text-[#0F172A]/80 text-lg font-medium">
  Manage your products, track sales, and grow your business.
  </p>
  </>
  ) : (
  <>
  <h2 className="text-3xl md:text-4xl font-black text-[#0F172A] mb-4">
  Ready to Start Earning?
  </h2>
  <p className="text-[#0F172A]/80 text-lg font-medium">
  Join 10,000+ sellers who are already making money by selling their Roblox assets on LapakRo.
  </p>
  </>
  )}
  </div>
  
  <div className="relative z-10 flex flex-col sm:flex-row gap-4 w-full md:w-auto">
  {hasSufficientRole(user?.role || "user", "seller") ? (
  <Link href="/seller/dashboard"className="w-full sm:w-auto">
  <Button size="xl"className="w-full bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-xl text-lg font-bold">
  Go to Dashboard
  </Button>
  </Link>
  ) : (
  <Link href="/register"className="w-full sm:w-auto">
  <Button size="xl"className="w-full bg-[#0F172A] text-white hover:bg-[#1E293B] shadow-xl text-lg font-bold">
  Open a Store
  </Button>
  </Link>
  )}
  </div>
 </div>
 </div>
 </section>
 </div>
 )
}

function Check({ className }: { className?: string }) {
 return (
 <svg viewBox="0 0 24 24"fill="none"stroke="currentColor"strokeWidth="3"strokeLinecap="round"strokeLinejoin="round"className={className}>
 <polyline points="20 6 9 17 4 12"/>
 </svg>
 )
}
