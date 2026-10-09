import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
 {
 variants: {
 variant: {
 default: "bg-[#D4A017] text-white hover:bg-[#B8860B] focus-visible:ring-[#FFD700] shadow-sm hover:shadow-md rounded-xl",
 gold:"bg-gradient-to-r from-[#FFD700] via-[#FFB800] to-[#F59E0B] text-[#111827] hover:shadow-[0_4px_20px_rgba(255,215,0,0.35)] focus-visible:ring-[#FFD700] font-bold rounded-xl shadow-md hover:brightness-105 active:brightness-95",
 destructive:"bg-[#EF4444] text-white hover:bg-[#DC2626] focus-visible:ring-[#EF4444] rounded-xl shadow-sm",
  outline:"border border-[#EAEAEA] bg-white text-[#111827] hover:bg-[#F5F5F5] hover:border-[#D1D5DB] focus-visible:ring-[#FFD700] rounded-xl",
  secondary:"bg-[#F5F5F5] text-[#111827] hover:bg-[#EAEAEA] focus-visible:ring-[#FFD700] rounded-xl",
  ghost:"text-[#6B7280] hover:text-[#111827] hover:bg-[#F5F5F5] focus-visible:ring-[#FFD700] rounded-xl",
 link:"text-[#D4A017] underline-offset-4 hover:underline hover:text-[#FFB800] focus-visible:ring-[#FFD700]",
 premium:"bg-gradient-to-r from-[#111827] to-[#1F2937] text-white border border-[rgba(255,215,0,0.2)] hover:border-[rgba(255,215,0,0.4)] hover:shadow-[0_0_20px_rgba(255,215,0,0.1)] focus-visible:ring-[#FFD700] rounded-xl shadow-md",
 },
 size: {
 default:"h-11 px-5 py-2.5",
 sm:"h-9 px-4 text-xs",
 lg:"h-12 px-8 text-base",
 xl:"h-14 px-10 text-base",
 icon:"h-10 w-10",
 },
 },
 defaultVariants: {
 variant:"default",
 size:"default",
 },
 }
)

export interface ButtonProps
 extends React.ButtonHTMLAttributes<HTMLButtonElement>,
 VariantProps<typeof buttonVariants> {
 asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
 ({ className, variant, size, asChild = false, ...props }, ref) => {
 const Comp = asChild ? Slot :"button"

 return (
 <Comp
 className={cn(buttonVariants({ variant, size, className }))}
 ref={ref}
 {...props}
 />
 )
 }
)
Button.displayName ="Button"
export { Button, buttonVariants }
