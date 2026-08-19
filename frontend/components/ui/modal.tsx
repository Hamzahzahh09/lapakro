"use client"
import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
const Modal = DialogPrimitive.Root

const ModalTrigger = DialogPrimitive.Trigger

const ModalPortal = DialogPrimitive.Portal

const ModalOverlay = React.forwardRef<
 React.ElementRef<typeof DialogPrimitive.Overlay>,
 React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
 <DialogPrimitive.Overlay
 ref={ref}
 className={cn("fixed inset-0 z-50 bg-black/60 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
 className
 )}
 {...props}
 />
))
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName

const ModalContent = React.forwardRef<
 React.ElementRef<typeof DialogPrimitive.Content>,
 React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
 <ModalPortal>
 <ModalOverlay />
 <DialogPrimitive.Content
 ref={ref}
 className={cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#EAEAEA] bg-white p-6 shadow-[0_16px_48px_rgba(0,0,0,0.12)] duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-3xl _16px_48px_rgba(0,0,0,0.4)]",
 className
 )}
 {...props}
 >
 {children}
 <DialogPrimitive.Close className="absolute right-5 top-5 rounded-full p-1.5 opacity-70 ring-offset-white transition-opacity hover:opacity-100 hover:bg-[#F5F5F5] focus:outline-none focus:ring-2 focus:ring-[#FFD700] focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-white data-[state=open]:text-[#6B7280] :bg-[#F5F5F5] :ring-[#FFD700] =open]:bg-[#F5F5F5] =open]:text-[#6B7280]">
 <X className="h-4 w-4"/>
 <span className="sr-only">Close</span>
 </DialogPrimitive.Close>
 </DialogPrimitive.Content>
 </ModalPortal>
))
ModalContent.displayName = DialogPrimitive.Content.displayName

const ModalHeader = ({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
 <div
 className={cn("flex flex-col space-y-1.5 text-center sm:text-left",
 className
 )}
 {...props}
 />
)
ModalHeader.displayName ="ModalHeader"
const ModalFooter = ({
 className,
 ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
 <div
 className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
 className
 )}
 {...props}
 />
)
ModalFooter.displayName ="ModalFooter"
const ModalTitle = React.forwardRef<
 React.ElementRef<typeof DialogPrimitive.Title>,
 React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
 <DialogPrimitive.Title
 ref={ref}
 className={cn("text-xl font-bold leading-none tracking-tight text-[#111827]",
 className
 )}
 {...props}
 />
))
ModalTitle.displayName = DialogPrimitive.Title.displayName

const ModalDescription = React.forwardRef<
 React.ElementRef<typeof DialogPrimitive.Description>,
 React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
 <DialogPrimitive.Description
 ref={ref}
 className={cn("text-sm text-[#6B7280]", className)}
 {...props}
 />
))
ModalDescription.displayName = DialogPrimitive.Description.displayName

export {
 Modal,
 ModalPortal,
 ModalOverlay,
 ModalTrigger,
 ModalContent,
 ModalHeader,
 ModalFooter,
 ModalTitle,
 ModalDescription,
}
