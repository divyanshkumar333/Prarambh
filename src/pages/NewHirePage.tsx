import { useState, useEffect } from 'react'
import { useParams, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, CheckSquare, Calendar, MessageSquare,
  Users, Settings, ChevronLeft, ChevronRight
} from 'lucide-react'
import Navbar from '../components/common/Navbar'
import NewHireDashboard from '../components/dashboard/NewHireDashboard'
import ChatTab, { useChatUnread } from '../components/chat/ChatTab'
import Logo from '../components/common/Logo'
import PrarambhBotWidget from '../components/chat/PrarambhBotWidget'
import { useApp } from '../context/AppContext'

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: 'Overview',   id: 'dashboard' },
  { icon: <CheckSquare size={20} />,     label: 'My Tasks',   id: 'tasks'     },
  { icon: <Calendar size={20} />,        label: 'Meets',      id: 'resources' },
  { icon: <MessageSquare size={20} />,   label: 'Chat',       id: 'chat'      },
  { icon: <Users size={20} />,           label: 'My Buddy',   id: 'buddy'     },
  { icon: <Settings size={20} />,        label: 'Settings',   id: 'settings'  },
]

// ── Nav with unread badge ─────────────────────────────────────────────────────
function NewHireNav({
  collapsed,
  active,
  setActive,
}: {
  collapsed: boolean
  active: string
  setActive: (id: string) => void
}) {
  const unread = useChatUnread()
  return (
    <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
      {navItems.map(item => (
        <button
          key={item.id}
          onClick={() => setActive(item.id)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
            active === item.id
              ? 'bg-brand-500/10 text-brand-400'
              : 'text-text-secondary hover:bg-surface-elevated hover:text-text-primary'
          }`}
        >
          {/* Icon with notification dot */}
          <span className="relative flex-shrink-0">
            {item.icon}
            {item.id === 'chat' && unread > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center leading-none shadow-sm">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </span>

          {/* Label + pill badge */}
          {!collapsed && (
            <span className="font-medium text-sm flex items-center gap-1.5 flex-1">
              {item.label}
              {item.id === 'chat' && unread > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none shadow-sm">
                  {unread > 9 ? '9+' : unread}
                </span>
              )}
            </span>
          )}
        </button>
      ))}
    </nav>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function NewHirePage() {
  const { employeeId }                       = useParams<{ employeeId: string }>()
  const { state, dispatch }                  = useApp()
  const [collapsed,      setCollapsed]       = useState(false)
  const [active,         setActive]          = useState('dashboard')
  // When set, ChatTab will auto-open a conversation with this user id
  const [chatWithUserId, setChatWithUserId]  = useState<string | undefined>()

  // Restore role from URL on every mount/reload — survives page refresh
  useEffect(() => {
    if (employeeId) {
      dispatch({ type: 'SET_ROLE', payload: { role: 'employee', userId: employeeId } })
    }
  }, [employeeId, dispatch])

  // Guard: redirect to login if the UUID isn't a known employee
  const validEmployee = state.employees.find(e => e.id === employeeId)
  if (!validEmployee) return <Navigate to="/login" replace />

  const handleMessageMentor = (mentorId: string) => {
    setChatWithUserId(mentorId)
    setActive('chat')
  }

  return (
    <div className="flex min-h-screen bg-background text-text-primary">

      {/* Sidebar */}
      <aside
        className="flex-shrink-0 flex flex-col border-r border-border bg-surface transition-all duration-300"
        style={{ width: collapsed ? 64 : 240 }}
      >
        {/* Logo + Collapse toggle in header */}
        <div className="h-16 flex items-center justify-between px-3 border-b border-border">
          {collapsed ? <Logo size="sm" variant="icon" /> : <Logo size="sm" />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-text-secondary hover:bg-surface-elevated hover:text-text-primary transition-colors flex-shrink-0"
          >
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Nav */}
        <NewHireNav collapsed={collapsed} active={active} setActive={setActive} />
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        <Navbar variant="app" title="Employee Portal" />
        <main className="flex-1 overflow-hidden">
          {active === 'chat' ? (
            <ChatTab openWithUserId={chatWithUserId} />
          ) : (
            <div className="overflow-y-auto h-full">
              <NewHireDashboard
                activeSection={active}
                onMessageMentor={handleMessageMentor}
              />
            </div>
          )}
        </main>
      </div>
      <PrarambhBotWidget />
    </div>
  )
}
