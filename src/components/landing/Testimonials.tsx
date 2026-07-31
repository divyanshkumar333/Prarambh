import { Star } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    quote: "We went from spending 3 full days onboarding each engineer to having them contributing PRs on day 2. Prarambh is genuinely magic for a 12-person startup.",
    name: "Sarah Chen",
    role: "CTO",
    company: "BuildFast Labs",
    initials: "SC",
    color: "#22d3ee",
  },
  {
    quote: "The AI assistant replaced 80% of the 'dumb questions' clogging our Slack. New hires feel supported, and the team stays focused.",
    name: "Marcus Johnson",
    role: "Head of People",
    company: "Velocity Health",
    initials: "MJ",
    color: "#a855f7",
  },
  {
    quote: "Setting up took 11 minutes. We connected Slack, GitHub, and Notion, and it auto-generated a perfect dev onboarding flow. I was blown away.",
    name: "Priya Sharma",
    role: "Founder & CEO",
    company: "DataSprint",
    initials: "PS",
    color: "#22d3ee",
  },
  {
    quote: "Our 90-day retention jumped from 71% to 89% in the first quarter. The buddy matching feature alone is worth the price.",
    name: "Tom Ramirez",
    role: "VP Operations",
    company: "ScaleForce",
    initials: "TR",
    color: "#a855f7",
  },
  {
    quote: "I uploaded our 80-page employee handbook and it turned it into 45 actionable onboarding tasks in 3 minutes. Absolutely incredible.",
    name: "Aisha Williams",
    role: "HR Manager",
    company: "NexGen Fintech",
    initials: "AW",
    color: "#22d3ee",
  },
  {
    quote: "We're a 7-person team with no HR department. Prarambh lets us onboard like a company 10× our size. Couldn't imagine doing it without it.",
    name: "David Park",
    role: "CEO",
    company: "Clarity AI",
    initials: "DP",
    color: "#a855f7",
  },
]

export default function Testimonials() {
  const [active, setActive] = useState(0)

  return (
    <section id="testimonials" className="py-28 lg:py-36 bg-background relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), rgba(34,211,238,0.4), transparent)' }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full border mb-6"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <Star size={11} className="fill-brand-400 text-brand-400" />
            Customer Stories
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white mb-5">
            Loved by 500+<br />
            <span style={{
              background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              startup teams.
            </span>
          </h2>
          <p className="text-[15px] text-white/40 font-light leading-relaxed max-w-md mx-auto">
            From solo founders to 50-person teams — every one onboarding faster.
          </p>
        </motion.div>

        {/* Featured quote */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.99 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative rounded-2xl p-8 lg:p-12 mb-6 border border-white/[0.07] overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(24px)' }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: `radial-gradient(ellipse 50% 60% at 80% 20%, ${testimonials[active].color}12, transparent 70%)`,
              }}
            />

            {/* Stars */}
            <div className="flex gap-1 mb-6 relative z-10">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} size={14} className="fill-brand-400 text-brand-400" />
              ))}
            </div>

            <blockquote
              className="text-xl lg:text-2xl font-light text-white/80 leading-relaxed mb-8 relative z-10"
              style={{ maxWidth: '680px' }}
            >
              "{testimonials[active].quote}"
            </blockquote>

            <div className="flex items-center gap-4 relative z-10">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm"
                style={{ background: `linear-gradient(135deg, ${testimonials[active].color}, ${testimonials[active].color}80)` }}
              >
                {testimonials[active].initials}
              </div>
              <div>
                <p className="text-[14px] font-semibold text-white">{testimonials[active].name}</p>
                <p className="text-[12px] text-white/35">{testimonials[active].role} · {testimonials[active].company}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Grid of cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-12">
          {testimonials.map((t, i) => (
            <motion.button
              key={t.name}
              onClick={() => setActive(i)}
              whileHover={{ y: -3 }}
              className={`text-left p-5 rounded-2xl border transition-all duration-300 ${
                active === i
                  ? 'border-brand-500/40'
                  : 'border-white/[0.05] hover:border-white/[0.1]'
              }`}
              style={{
                background: active === i ? 'rgba(168,85,247,0.07)' : 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex gap-0.5 mb-3">
                {Array(5).fill(0).map((_, j) => (
                  <Star key={j} size={11} className="fill-brand-400 text-brand-400" />
                ))}
              </div>
              <p className="text-[12px] text-white/40 leading-relaxed mb-4 line-clamp-3">"{t.quote}"</p>
              <div className="flex items-center gap-2.5">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.color}, ${t.color}80)` }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="text-[12px] font-semibold text-white/70">{t.name}</p>
                  <p className="text-[11px] text-white/30">{t.role} · {t.company}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-2xl overflow-hidden border border-white/[0.06]"
          style={{ background: 'rgba(255,255,255,0.04)' }}
        >
          {[
            { value: '500+', label: 'Startup Customers' },
            { value: '12k+', label: 'Hires Onboarded' },
            { value: '4.9', label: 'Average Rating' },
            { value: '<5%', label: 'Monthly Churn' },
          ].map((s, i) => (
            <div
              key={s.label}
              className="flex flex-col items-center justify-center py-6 px-4 gap-1"
              style={{ background: 'rgba(10,10,15,0.7)', backdropFilter: 'blur(16px)' }}
            >
              <span
                className="text-2xl sm:text-3xl font-bold"
                style={{
                  background: i % 2 === 0
                    ? 'linear-gradient(135deg, #22d3ee, #06b6d4)'
                    : 'linear-gradient(135deg, #a855f7, #9333ea)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                {s.value}
              </span>
              <span className="text-[11px] text-white/30 font-medium uppercase tracking-widest text-center">{s.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
