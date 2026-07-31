import * as React from "react"
import { cn } from "../../lib/utils"
import { motion, HTMLMotionProps } from "framer-motion"

export interface ButtonProps extends HTMLMotionProps<"button"> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'default' | 'lg'
  isLoading?: boolean
  children?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', isLoading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: disabled || isLoading ? 1 : 1.02 }}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-colors duration-300 outline-none disabled:pointer-events-none disabled:opacity-50",
          {
            'bg-brand-500 text-white shadow-[0_2px_10px_-3px_rgba(34,211,238,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:bg-brand-400': variant === 'primary',
            'bg-surface-elevated text-text-primary border border-border hover:border-brand-500/30 hover:bg-surface-elevated p-6 shadow-sm': variant === 'secondary',
            'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-elevated': variant === 'ghost',
            'bg-red-500 text-white shadow-sm hover:bg-red-600': variant === 'danger',
            'h-9 px-3': size === 'sm',
            'h-10 px-4 py-2': size === 'default',
            'h-12 px-8 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </motion.button>
    )
  }
)
Button.displayName = "Button"

export { Button }
