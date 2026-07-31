import { Building2, FileUp, UserPlus, Rocket } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    number: '01',
    icon: Building2,
    title: 'Set Up Your Company',
    description: 'Complete a 5-step wizard. Add company info, team size, industry, and connect tools. Takes under 15 minutes.',
    tags: ['Company details', 'Industry templates', 'Integrations', 'Role templates'],
    colorFrom: '#22d3ee',
    colorTo: '#06b6d4',
  },
  {
    number: '02',
    icon: FileUp,
    title: 'Upload Your Documents',
    description: "Upload existing HR documents, policies, and handbooks. Our AI Document Intelligence Engine does the rest.",
    tags: ['Policy docs', 'Employee handbook', 'Compliance materials', 'Role descriptions'],
    colorFrom: '#a855f7',
    colorTo: '#9333ea',
  },
  {
    number: '03',
    icon: UserPlus,
    title: 'Add New Hires',
    description: 'Add a hire and AI instantly creates a personalized 30-day roadmap, matches a buddy, and provisions tool access.',
    tags: ['Auto roadmap', 'Smart buddy match', 'Tool provisioning', 'Welcome email'],
    colorFrom: '#22d3ee',
    colorTo: '#a855f7',
  },
  {
    number: '04',
    icon: Rocket,
    title: 'Track & Optimize',
    description: 'Monitor real-time progress, receive AI alerts for at-risk hires, and continuously improve your process.',
    tags: ['Live dashboard', 'Risk alerts', 'Engagement metrics', 'Continuous improvement'],
    colorFrom: '#a855f7',
    colorTo: '#22d3ee',
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 lg:py-36 bg-background relative overflow-hidden">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(34,211,238,0.4), rgba(168,85,247,0.4), transparent)' }}
      />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <span
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full border mb-6"
            style={{
              background: 'rgba(255,255,255,0.03)',
              borderColor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.4)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-brand-secondary" />
            How It Works
          </span>
          <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white mb-5">
            From setup to productive<br />
            <span style={{
              background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              in four steps.
            </span>
          </h2>
          <p className="text-[15px] text-white/40 font-light leading-relaxed max-w-lg mx-auto">
            Every friction point between "first day" and "fully productive" — eliminated automatically.
          </p>
        </motion.div>

        {/* Timeline */}
        <div className="relative">
          {/* Connecting line */}
          <div className="absolute left-8 top-10 bottom-10 w-px hidden lg:block"
            style={{ background: 'linear-gradient(to bottom, rgba(34,211,238,0.3), rgba(168,85,247,0.3), rgba(34,211,238,0.1))' }}
          />

          <div className="space-y-6">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                className="flex gap-6 lg:gap-10 items-start"
              >
                {/* Number + icon column */}
                <div className="flex-shrink-0 flex flex-col items-center gap-2 w-16">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center relative z-10"
                    style={{
                      background: `linear-gradient(135deg, ${step.colorFrom}20, ${step.colorTo}15)`,
                      border: `1px solid ${step.colorFrom}30`,
                    }}
                  >
                    <step.icon size={22} style={{ color: step.colorFrom }} />
                  </div>
                </div>

                {/* Card */}
                <motion.div
                  whileHover={{ y: -3 }}
                  className="flex-1 rounded-2xl p-6 lg:p-8 border border-white/[0.06] group cursor-default transition-all"
                  style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)' }}
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl pointer-events-none"
                    style={{ background: `radial-gradient(circle at 10% 50%, ${step.colorFrom}10, transparent 60%)` }}
                  />

                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className="text-[11px] font-bold tracking-widest"
                      style={{ color: `${step.colorFrom}80` }}
                    >
                      STEP {step.number}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-[13px] text-white/40 leading-relaxed mb-5">{step.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map(tag => (
                      <span
                        key={tag}
                        className="text-[11px] font-medium px-3 py-1.5 rounded-full border"
                        style={{
                          background: `${step.colorFrom}08`,
                          borderColor: `${step.colorFrom}20`,
                          color: `${step.colorFrom}80`,
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
