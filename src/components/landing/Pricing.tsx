import { CheckCircle, Zap, ArrowRight } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

const plans = [
  {
    name: 'Starter',
    price: { monthly: 19, annual: 15 },
    description: 'For early-stage startups just getting started with structured onboarding.',
    badge: null,
    features: [
      'Up to 10 employees',
      'Basic templates & workflows',
      '3 core integrations',
      'AI assistant (basic)',
      'Email support',
      'Compliance tracking',
    ],
    highlighted: false,
    accentColor: '#22d3ee',
  },
  {
    name: 'Growth',
    price: { monthly: 49, annual: 39 },
    description: 'For scaling startups that need advanced AI features and full integration coverage.',
    badge: 'Most Popular',
    features: [
      'Up to 50 employees',
      'Advanced AI features',
      'All integrations (20+)',
      'Document Intelligence Engine',
      'Smart buddy matching',
      'Custom branding',
      'Priority support',
      'Advanced analytics',
    ],
    highlighted: true,
    accentColor: '#a855f7',
  },
  {
    name: 'Scale',
    price: { monthly: 99, annual: 79 },
    description: 'For established teams that need unlimited scale and a dedicated success manager.',
    badge: null,
    features: [
      'Unlimited employees',
      'All Growth features',
      'Dedicated success manager',
      'Custom integrations',
      'White-label options',
      'Advanced reporting',
      'SLA guarantee',
      'Onboarding workshops',
    ],
    highlighted: false,
    accentColor: '#22d3ee',
  },
]

export default function Pricing() {
  const [annual, setAnnual] = useState(false)

  return (
    <section id="pricing" className="py-28 lg:py-36 bg-background relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), rgba(168,85,247,0.4), transparent)' }}
      />

      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 80%, rgba(168,85,247,0.06) 0%, transparent 70%)' }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full border mb-6"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <Zap size={11} style={{ color: '#22d3ee' }} />
            Simple Pricing
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white mb-5">
            Start free,<br />
            <span style={{
              background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              grow with confidence.
            </span>
          </h2>
          <p className="text-[15px] text-white/40 font-light mb-8">
            No hidden fees. Cancel anytime. 14-day free trial on all plans.
          </p>

          {/* Billing toggle */}
          <div
            className="inline-flex items-center gap-1 p-1 rounded-full border border-white/[0.07]"
            style={{ background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(12px)' }}
          >
            {['Monthly', 'Annual'].map((label) => (
              <button
                key={label}
                onClick={() => setAnnual(label === 'Annual')}
                className="relative px-5 py-2 text-[13px] font-semibold rounded-full transition-all duration-300"
                style={{
                  color: (label === 'Annual') === annual ? 'white' : 'rgba(255,255,255,0.35)',
                }}
              >
                {(label === 'Annual') === annual && (
                  <motion.div
                    layoutId="pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'linear-gradient(135deg, #22d3ee22, #a855f722)', border: '1px solid rgba(168,85,247,0.3)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 35 }}
                  />
                )}
                <span className="relative z-10">{label}</span>
                {label === 'Annual' && (
                  <span className="relative z-10 ml-1.5 text-[10px] font-bold text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded-full">
                    −20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
              className={`relative rounded-2xl overflow-hidden border transition-all duration-300 ${
                plan.highlighted ? 'scale-[1.03]' : 'hover:scale-[1.01]'
              }`}
              style={{
                background: plan.highlighted
                  ? 'rgba(168,85,247,0.08)'
                  : 'rgba(255,255,255,0.025)',
                borderColor: plan.highlighted
                  ? 'rgba(168,85,247,0.35)'
                  : 'rgba(255,255,255,0.06)',
                backdropFilter: 'blur(20px)',
                boxShadow: plan.highlighted ? '0 0 60px rgba(168,85,247,0.15)' : 'none',
              }}
            >
              {/* Top glow for highlighted */}
              {plan.highlighted && (
                <div
                  className="absolute inset-x-0 top-0 h-px"
                  style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.8), rgba(34,211,238,0.6), transparent)' }}
                />
              )}

              {plan.badge && (
                <div className="absolute top-0 right-6">
                  <span
                    className="inline-block text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-b-xl text-white"
                    style={{ background: 'linear-gradient(135deg, #a855f7, #7c3aed)' }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className={`p-7 ${plan.badge ? 'pt-10' : ''}`}>
                <h3 className="text-[13px] font-bold tracking-widest uppercase text-white/40 mb-4">{plan.name}</h3>

                {/* Price */}
                <div className="mb-2">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={annual ? 'annual' : 'monthly'}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.25 }}
                      className="text-4xl font-bold text-white"
                    >
                      ${annual ? plan.price.annual : plan.price.monthly}
                    </motion.span>
                  </AnimatePresence>
                  <span className="text-[13px] text-white/30 ml-1">/mo</span>
                </div>
                {annual && (
                  <p className="text-[11px] text-brand-400/70 mb-4">
                    Save ${(plan.price.monthly - plan.price.annual) * 12}/year
                  </p>
                )}

                <p className="text-[13px] text-white/35 leading-relaxed mb-6">{plan.description}</p>

                <Link to="/login">
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="w-full flex items-center justify-center gap-2 text-[13px] font-semibold py-3 rounded-full mb-7 transition-all"
                    style={plan.highlighted ? {
                      background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
                      color: 'white',
                      boxShadow: '0 8px 32px rgba(168,85,247,0.3)',
                    } : {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    Start Free Trial
                    <ArrowRight size={13} />
                  </motion.div>
                </Link>

                <ul className="space-y-2.5">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2.5">
                      <CheckCircle size={13} className="flex-shrink-0 mt-0.5" style={{ color: plan.accentColor }} />
                      <span className="text-[13px] text-white/50">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Enterprise row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="rounded-2xl p-6 lg:p-8 border border-white/[0.06] flex flex-col lg:flex-row items-center justify-between gap-6"
          style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)' }}
        >
          <div>
            <h3 className="text-[15px] font-semibold text-white mb-1.5">Enterprise</h3>
            <p className="text-[13px] text-white/35 max-w-lg leading-relaxed">
              Need volume discounts, custom features, on-premise deployment, or white-label options? Let's talk.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="text-[13px] font-semibold px-6 py-3 rounded-full border border-white/[0.1] text-white/50 transition-all"
              style={{ background: 'rgba(255,255,255,0.03)' }}
            >
              Request Demo
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              className="inline-flex items-center gap-2 text-[13px] font-semibold px-6 py-3 rounded-full text-white"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
                boxShadow: '0 8px 24px rgba(168,85,247,0.25)',
              }}
            >
              Contact Sales <ArrowRight size={13} />
            </motion.button>
          </div>
        </motion.div>

        {/* Trust badges */}
        <div className="mt-8 flex flex-wrap gap-5 justify-center">
          {['SOC 2 Type II', 'GDPR Compliant', 'CCPA Ready', '99.9% Uptime SLA', 'SSO & MFA'].map(badge => (
            <span key={badge} className="flex items-center gap-1.5 text-[12px] text-white/25 font-medium">
              <CheckCircle size={12} className="text-brand-secondary" />
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
