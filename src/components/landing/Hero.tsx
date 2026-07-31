import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle, Zap, Users, TrendingUp, Brain, Clock, Shield } from 'lucide-react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import DotField from './DotField'

const WORDS = ['Hire', 'Onboard', 'Empower', 'Retain']

const features = [
  {
    icon: Brain,
    title: 'AI Task Builder',
    desc: 'Role-specific plans generated in seconds from any job description.',
    color: '#a855f7',
  },
  {
    icon: Users,
    title: 'Smart Mentor Match',
    desc: 'AI pairs each hire with the right mentor automatically.',
    color: '#22d3ee',
  },
  {
    icon: Clock,
    title: '48-Hour Ramp-up',
    desc: 'New hires hit productivity 6× faster than industry average.',
    color: '#a855f7',
  },
  {
    icon: Shield,
    title: 'Compliance Built-in',
    desc: 'Every step is tracked, documented, and audit-ready.',
    color: '#22d3ee',
  },
]

const metrics = [
  { value: '48h', label: 'avg ramp-up time' },
  { value: '70%', label: 'HR hours saved' },
  { value: '+25%', label: 'retention rate' },
  { value: '500+', label: 'teams onboarded' },
]

function CyclingWord() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIndex(i => (i + 1) % WORDS.length), 2200)
    return () => clearInterval(t)
  }, [])

  return (
    <span
      className="relative inline-flex items-center justify-center"
      style={{ minWidth: '5ch', verticalAlign: 'baseline' }}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={WORDS[index]}
          initial={{ opacity: 0, y: 20, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -20, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
          style={{
            background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            display: 'inline-block',
          }}
        >
          {WORDS[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}



export default function Hero() {
  const featuresRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, margin: '-80px' })

  return (
    <section id="hero" className="relative overflow-hidden bg-background">
      {/* DotField */}
      <div className="absolute inset-0 z-0 pointer-events-auto">
        <DotField
          dotRadius={1.5}
          dotSpacing={14}
          bulgeStrength={67}
          glowRadius={160}
          sparkle={true}
          waveAmplitude={0}
          gradientFrom="rgba(34, 211, 238, 0.30)"
          gradientTo="rgba(168, 85, 247, 0.22)"
          glowColor="#0a0a0f"
        />
      </div>

      {/* Center radial fade so dots don't compete with text */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 80% 70% at 50% 50%, rgba(10,10,15,0.55) 0%, rgba(10,10,15,0.0) 100%)',
        }}
      />

      {/* ══════════════════════════════════════════
          HEADLINE BLOCK
      ══════════════════════════════════════════ */}
      <div className="relative z-10 pt-32 pb-24 lg:pt-44 lg:pb-32 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center">

        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="inline-flex items-center gap-2.5 mb-10"
        >
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full border"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.45)',
              backdropFilter: 'blur(12px)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
            AI-Powered Onboarding OS
          </span>
        </motion.div>

        {/* Headline */}
        <div className="mb-8">
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
          >
            <h1 className="text-[clamp(3rem,8vw,5.75rem)] font-bold leading-[1.08] tracking-[-0.03em]">
              <span className="text-white block">The smarter way to</span>
              <span className="block mt-1" style={{ minHeight: '1.15em' }}>
                <CyclingWord />
                <span className="text-white"> people.</span>
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Sub-copy */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.45 }}
          className="text-[clamp(1rem,2vw,1.2rem)] text-white/40 font-light leading-relaxed max-w-xl mx-auto mb-12"
        >
          From offer letter to fully ramped — Prarambh handles every step
          with AI, so your team can focus on people, not paperwork.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-20"
        >
          <Link to="/login">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-[13px] font-semibold px-7 py-3.5 rounded-full text-white"
              style={{
                background: 'linear-gradient(135deg, #22d3ee 0%, #a855f7 100%)',
                boxShadow: '0 0 0 1px rgba(168,85,247,0.3), 0 20px 60px rgba(168,85,247,0.25)',
              }}
            >
              Start for free <ArrowRight size={14} />
            </motion.button>
          </Link>
          <Link to="/admin">
            <motion.button
              whileHover={{
                scale: 1.03,
                borderColor: 'rgba(255,255,255,0.2)',
                color: 'rgba(255,255,255,0.85)',
              }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 text-[13px] font-semibold px-7 py-3.5 rounded-full border text-white/45 transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                borderColor: 'rgba(255,255,255,0.08)',
                backdropFilter: 'blur(12px)',
              }}
            >
              See it in action
            </motion.button>
          </Link>
        </motion.div>

        {/* Metrics strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {metrics.map((m, i) => (
            <motion.div
              key={m.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85 + i * 0.07 }}
              className="flex flex-col items-center justify-center py-5 px-4 gap-0.5"
              style={{ background: 'rgba(10,10,15,0.6)', backdropFilter: 'blur(16px)' }}
            >
              <span
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {m.value}
              </span>
              <span className="text-[11px] text-white/30 font-medium uppercase tracking-widest">{m.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ══════════════════════════════════════════
          FEATURE CARDS GRID
      ══════════════════════════════════════════ */}
      <div
        ref={featuresRef}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 lg:pb-36"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 32, scale: 0.97 }}
              animate={featuresInView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.65, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, scale: 1.015 }}
              className="group relative rounded-2xl p-6 border border-white/[0.06] overflow-hidden cursor-default transition-all"
              style={{
                background: 'rgba(255,255,255,0.025)',
                backdropFilter: 'blur(24px)',
              }}
            >
              {/* Hover glow */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{
                  background: `radial-gradient(circle at 30% 30%, ${f.color}18, transparent 60%)`,
                }}
              />

              {/* Icon */}
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{
                  background: `${f.color}15`,
                  border: `1px solid ${f.color}25`,
                }}
              >
                <f.icon size={18} style={{ color: f.color }} />
              </div>

              <h3 className="text-[15px] font-semibold text-white mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-white/40 leading-relaxed">{f.desc}</p>

              {/* Subtle border glow on hover */}
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  boxShadow: `inset 0 0 0 1px ${f.color}30`,
                }}
              />
            </motion.div>
          ))}
        </div>

        {/* Bottom social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={featuresInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex items-center justify-center gap-3 mt-10 text-white/25 text-xs font-medium"
        >
          <div className="flex -space-x-2">
            {['#22D3EE', '#06B6D4', '#A855F7', '#9333EA', '#7C3AED'].map((color, i) => (
              <div
                key={i}
                className="w-6 h-6 rounded-full border border-black/50 flex items-center justify-center text-[9px] font-bold text-white"
                style={{ background: color }}
              >
                {['A', 'B', 'C', 'D', 'E'][i]}
              </div>
            ))}
          </div>
          <span>Trusted by 500+ HR teams worldwide</span>
          <CheckCircle size={12} className="text-brand-400" />
        </motion.div>
      </div>

      <style>{`
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </section>
  )
}
