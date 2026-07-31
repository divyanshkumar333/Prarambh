import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
  hideCloseBtn?: boolean
}

export function Modal({ isOpen, onClose, title, children, className, hideCloseBtn }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", bounce: 0.3, duration: 0.5 }}
            className={cn(
              "relative z-50 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-pds-elevated",
              className
            )}
          >
            {(title || !hideCloseBtn) && (
              <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
                {title && <h2 className="text-lg font-bold text-text-primary tracking-tight">{title}</h2>}
                {!hideCloseBtn && (
                  <button
                    onClick={onClose}
                    className="ml-auto rounded-full p-2 text-text-secondary transition-colors hover:bg-bg-bg-card border border-border rounded-2xl p-6 shadow-pds transition-all duration-300 ease-apple border border-border rounded-2xl p-6 shadow-pds transition-all duration-300 ease-apple hover:text-text-primary"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
