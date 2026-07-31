import { Orbit } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  variant?: 'full' | 'icon'
  className?: string
}

export default function Logo({ size = 'md', variant = 'full', className = '' }: LogoProps) {
  const sizes = { sm: 32, md: 44, lg: 56 }
  const iconSize = sizes[size]
  const pSize = { sm: 'text-lg', md: 'text-2xl', lg: 'text-3xl' }

  // A CSS-based logo resembling the "P" with an orbit
  const icon = (
    <div
      className="relative flex items-center justify-center font-black italic bg-clip-text text-transparent bg-gradient-to-br from-[#A855F7] to-[#3B82F6]"
      style={{ width: iconSize, height: iconSize }}
    >
      <span className={`${pSize[size]} leading-none`}>P</span>
      <Orbit className="absolute text-[#22D3EE] opacity-80" size={iconSize * 1.2} />
    </div>
  )

  if (variant === 'icon') {
    return (
      <Link to="/" className={`inline-block ${className} hover:opacity-80 transition-opacity`}>
        {icon}
      </Link>
    )
  }

  const textSizes = { sm: 'text-lg', md: 'text-xl', lg: 'text-2xl' }

  return (
    <Link to="/" className={`flex items-center gap-2 hover:opacity-80 transition-opacity ${className}`}>
      {icon}
      <span className={`font-bold text-text-primary tracking-wide ${textSizes[size]}`}>
        Prarambh
      </span>
    </Link>
  )
}
