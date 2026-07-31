import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, FileText,
  BarChart3, Settings, ChevronLeft, ChevronRight, GraduationCap, MessageSquare
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import AdminPanel from '../components/dashboard/AdminPanel'
import ChatTab, { useChatUnread } from '../components/chat/ChatTab'
import ProfileModal from '../components/modals/ProfileModal'
import Logo from '../components/common/Logo'
import PrarambhBotWidget from '../components/chat/PrarambhBotWidget'
import { useApp, USER_UUIDS } from '../context/AppContext'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'

const NAV_ITEMS = [
  { icon: <LayoutDashboard size={20} />, label: 'Overview',  id: 'overview'  },
  { icon: <Users size={20} />,           label: 'Employees', id: 'employees' },
  { icon: <FileText size={20} />,        label: 'Documents', id: 'docs'      },
  { icon: <GraduationCap size={20} />,   label: 'Mentors',   id: 'mentors'   },
  { icon: <BarChart3 size={20} />,       label: 'Analytics', id: 'analytics' },
  { icon: <MessageSquare size={20} />,   label: 'Chat',      id: 'chat'      },
  { icon: <Settings size={20} />,        label: 'Settings',  id: 'settings'  },
]

function AdminNav({ collapsed, active, setActive }: { collapsed: boolean; active: string; setActive: (id: string) => void }) {
  const unread = useChatUnread()
  return (
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {NAV_ITEMS.map(item => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={cn(
            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-300 ease-apple outline-none",
            active === item.id
              ? "bg-brand-500/10 text-brand-400 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] border border-brand-500/20"
              : "text-text-secondary hover:bg-card hover:text-text-primary hover:scale-[1.02] active:scale-[0.98]"
          )}
        >
          <span className="relative flex-shrink-0">
            {item.icon}
            {item.id === 'chat' && unread > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </span>
          {!collapsed && (
            <span className="font-semibold text-sm flex items-center gap-1.5 flex-1 tracking-tight">
              {item.label}
              {item.id === 'chat' && unread > 0 && (
                <Badge variant="danger" className="ml-auto px-1.5 py-0.5 text-[10px]">
                  {unread > 9 ? '9+' : unread}
                </Badge>
              )}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}

export default function AdminPage() {
  const { adminId }                   = useParams<{ adminId: string }>()
  const { dispatch }                  = useApp()
  const [collapsed,   setCollapsed]   = useState(false)
  const [active,      setActive]      = useState('overview')
  const [showProfile, setShowProfile] = useState(false)

  useEffect(() => {
    if (adminId) {
      dispatch({ type: 'SET_ROLE', payload: { role: 'admin', userId: adminId } })
    }
  }, [adminId, dispatch])

  if (adminId !== USER_UUIDS.ADMIN) return <Navigate to="/login" replace />

  return (
    <div className="flex min-h-screen bg-background text-text-primary">
      <aside
        className={cn(
          "flex-shrink-0 flex flex-col border-r border-border bg-surface transition-all duration-300 ease-apple relative z-20",
          collapsed ? "w-20" : "w-64"
        )}
      >
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          {collapsed ? <Logo size="sm" variant="icon" /> : <Logo size="sm" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-card hover:text-text-primary transition-colors flex-shrink-0 outline-none"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>
        <AdminNav collapsed={collapsed} active={active} setActive={setActive} />
      </aside>

      <div className="flex-1 min-w-0 flex flex-col relative z-10">
        <Navbar variant="app" title="Admin Portal" onProfileClick={() => setShowProfile(true)} />
        <main className="flex-1 overflow-hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full overflow-y-auto"
            >
              {active === 'chat'
                ? <ChatTab />
                : <AdminPanel activeSection={active} />
              }
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
      <PrarambhBotWidget />
    </div>
  )
}
