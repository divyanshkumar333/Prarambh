import {
  Zap, Bot, Users, BarChart3, FileCheck, Settings2,
  BookOpen, Shield, MessageSquare, Map, CalendarClock
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useRef } from 'react'

const features = [
  { icon: Zap, title: 'Quick Setup', description: 'Configure your entire onboarding system in under 15 minutes with smart defaults.', color: '#22d3ee' },
  { icon: Bot, title: 'AI Assistant', description: '24/7 AI chatbot trained on your policies. Answers, escalates, and learns.', color: '#a855f7' },
  { icon: Map, title: 'Smart Roadmaps', description: 'AI analyzes your docs and generates personalized roadmaps per role.', color: '#22d3ee' },
  { icon: Users, title: 'Buddy Matching', description: 'AI pairs hires with mentors based on role, experience, and availability.', color: '#a855f7' },
  { icon: BarChart3, title: 'Live Analytics', description: 'Real-time dashboards with completion rates, engagement scores, risk alerts.', color: '#22d3ee' },
  { icon: Settings2, title: 'Integration Hub', description: 'Auto-provision Slack, GitHub, Notion and 20+ tools on day one.', color: '#a855f7' },
  { icon: BookOpen, title: 'Knowledge Base', description: 'Searchable policies, FAQs, and guides organized by role with rich media.', color: '#22d3ee' },
  { icon: FileCheck, title: 'Compliance', description: 'Automated tracking of required docs, training, and deadlines with audit trails.', color: '#a855f7' },
  { icon: MessageSquare, title: 'Feedback Loops', description: 'Milestone surveys, sentiment analysis, and improvement recommendations.', color: '#22d3ee' },
  { icon: CalendarClock, title: 'Task Scheduling', description: 'AI schedules tasks in the right order at the right time — zero planning needed.', color: '#a855f7' },
]

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
}

function SectionLabel({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.18em] uppercase px-4 py-2 rounded-full border mb-6"
      style={{
        background: 'rgba(255,255,255,0.03)',
        borderColor: 'rgba(255,255,255,0.08)',
        color: 'rgba(255,255,255,0.4)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
      {text}
    </span>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[clamp(2rem,4.5vw,3.25rem)] font-bold leading-[1.08] tracking-[-0.025em] text-white mb-5">
      {children}
    </h2>
  )
}

function SectionSub({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[15px] text-white/40 leading-relaxed max-w-xl mx-auto font-light">
      {children}
    </p>
  )
}

export default function Features() {
  return (
    <section id="features" className="py-28 lg:py-36 bg-background relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(168,85,247,0.4), rgba(34,211,238,0.4), transparent)' }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <SectionLabel text="Everything You Need" />
          <SectionTitle>
            Every tool your HR team<br />
            <span style={{
              background: 'linear-gradient(135deg, #22d3ee, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              always wanted.
            </span>
          </SectionTitle>
          <SectionSub>
            Eliminate manual work and get new hires contributing faster — without needing a dedicated HR team.
          </SectionSub>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-50px' }}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4"
        >
          {features.map((f) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4, scale: 1.015 }}
              className="group relative rounded-2xl p-6 border border-white/[0.06] overflow-hidden cursor-default transition-all"
              style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)' }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-2xl"
                style={{ background: `radial-gradient(circle at 20% 20%, ${f.color}15, transparent 65%)` }}
              />
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                style={{ background: `${f.color}15`, border: `1px solid ${f.color}25` }}
              >
                <f.icon size={16} style={{ color: f.color }} />
              </div>
              <h3 className="text-[14px] font-semibold text-white mb-1.5">{f.title}</h3>
              <p className="text-[13px] text-white/35 leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Document intelligence spotlight */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-8 rounded-2xl p-8 lg:p-12 border border-white/[0.06] relative overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(168,85,247,0.12) 0%, transparent 70%)' }}
          />
          <div className="relative max-w-2xl">
            <p className="text-[11px] font-bold tracking-[0.18em] uppercase text-brand-400/70 mb-3">Document Intelligence Engine</p>
            <h3 className="text-xl font-bold text-white mb-3">
              Upload once. AI does the rest.
            </h3>
            <p className="text-[14px] text-white/40 leading-relaxed mb-6">
              Upload your company policies — our AI extracts onboarding requirements and generates role-specific task schedules in minutes.
            </p>
            <div className="flex flex-wrap gap-2">
              {['Policy PDFs', 'Employee Handbooks', 'Compliance Docs', 'Role Descriptions', 'Training Materials'].map(tag => (
                <span
                  key={tag}
                  className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-white/[0.08] text-white/40"
                  style={{ background: 'rgba(255,255,255,0.04)' }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
