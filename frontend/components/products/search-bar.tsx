"use client"
import { useState, useCallback, useRef, useEffect } from "react"
import { Search } from "lucide-react"
import { useRouter } from "next/navigation"
interface SearchBarProps {
 placeholder?: string
 onSearch?: (query: string) => void
 autoFocus?: boolean
}

const suggestions = ["Robux","Game Pass","Item Avatar","Akun","Boosting","Joki",
]

export function SearchBar({
 placeholder ="Cari produk Roblox...",
 onSearch,
 autoFocus,
}: SearchBarProps) {
 const [query, setQuery] = useState("")
 const [showSuggestions, setShowSuggestions] = useState(false)
 const router = useRouter()
 const wrapperRef = useRef<HTMLDivElement>(null)

 useEffect(() => {
 function handleClickOutside(event: MouseEvent) {
 if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
 setShowSuggestions(false)
 }
 }
 document.addEventListener("mousedown", handleClickOutside)
 return () => document.removeEventListener("mousedown", handleClickOutside)
 }, [])

 const handleSubmit = useCallback(
 (e: React.FormEvent) => {
 e.preventDefault()
 setShowSuggestions(false)
 if (onSearch) {
 onSearch(query)
 } else {
 router.push(`/products?search=${encodeURIComponent(query)}`)
 }
 },
 [query, onSearch, router]
 )

 const filteredSuggestions = suggestions.filter(
 (s) => s.toLowerCase().includes(query.toLowerCase()) && query.length > 0
 )

 return (
 <div ref={wrapperRef} className="relative">
 <form onSubmit={handleSubmit}>
 <div className="relative">
 <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/>
 <input
 type="text"value={query}
 onChange={(e) => {
 setQuery(e.target.value)
 setShowSuggestions(true)
 }}
 onFocus={() => setShowSuggestions(true)}
 placeholder={placeholder}
 autoFocus={autoFocus}
 className="w-full h-10 rounded-lg border border-slate-300 bg-white pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500"/>
 </div>
 </form>
 {showSuggestions && filteredSuggestions.length > 0 && (
 <div className="absolute top-full mt-1 w-full rounded-lg border border-slate-200 bg-white py-1 shadow-lg z-10">
 {filteredSuggestions.map((suggestion) => (
 <button
 key={suggestion}
 onClick={() => {
 setQuery(suggestion)
 setShowSuggestions(false)
 if (onSearch) {
 onSearch(suggestion)
 } else {
 router.push(
 `/products?search=${encodeURIComponent(suggestion)}`
 )
 }
 }}
 className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-50 :bg-slate-700">
 {suggestion}
 </button>
 ))}
 </div>
 )}
 </div>
 )
}
