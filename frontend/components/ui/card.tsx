import * as React from "react"
import { cn } from "@/lib/utils"
const Card = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement> & { variant?:"default"|"glass"|"glass-strong"|"premium"}
>(({ className, variant ="default", ...props }, ref) => {
 const variantStyles = {"default":"bg-white text-[#111827] border border-[#EAEAEA] shadow-sm","glass":"glass text-[#111827]","glass-strong":"glass-strong text-[#111827] shadow-md","premium":"bg-gradient-to-br from-[#111827] to-[#1A1A2E] text-white border border-[rgba(255,215,0,0.15)] shadow-[0_4px_20px_rgba(255,215,0,0.05)]",
 }

 return (
 <div
 ref={ref}
 className={cn("rounded-2xl transition-all duration-300",
 variantStyles[variant],
 className
 )}
 {...props}
 />
 )
})
Card.displayName ="Card"
const CardHeader = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
 <div
 ref={ref}
 className={cn("flex flex-col space-y-1.5 p-6", className)}
 {...props}
 />
))
CardHeader.displayName ="CardHeader"
const CardTitle = React.forwardRef<
 HTMLParagraphElement,
 React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
 <h3
 ref={ref}
 className={cn("text-xl font-bold leading-none tracking-tight",
 className
 )}
 {...props}
 />
))
CardTitle.displayName ="CardTitle"
const CardDescription = React.forwardRef<
 HTMLParagraphElement,
 React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
 <p
 ref={ref}
 className={cn("text-sm text-[#6B7280]", className)}
 {...props}
 />
))
CardDescription.displayName ="CardDescription"
const CardContent = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
 <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName ="CardContent"
const CardFooter = React.forwardRef<
 HTMLDivElement,
 React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
 <div
 ref={ref}
 className={cn("flex items-center p-6 pt-0", className)}
 {...props}
 />
))
CardFooter.displayName ="CardFooter"
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
