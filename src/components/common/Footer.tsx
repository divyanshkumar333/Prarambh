import { useState } from 'react'
import Logo from './Logo'
import { Twitter, Linkedin, Github, Mail, X, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Footer() {
  const currentYear = new Date().getFullYear()
  const [showDialog, setShowDialog] = useState(false)
  const [clickedItem, setClickedItem] = useState('')

  const handleLinkClick = (item: string) => {
    setClickedItem(item)
    setShowDialog(true)
  }

  const links = {
    Product: ['Features', 'Pricing', 'Integrations', 'Changelog', 'Roadmap'],
    Company: ['About Us', 'Blog', 'Careers', 'Press Kit', 'Contact'],
    Resources: ['Documentation', 'Help Center', 'Community', 'Webinars', 'Templates'],
    Legal: ['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'GDPR', 'Security'],
  }

  const socials = [
    { icon: <Twitter size={16} />, label: 'Twitter' },
    { icon: <Linkedin size={16} />, label: 'LinkedIn' },
    { icon: <Github size={16} />, label: 'GitHub' },
    { icon: <Mail size={16} />, label: 'Email' },
  ]

  return (
    <footer className="bg-background relative overflow-hidden">
      {/* Top separator */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.35), rgba(34,211,238,0.35), transparent)' }}
      />

      {/* Coming Soon Dialog */}
      {showDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" onClick={() => setShowDialog(false)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl p-8 max-w-sm w-full text-center border border-white/[0.08]"
            style={{ background: 'rgba(18,18,22,0.95)', backdropFilter: 'blur(24px)' }}
            onClick={e => e.stopPropagation()}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-5"
              style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}
            >
              <Clock size={20} className="text-brand-400" />
            </div>
            <h3 className="text-[15px] font-semibold text-white mb-2">{clickedItem}</h3>
            <p className="text-[13px] text-white/40 leading-relaxed mb-6">
              This section is still being built out. Check back soon!
            </p>
            <button
              onClick={() => setShowDialog(false)}
              className="w-full text-[13px] font-semibold py-3 rounded-full text-white transition-all"
              style={{ background: 'linear-gradient(135deg, #22d3ee, #a855f7)' }}
            >
              Got it
            </button>
            <button
              onClick={() => setShowDialog(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white/60 transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 mb-14">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Logo size="md" className="mb-5" />
            <p className="text-[13px] text-white/30 leading-relaxed mb-6 max-w-xs">
              AI-powered onboarding OS for growing teams. Get new hires productive in 48 hours.
            </p>
            <div className="flex gap-2">
              {socials.map((s) => (
                <button
                  key={s.label}
                  onClick={() => handleLinkClick(s.label)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-white/30 border border-white/[0.07] hover:text-white/70 hover:border-white/20 transition-all"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  {s.icon}
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([category, items]) => (
            <div key={category}>
              <h4 className="text-[11px] font-bold tracking-widest uppercase text-white/25 mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {items.map(item => (
                  <li key={item}>
                    <button
                      onClick={() => handleLinkClick(item)}
                      className="text-[13px] text-white/35 hover:text-white/70 transition-colors text-left"
                    >
                      {item}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/[0.05]"
        >
          <p className="text-[12px] text-white/20">
            © {currentYear} Prarambh. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-[12px] text-white/20">
            <span>Built for teams that move fast</span>
            <span>·</span>
            <span>SOC 2 · GDPR · CCPA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
