import { Link } from 'react-router-dom'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon'
  className?: string
}

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizes = { sm: 32, md: 44, lg: 56 }
  const iconSize = sizes[size]
  
  // Custom SVG Icon based on the design brief
  const icon = (
    <div
      className="relative flex items-center justify-center shrink-0"
      style={{ width: iconSize, height: iconSize }}
    >
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FDE047" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#B48608" />
          </linearGradient>
          <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22D3EE" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>

        {/* Orbit Ring */}
        <circle 
          cx="32" 
          cy="32" 
          r="26" 
          stroke="url(#orbitGradient)" 
          strokeWidth="1.5" 
          strokeDasharray="130 30" 
          strokeLinecap="round" 
          opacity="0.8" 
          transform="rotate(-45 32 32)" 
        />
        
        {/* AI Nodes */}
        <circle cx="13.6" cy="13.6" r="3.5" fill="#22D3EE" className="animate-pulse" /> {/* Top Left */}
        <circle cx="50.4" cy="50.4" r="3.5" fill="#A855F7" className="animate-pulse" style={{ animationDelay: '1s' }} /> {/* Bottom Right */}

        {/* The P Symbol - Clean geometric path */}
        <path 
          d="M 28 18 C 28 18 40 18 44 24 C 48 30 46 38 38 40 C 32 41.5 28 40 28 40 L 28 54 L 24 50 L 24 14 L 28 18 Z M 28 22 L 28 36 C 34 36 39 34 39 29 C 39 24 34 22 28 22 Z" 
          fill="url(#goldGradient)" 
        />
        
        {/* Top Star/Flame representing Prarambh (New Beginning) */}
        <path d="M 26 8 L 27.5 11 L 31 12 L 27.5 13 L 26 16 L 24.5 13 L 21 12 L 24.5 11 Z" fill="#22D3EE" />
      </svg>
    </div>
  )

  if (variant === 'icon') {
    return (
      <Link to="/" className={`inline-block ${className} hover:scale-105 transition-transform`}>
        {icon}
      </Link>
    )
  }

  const textSizes = { sm: 'text-xl', md: 'text-2xl', lg: 'text-3xl' }

  return (
    <Link to="/" className={`flex items-center gap-3 hover:opacity-90 transition-opacity ${className}`}>
      {icon}
      <span 
        className={`font-serif font-medium tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-[#D4AF37] ${textSizes[size]}`}
      >
        Prarambh
      </span>
    </Link>
  )
}
