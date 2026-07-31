import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, UserCheck, User, ArrowRight, ChevronLeft } from 'lucide-react'
import Logo from '../components/common/Logo'
import { useApp, initialMentors, USER_UUIDS } from '../context/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

type RoleStep = 'pick-role' | 'pick-mentor' | 'pick-employee'

const ROLE_CARDS = [
  {
    role: 'admin' as const,
    title: 'Admin',
    description: 'Manage employees, assign mentors, upload documents, and configure the platform.',
    icon: Shield,
    color: '#22d3ee',
    gradient: 'linear-gradient(135deg, #22d3ee20, #22d3ee08)',
    border: 'rgba(34,211,238,0.2)',
  },
  {
    role: 'hr' as const,
    title: 'HR Manager',
    description: 'View all employees, assign tasks, and generate onboarding plans from documents with AI.',
    icon: Users,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f720, #a855f708)',
    border: 'rgba(168,85,247,0.2)',
  },
  {
    role: 'mentor' as const,
    title: 'Mentor / Buddy',
    description: 'Track assigned mentees, view their resumes, and create AI-personalized task lists.',
    icon: UserCheck,
    color: '#22d3ee',
    gradient: 'linear-gradient(135deg, #22d3ee20, #a855f710)',
    border: 'rgba(34,211,238,0.15)',
  },
  {
    role: 'employee' as const,
    title: 'New Hire',
    description: 'View onboarding tasks, track your progress, chat with AI, and complete your journey.',
    icon: User,
    color: '#a855f7',
    gradient: 'linear-gradient(135deg, #a855f720, #22d3ee10)',
    border: 'rgba(168,85,247,0.15)',
  },
]

