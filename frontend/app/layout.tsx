import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"// Update font to Inter as it's cleaner and more modern for a premium marketplace
const inter = Inter({
 subsets: ["latin"],
 variable:"--font-sans",
})

export const metadata: Metadata = {
 title:"LapakRo — Buy & Sell Roblox Assets Safely",
 description:"The trusted marketplace for Roblox players, traders, and developers. Buy Robux, limiteds, game passes, and developer services securely.",
}

export default function RootLayout({
 children,
}: Readonly<{
 children: React.ReactNode
}>) {
 return (
 <html
 lang="en"className={`${inter.variable} antialiased`}
 >
 <body className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)] selection:bg-[#FFD700]/20 selection:text-[#111827]">
 {/* Subtle grid background for the entire app */}
 <div className="fixed inset-0 bg-grid opacity-30 pointer-events-none -z-10"/>
 
 <Header />
 <main className="flex-1">{children}</main>
 <Footer />
 </body>
 </html>
 )
}
