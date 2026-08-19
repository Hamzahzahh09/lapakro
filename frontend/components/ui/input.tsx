import * as React from "react"
import { cn } from "@/lib/utils"
export interface InputProps
 extends React.InputHTMLAttributes<HTMLInputElement> {
 label?: string
 error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
 ({ className, type, label, error, ...props }, ref) => {
 return (
 <div className="w-full space-y-2">
 {label && (
 <label className="text-sm font-semibold text-[#111827] ml-1">
 {label}
 </label>
 )}
 <div className="relative">
 <input
 type={type}
 className={cn("flex h-12 w-full rounded-2xl border border-[#EAEAEA] bg-white px-4 py-2 text-sm text-[#111827] shadow-sm transition-all duration-200","file:border-0 file:bg-transparent file:text-sm file:font-medium","placeholder:text-[#6B7280]","focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FFD700] focus-visible:border-transparent","disabled:cursor-not-allowed disabled:opacity-50",":text-[#6B7280]","hover:border-[#D1D5DB] :border-[#D1D5DB]",
 error &&"border-[#EF4444] focus-visible:ring-[#EF4444]",
 className
 )}
 ref={ref}
 {...props}
 />
 </div>
 {error && (
 <p className="text-xs font-medium text-[#EF4444] ml-1">{error}</p>
 )}
 </div>
 )
 }
)
Input.displayName ="Input"
export { Input }