const card = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: (i: number) => ({
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const }
  }),
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { state, dispatch } = useApp()
  const [step, setStep] = useState<RoleStep>('pick-role')
  const [selectedRole, setSelectedRole] = useState<typeof ROLE_CARDS[0] | null>(null)

  const handleRoleClick = (c: typeof ROLE_CARDS[0]) => {
    if (c.role === 'mentor') { setSelectedRole(c); setStep('pick-mentor') }
    else if (c.role === 'employee') { setSelectedRole(c); setStep('pick-employee') }
    else if (c.role === 'admin') {
      dispatch({ type: 'SET_ROLE', payload: { role: 'admin', userId: USER_UUIDS.ADMIN } })
      navigate(`/admin/${USER_UUIDS.ADMIN}`)
    } else if (c.role === 'hr') {
      dispatch({ type: 'SET_ROLE', payload: { role: 'hr', userId: USER_UUIDS.HR } })
      navigate(`/hr/${USER_UUIDS.HR}`)
    }
  }

  const handleMentorSelect = (id: string) => {
    dispatch({ type: 'SET_ROLE', payload: { role: 'mentor', userId: id } })
    navigate(`/mentor/${id}`)
  }

  const handleEmployeeSelect = (id: string) => {
    dispatch({ type: 'SET_ROLE', payload: { role: 'employee', userId: id } })
    navigate(`/new-hire/${id}`)
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-background overflow-hidden">

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dot grid */}
        <div className="absolute inset-0 opacity-[0.35]"
          style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)', backgroundSize: '28px 28px' }}
        />
        {/* Glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.12) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        <div className="absolute top-2/3 left-1/4 w-[300px] h-[300px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(34,211,238,0.08) 0%, transparent 70%)', filter: 'blur(40px)' }}
        />
        {/* Top & bottom fades */}
        <div className="absolute inset-x-0 top-0 h-32" style={{ background: 'linear-gradient(to bottom, #0a0a0f, transparent)' }} />
        <div className="absolute inset-x-0 bottom-0 h-32" style={{ background: 'linear-gradient(to top, #0a0a0f, transparent)' }} />
      </div>

      {/* Back button */}
      <motion.button
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 z-10 flex items-center gap-1.5 text-[13px] font-medium text-white/35 hover:text-white/70 transition-colors"
      >
        <ChevronLeft size={15} />
        Back
      </motion.button>

      {/* Content */}
      <div className="relative z-10 w-full flex flex-col items-center">

        {/* Logo + tagline */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-12 text-center"
        >
          <Logo size="lg" />
          <p className="text-[12px] font-semibold tracking-widest uppercase text-white/25 mt-3">
            Onboarding OS · Simulation Environment
          </p>
        </motion.div>

        {/* ── STEP: Pick Role ── */}
        <AnimatePresence mode="wait">
          {step === 'pick-role' && (
            <motion.div
              key="pick-role"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-3xl"
            >
              <div className="text-center mb-10">
                <h2 className="text-2xl font-bold text-white mb-2">Choose your perspective</h2>
                <p className="text-[13px] text-white/35">Select a role to explore the platform</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {ROLE_CARDS.map((c, i) => (
                  <motion.button
                    key={c.role}
                    custom={i}
                    variants={card}
                    initial="hidden"
                    animate="show"
                    whileHover={{ y: -4, scale: 1.015 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleRoleClick(c)}
                    className="group text-left p-6 rounded-2xl border transition-all duration-300 cursor-pointer"
                    style={{
                      background: c.gradient,
                      borderColor: c.border,
                      backdropFilter: 'blur(16px)',
                    }}
                  >
                    {/* Icon */}
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                      style={{
                        background: `${c.color}15`,
                        border: `1px solid ${c.color}30`,
                      }}
                    >
                      <c.icon size={20} style={{ color: c.color }} />
                    </div>

                    <h3 className="text-[15px] font-semibold text-white mb-2">{c.title}</h3>
                    <p className="text-[13px] text-white/40 leading-relaxed mb-5">{c.description}</p>

                    <div className="flex items-center gap-1.5 text-[12px] font-semibold transition-all" style={{ color: c.color }}>
                      Enter as {c.title}
                      <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
                    </div>

                    {/* Hover glow */}
                    <div
                      className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{ boxShadow: `inset 0 0 0 1px ${c.color}35` }}
                    />
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── STEP: Pick Mentor ── */}
          {step === 'pick-mentor' && (
            <motion.div
              key="pick-mentor"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md"
            >
              <button
                onClick={() => setStep('pick-role')}
                className="flex items-center gap-1.5 text-[13px] text-white/35 hover:text-white/70 transition-colors mb-8"
              >
                <ChevronLeft size={15} /> Back to roles
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)' }}>
                  <UserCheck size={20} className="text-brand-400" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1.5">Select Mentor Profile</h2>
                <p className="text-[13px] text-white/35">Choose which mentor you're logging in as</p>
              </div>

              <div className="space-y-3">
                {initialMentors.map((mentor, i) => {
                  const assignedCount = state.employees.filter(e => e.mentorId === mentor.id).length
                  return (
                    <motion.button
                      key={mentor.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ x: 4 }}
                      onClick={() => handleMentorSelect(mentor.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] text-left transition-all group cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)' }}
                    >
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: mentor.color }}>
                        {mentor.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-white group-hover:text-brand-400 transition-colors">{mentor.name}</p>
                        <p className="text-[12px] text-white/40">{mentor.specialty}</p>
                        <p className="text-[11px] text-brand-400/70 font-medium mt-0.5">{assignedCount} mentee{assignedCount !== 1 ? 's' : ''} assigned</p>
                      </div>
                      <ArrowRight size={15} className="text-white/20 group-hover:text-brand-400 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* ── STEP: Pick Employee ── */}
          {step === 'pick-employee' && (
            <motion.div
              key="pick-employee"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.35 }}
              className="w-full max-w-md"
            >
              <button
                onClick={() => setStep('pick-role')}
                className="flex items-center gap-1.5 text-[13px] text-white/35 hover:text-white/70 transition-colors mb-8"
              >
                <ChevronLeft size={15} /> Back to roles
              </button>

              <div className="text-center mb-8">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(168,85,247,0.1)', border: '1px solid rgba(168,85,247,0.2)' }}>
                  <User size={20} className="text-brand-500" />
                </div>
                <h2 className="text-xl font-bold text-white mb-1.5">Select Employee Profile</h2>
                <p className="text-[13px] text-white/35">Choose which new hire you're logging in as</p>
              </div>

              <div className="space-y-3">
                {state.employees.map((emp, i) => {
                  const mentor = initialMentors.find(m => m.id === emp.mentorId)
                  const myTasks = state.tasks.filter(t => t.assignedTo === emp.id)
                  const done = myTasks.filter(t => t.status === 'done').length
                  const pct = myTasks.length ? Math.round((done / myTasks.length) * 100) : 0
                  return (
                    <motion.button
                      key={emp.id}
                      initial={{ opacity: 0, x: 16 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ x: 4 }}
                      onClick={() => handleEmployeeSelect(emp.id)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl border border-white/[0.07] text-left transition-all group cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.025)', backdropFilter: 'blur(16px)' }}
                    >
                      <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                        style={{ background: emp.color }}>
                        {emp.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[14px] font-semibold text-white group-hover:text-brand-500 transition-colors">{emp.name}</p>
                        <p className="text-[12px] text-white/40">{emp.role}</p>
                        <div className="flex items-center gap-2 mt-1.5">
                          {/* Progress bar */}
                          <div className="flex-1 max-w-[80px] h-1 rounded-full bg-white/10 overflow-hidden">
                            <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #22d3ee, #a855f7)' }} />
                          </div>
                          <span className="text-[11px] text-white/30">{done}/{myTasks.length} tasks</span>
                          {mentor && <span className="text-[11px] text-white/20 truncate">· {mentor.name}</span>}
                        </div>
                      </div>
                      <ArrowRight size={15} className="text-white/20 group-hover:text-brand-500 group-hover:translate-x-1 transition-all flex-shrink-0" />
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-14 text-[11px] text-white/20 font-medium tracking-widest uppercase text-center"
        >
          Explore All Perspectives
        </motion.p>
      </div>
    </div>
  )
}
