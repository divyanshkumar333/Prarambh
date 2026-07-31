import { useState } from 'react'
import {
  CheckCircle, Clock, Users, Calendar, Flame, Bell,
  MessageSquare, ChevronDown, ChevronUp,
  Trophy, ExternalLink, AlertCircle,
  Settings as SettingsIcon, Bot, Video, FileText, Link2,
  FlaskConical
} from 'lucide-react'
import { useApp, initialMentors } from '../../context/AppContext'
import type { Task, Document } from '../../context/AppContext'
import NewHireChatWidget from '../chat/NewHireChatWidget'
import PDFViewerModal from '../modals/PDFViewerModal'
import CodePlaygroundModal from '../modals/CodePlaygroundModal'
import MailPlaygroundModal from '../modals/MailPlaygroundModal'

interface Props {
  activeSection: string
  onMessageMentor: (mentorId: string) => void
}

// ── Shared helpers ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: Task['status'] }) {
  if (status === 'done')        return <span className="badge-green text-xs py-0.5 px-2">Done</span>
  if (status === 'in-progress') return <span className="badge-orange text-xs py-0.5 px-2">In Progress</span>
  return <span className="text-xs text-text-secondary/70 font-medium bg-surface-elevated px-2 py-0.5 rounded-full border border-border">Pending</span>
}

function PriorityDot({ priority }: { priority?: string }) {
  if (priority === 'high')   return <span className="w-2 h-2 rounded-full bg-red-500 flex-shrink-0" title="High priority" />
  if (priority === 'medium') return <span className="w-2 h-2 rounded-full bg-orange-400 flex-shrink-0" title="Medium priority" />
  return <span className="w-2 h-2 rounded-full bg-green-400 flex-shrink-0" title="Low priority" />
}

function assignedByLabel(by: string, name: string) {
  if (by === 'mentor') return `🤝 ${name}`
  if (by === 'hr')     return `👔 ${name}`
  return `🔑 ${name}`
}

// ── Inline Task Accordion ─────────────────────────────────────────────────────
// Renders full task details below the row when expanded.

function TaskAccordion({ task, onToggleStatus, onViewDoc, onOpenPlayground }: {
  task: Task
  onToggleStatus: (taskId: string, currentStatus: string) => void
  onViewDoc: (doc: Document) => void
  onOpenPlayground: (task: Task) => void
}) {
  const { state, dispatch } = useApp()
  const [expanded, setExpanded] = useState(false)

  const doneSubs  = (task.subtasks ?? []).filter(s => s.status === 'done').length
  const totalSubs = (task.subtasks ?? []).length

  const toggleSubtask = (subtaskId: string, current: string) => {
    dispatch({ type: 'UPDATE_SUBTASK_STATUS', payload: {
      taskId: task.id, subtaskId, status: current === 'done' ? 'pending' : 'done'
    }})
  }

  // Resolve supporting documents from context
  const supportingDocs: Document[] = (task.supportingDocs ?? [])
    .map(id => state.documents.find(d => d.id === id))
    .filter(Boolean) as Document[]

  const statusBtn = () => {
    if (task.status === 'done')        return { label: '↩ Mark as Pending',    cls: 'bg-surface-elevated/50 text-text-primary hover:bg-surface-elevated' }
    if (task.status === 'in-progress') return { label: '✓ Mark as Done',        cls: 'bg-green-600 text-white hover:bg-green-700' }
    return                                    { label: '▶ Start Task',           cls: 'bg-brand-500 text-white hover:bg-brand-600' }
  }
  const btn = statusBtn()

  return (
    <div className={`rounded-xl border transition-all duration-200 overflow-hidden ${
      task.status === 'done'        ? 'border-emerald-500/20 bg-emerald-500/10/30' :
      task.status === 'in-progress' ? 'border-teal-300 bg-brand-500/10/30 shadow-sm' :
      'border-border hover:border-border'
    }`}>
      {/* ── Row header (always visible, click to toggle) ── */}
      <div
        onClick={() => setExpanded(v => !v)}
        className="flex items-start gap-3 p-4 cursor-pointer group"
      >
        {/* Status circle */}
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
          task.status === 'done'        ? 'bg-green-500 border-green-500' :
          task.status === 'in-progress' ? 'border-teal-500' :
          'border-border group-hover:border-brown-400'
        }`}>
          {task.status === 'done'        && <CheckCircle size={11} className="text-white" />}
          {task.status === 'in-progress' && <div className="w-2 h-2 bg-teal-500 rounded-full" />}
        </div>

        {/* Title + meta */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className={`text-sm font-semibold leading-snug ${task.status === 'done' ? 'line-through text-text-secondary/70' : 'text-text-primary'}`}>
              {task.title}
            </p>
            <StatusBadge status={task.status} />
          </div>
          {/* Description preview when collapsed */}
          {!expanded && task.description && (
            <p className="text-xs text-text-secondary/70 mt-1 line-clamp-1">{task.description}</p>
          )}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <PriorityDot priority={task.priority} />
            <span className="badge-brown text-xs">{task.category}</span>
            <span className="flex items-center gap-1 text-xs text-text-secondary/70"><Clock size={10} />{task.estimatedTime}</span>
            <span className="text-xs text-text-secondary/70">{assignedByLabel(task.assignedBy, task.assignedByName)}</span>
            {totalSubs > 0 && (
              <span className="text-xs text-text-secondary/70">{doneSubs}/{totalSubs} subtasks</span>
            )}
            {task.requiresInput && (
              <span className="text-xs text-amber-400 flex items-center gap-0.5"><AlertCircle size={10} />Input needed</span>
            )}
          </div>
          {/* Subtask mini progress bar */}
          {totalSubs > 0 && (
            <div className="mt-1.5 h-1 bg-surface-elevated/50 rounded-full overflow-hidden">
              <div className="h-full bg-teal-500 rounded-full transition-all" style={{ width: `${(doneSubs / totalSubs) * 100}%` }} />
            </div>
          )}
        </div>

        {/* Expand chevron */}
        <div className="flex-shrink-0 text-text-secondary/70 group-hover:text-text-secondary transition-colors mt-0.5">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {/* ── Expanded detail panel ── */}
      {expanded && (
        <div className="border-t border-border px-4 pb-4 pt-3 space-y-4 bg-surface/60">

          {/* Description */}
          {task.description && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Description</p>
              <p className="text-sm text-text-primary leading-relaxed bg-surface-elevated rounded-xl p-3 border border-border">{task.description}</p>
            </div>
          )}

          {/* Subtasks */}
          {totalSubs > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">
                Subtasks ({doneSubs}/{totalSubs})
              </p>
              <div className="space-y-1.5">
                {task.subtasks!.map(sub => (
                  <button
                    key={sub.id}
                    onClick={e => { e.stopPropagation(); toggleSubtask(sub.id, sub.status) }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-border hover:bg-surface-elevated transition-colors text-left"
                  >
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${sub.status === 'done' ? 'bg-green-500 border-green-500' : 'border-border'}`}>
                      {sub.status === 'done' && <CheckCircle size={9} className="text-white" />}
                    </div>
                    <span className={`text-sm ${sub.status === 'done' ? 'line-through text-text-secondary/70' : 'text-text-primary'}`}>{sub.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Supporting documents */}
          {supportingDocs.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Supporting Documents</p>
              <div className="space-y-1.5">
                {supportingDocs.map(doc => (
                  <button
                    key={doc.id}
                    onClick={e => { e.stopPropagation(); onViewDoc(doc) }}
                    className="w-full flex items-center gap-2.5 p-2.5 rounded-xl border border-border hover:border-border hover:bg-surface-elevated transition-colors text-left group/doc"
                  >
                    <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-100 flex items-center justify-center flex-shrink-0">
                      <FileText size={13} className="text-red-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{doc.name}</p>
                      <p className="text-xs text-text-secondary/70">{doc.type} · {doc.size}</p>
                    </div>
                    <span className="text-xs text-brand-400 font-semibold group-hover/doc:underline flex-shrink-0">View →</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Supporting links */}
          {(task.supportingLinks ?? []).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-2">Resources & Links</p>
              <div className="space-y-1.5">
                {task.supportingLinks!.map((l, i) => (
                  <a
                    key={i}
                    href={l.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="flex items-start gap-2.5 p-2.5 rounded-xl border border-blue-100 bg-blue-500/10/40 hover:bg-blue-500/10 transition-colors group/link"
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-100 border border-blue-500/20 flex items-center justify-center flex-shrink-0">
                      <Link2 size={13} className="text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-blue-400 truncate group-hover/link:underline">{l.label}</p>
                      <p className="text-xs text-blue-500 truncate">{l.url}</p>
                    </div>
                    <ExternalLink size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Required input */}
          {task.requiresInput && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Required Input</p>
              {task.inputPrompt && <p className="text-xs text-text-secondary mb-2 italic">{task.inputPrompt}</p>}
              <textarea
                className="w-full border border-border rounded-xl p-3 text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brown-300 resize-none bg-surface-elevated"
                rows={3}
                placeholder="Type your response here…"
                defaultValue={task.inputValue ?? ''}
                onClick={e => e.stopPropagation()}
              />
            </div>
          )}

          {/* Feedback visible to employee */}
          {(task.feedback ?? []).filter(fb => fb.visibility.includes('employee')).length > 0 && (
            <div>
              <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-1.5">Feedback</p>
              <div className="space-y-2">
                {task.feedback!.filter(fb => fb.visibility.includes('employee')).map(fb => (
                  <div key={fb.id} className="bg-emerald-500/10 border border-green-100 rounded-xl px-3 py-2.5">
                    <div className="flex items-center gap-2 mb-1">
                      <MessageSquare size={10} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-xs font-semibold text-emerald-400">{fb.addedBy}</span>
                      <span className="text-xs text-text-secondary/70 ml-auto">
                        {new Date(fb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <p className="text-xs text-text-primary">{fb.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Playground mode — open sandbox when enabled by mentor */}
          {task.playgroundEnabled && (() => {
            const typeLabels: Record<string, { label: string; icon: string; desc: string }> = {
              'engineering':       { label: 'Engineering',        icon: '💻', desc: 'Code editor sandbox — practice freely without affecting real progress.' },
              'marketing':         { label: 'Marketing',          icon: '📣', desc: 'Marketing sandbox — practice freely without affecting real progress.' },
              'leadership':        { label: 'Leadership',         icon: '👑', desc: 'Leadership sandbox — practice freely without affecting real progress.' },
              'sales':             { label: 'Sales',              icon: '💰', desc: 'Sales sandbox — practice freely without affecting real progress.' },
              'hr-operations':     { label: 'HR & Operations',    icon: '👥', desc: 'HR sandbox — practice freely without affecting real progress.' },
              'product-strategy':  { label: 'Product & Strategy', icon: '🧭', desc: 'Product sandbox — practice freely without affecting real progress.' },
            }
            const pType = task.playgroundType ?? 'engineering'
            const meta  = typeLabels[pType] ?? typeLabels['engineering']
            const canOpen = pType === 'engineering' || pType === 'sales'

            return (
              <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-brand-500/20 rounded-xl p-3.5 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/20 border border-brand-500/20 flex items-center justify-center flex-shrink-0 text-base">
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-bold text-brand-400">Playground Active</p>
                    <span className="text-[10px] font-bold bg-brand-500 text-white px-2 py-0.5 rounded-full">
                      {meta.label}
                    </span>
                  </div>
                  <p className="text-xs text-brand-400 mt-0.5">{meta.desc}</p>
                </div>
                <button
                  onClick={e => { e.stopPropagation(); if (canOpen) onOpenPlayground(task) }}
                  className={`flex items-center gap-1.5 text-xs font-bold text-white px-3 py-1.5 rounded-lg transition-colors flex-shrink-0 ${
                    canOpen
                      ? 'bg-brand-500 hover:bg-brand-600'
                      : 'bg-teal-300 cursor-not-allowed'
                  }`}
                  title={canOpen ? `Open ${meta.label} playground` : 'Coming soon'}
                >
                  <FlaskConical size={12} /> Open
                </button>
              </div>
            )
          })()}

          {/* Status action button */}
          <button
            onClick={e => { e.stopPropagation(); onToggleStatus(task.id, task.status) }}
            className={`w-full py-2.5 rounded-xl text-sm font-semibold transition-colors ${btn.cls}`}
          >
            {btn.label}
          </button>
        </div>
      )}

    </div>
  )
}

// ── Meetings mini-card (used in Overview right column) ────────────────────────

function MeetingsMiniCard({ employeeId }: { employeeId: string }) {
  const { state } = useApp()
  const today    = new Date().toISOString().split('T')[0]
  const meetings = state.meetings
    .filter(m => m.employeeId === employeeId && m.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 3)

  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr + 'T00:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Tomorrow'
    return `In ${diff}d`
  }

  return (
    <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
      <h3 className="font-bold text-text-primary mb-3 text-sm flex items-center gap-2">
        <Video size={14} className="text-brand-400" /> Upcoming Meets
      </h3>
      {meetings.length === 0 ? (
        <div className="text-center py-4 text-text-secondary/70">
          <Calendar size={24} className="mx-auto mb-1.5 opacity-30" />
          <p className="text-xs">No meetings scheduled</p>
        </div>
      ) : (
        <div className="space-y-2">
          {meetings.map(meet => (
            <div key={meet.id} className="flex items-start gap-2.5 p-2.5 rounded-xl border border-brand-500/20 bg-brand-500/10/40">
              <div className="flex-shrink-0 text-center bg-brand-500/20 rounded-lg px-1.5 py-1 min-w-[38px]">
                <p className="text-[9px] font-bold text-brand-400 uppercase leading-none">
                  {new Date(meet.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                </p>
                <p className="text-base font-black text-brand-400 leading-tight">
                  {new Date(meet.date + 'T00:00:00').getDate()}
                </p>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{meet.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-xs text-text-secondary/70">{meet.time}</span>
                  <span className="text-xs font-semibold text-brand-400">· {getDaysUntil(meet.date)}</span>
                </div>
                {meet.link && (
                  <a href={meet.link} target="_blank" rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs text-brand-400 hover:text-brand-400 font-medium">
                    <Video size={10} /> Join
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Overview Section ──────────────────────────────────────────────────────────

function OverviewSection({ employee, myTasks, mentor, onMessageMentor }: {
  employee: any
  myTasks: Task[]
  mentor: any
  onMessageMentor: (id: string) => void
}) {
  const doneCount = myTasks.filter(t => t.status === 'done').length
  const progress  = myTasks.length > 0 ? Math.round((doneCount / myTasks.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-brown-600 to-brown-800 rounded-2xl p-6 text-white relative overflow-hidden">
        <div className="absolute right-4 top-4 opacity-10"><Trophy size={80} /></div>
        <div className="relative">
          <div className="flex items-start justify-between flex-wrap gap-4">
            <div>
              <p className="text-white/70 text-sm mb-1">Day {employee.day} of {employee.totalDays} · {employee.role}</p>
              <h2 className="text-2xl font-bold">Welcome, {employee.name.split(' ')[0]}! 👋</h2>
              <p className="text-white/80 text-sm mt-2">
                {doneCount > 0
                  ? `You've completed ${doneCount} of ${myTasks.length} tasks. Keep it up!`
                  : myTasks.length > 0
                  ? `You have ${myTasks.length} tasks assigned. Let's get started!`
                  : 'Your prarambh tasks will appear here once assigned.'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs mb-1">Progress</p>
              <p className="text-3xl font-black">{progress}%</p>
              <div className="w-32 h-2 bg-surface/20 rounded-full mt-2">
                <div className="h-full bg-surface rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <CheckCircle size={20} />, label: 'Completed',  value: `${doneCount}/${myTasks.length}`,                              color: 'text-emerald-400 bg-emerald-500/10'  },
          { icon: <Flame size={20} />,       label: 'Day Streak', value: `${employee.day} 🔥`,                                           color: 'text-orange-600 bg-orange-50' },
          { icon: <Clock size={20} />,       label: 'Pending',    value: myTasks.filter(t => t.status === 'pending').length,              color: 'text-blue-400 bg-blue-500/10'    },
          { icon: <Bell size={20} />,        label: 'From Mentor', value: myTasks.filter(t => t.assignedBy === 'mentor').length,          color: 'text-brand-400 bg-brand-500/10'   },
        ].map(s => (
          <div key={s.label} className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-sm text-text-secondary font-medium">{s.label}</p>
              <p className="font-bold text-text-primary text-lg leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Center column: task list + AI widget (same layout as Admin) */}
        <div className="lg:col-span-2 space-y-5">
        <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-text-primary text-base flex items-center gap-2">
              <CheckCircle size={16} className="text-brand-400" /> My Tasks Overview
            </h3>
            <span className="text-xs text-text-secondary/70">{doneCount}/{myTasks.length} done</span>
          </div>
          {myTasks.length === 0 ? (
            <div className="text-center py-8 text-text-secondary/70">
              <CheckCircle size={32} className="mx-auto mb-2 opacity-30" />
              <p className="text-sm">No tasks assigned yet — check back soon</p>
            </div>
          ) : (
            <div className="space-y-2">
              {myTasks.slice(0, 8).map(task => (
                <div key={task.id} className={`flex items-center gap-3 p-2.5 rounded-xl border ${
                  task.status === 'done'        ? 'border-emerald-500/20 bg-emerald-500/10/40' :
                  task.status === 'in-progress' ? 'border-brand-500/20 bg-brand-500/10/40' :
                  'border-border bg-surface-elevated/20'
                }`}>
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    task.status === 'done'        ? 'bg-green-500 border-green-500' :
                    task.status === 'in-progress' ? 'border-teal-500' :
                    'border-border'
                  }`}>
                    {task.status === 'done' && <CheckCircle size={9} className="text-white" />}
                    {task.status === 'in-progress' && <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />}
                  </div>
                  <span className={`text-sm flex-1 truncate ${task.status === 'done' ? 'line-through text-text-secondary/70' : 'text-text-primary font-medium'}`}>
                    {task.title}
                  </span>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs text-text-secondary/70">{task.estimatedTime}</span>
                    <PriorityDot priority={task.priority} />
                  </div>
                </div>
              ))}
              {myTasks.length > 8 && (
                <p className="text-xs text-text-secondary/70 text-center pt-1">+{myTasks.length - 8} more — visit My Tasks tab</p>
              )}
            </div>
          )}
        </div>

        {/* AI Assistance — inside center column, below task list (mirrors Admin layout) */}
        <NewHireChatWidget
          employeeName={employee.name}
          tasksDone={doneCount}
          tasksTotal={myTasks.length}
          mentorName={mentor?.name ?? 'your mentor'}
          role={employee.role}
          day={employee.day}
        />
        </div>{/* end center col-span-2 */}

        {/* Right column */}
        <div className="space-y-5">
          {/* Mentor bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm */}
          {mentor && (
            <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
              <h3 className="font-bold text-text-primary mb-3 text-sm">Your Mentor / Buddy</h3>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: mentor.color }}>{mentor.initials}</div>
                <div>
                  <p className="font-semibold text-text-primary text-sm">{mentor.name}</p>
                  <p className="text-xs text-text-secondary">{mentor.specialty}</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                    <span className="text-xs text-emerald-400">Available</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Upcoming meets — above Tasks by Source */}
          <MeetingsMiniCard employeeId={employee.id} />

          {/* Tasks by source */}
          <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-text-primary mb-3 text-sm">Tasks by Source</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Admin',  count: myTasks.filter(t => t.assignedBy === 'admin').length,  color: 'bg-brown-500',  icon: '🔑' },
                { label: 'HR',     count: myTasks.filter(t => t.assignedBy === 'hr').length,     color: 'bg-purple-500', icon: '👔' },
                { label: 'Mentor', count: myTasks.filter(t => t.assignedBy === 'mentor').length, color: 'bg-teal-500',   icon: '🤝' },
              ].map(item => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <span className="text-base">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between text-xs text-text-secondary mb-1 font-medium">
                      <span>{item.label}</span>
                      <span>{item.count}</span>
                    </div>
                    <div className="progress-bar">
                      <div className={`h-full ${item.color} rounded-full`} style={{ width: `${myTasks.length > 0 ? (item.count / myTasks.length) * 100 : 0}%` }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── My Tasks Section ──────────────────────────────────────────────────────────

function TasksSection({ myTasks }: { myTasks: Task[] }) {
  const { dispatch } = useApp()
  const [activeTab,      setActiveTab]      = useState<'all' | 'pending' | 'in-progress' | 'done'>('all')
  const [viewingDoc,     setViewingDoc]     = useState<Document | null>(null)
  const [playgroundTask, setPlaygroundTask] = useState<Task | null>(null)

  const toggleTaskStatus = (taskId: string, currentStatus: string) => {
    const next = currentStatus === 'done' ? 'pending' : currentStatus === 'pending' ? 'in-progress' : 'done'
    dispatch({ type: 'UPDATE_TASK_STATUS', payload: { id: taskId, status: next as Task['status'] } })
  }

  const displayed = myTasks.filter(t => {
    if (activeTab === 'all')           return true
    if (activeTab === 'done')          return t.status === 'done'
    if (activeTab === 'in-progress')   return t.status === 'in-progress'
    return t.status === 'pending'
  })

  const counts = {
    all:           myTasks.length,
    pending:       myTasks.filter(t => t.status === 'pending').length,
    'in-progress': myTasks.filter(t => t.status === 'in-progress').length,
    done:          myTasks.filter(t => t.status === 'done').length,
  }

  return (
    <div className="space-y-5">
      <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text-primary text-lg">My Prarambh Tasks</h3>
          <div className="flex gap-1 bg-surface-elevated rounded-lg p-1 border border-border">
            {(['all', 'pending', 'in-progress', 'done'] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-all duration-200 ${activeTab === tab ? 'bg-brown-500 text-white' : 'text-text-secondary hover:bg-surface-elevated/50'}`}>
                {tab === 'in-progress' ? 'Active' : tab} ({counts[tab]})
              </button>
            ))}
          </div>
        </div>

        {displayed.length === 0 ? (
          <div className="text-center py-12 text-text-secondary/70">
            <CheckCircle size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No tasks in this category</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {displayed.map(task => (
              <TaskAccordion
                key={task.id}
                task={task}
                onToggleStatus={toggleTaskStatus}
                onViewDoc={setViewingDoc}
                onOpenPlayground={setPlaygroundTask}
              />
            ))}
          </div>
        )}
        <p className="text-xs text-text-secondary/70 mt-4 text-center">Click any task to expand details and update progress</p>
      </div>

      {/* PDF/Doc viewer triggered from task supporting docs */}
      {viewingDoc && <PDFViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}

      {/* Code Playground — Engineering type */}
      {playgroundTask && (playgroundTask.playgroundType ?? 'engineering') === 'engineering' && (
        <CodePlaygroundModal
          task={playgroundTask}
          onClose={() => setPlaygroundTask(null)}
          onMarkDone={() => {
            toggleTaskStatus(playgroundTask.id, playgroundTask.status)
            setPlaygroundTask(null)
          }}
        />
      )}

      {/* Mail Playground — Sales type */}
      {playgroundTask && playgroundTask.playgroundType === 'sales' && (
        <MailPlaygroundModal
          task={playgroundTask}
          onClose={() => setPlaygroundTask(null)}
          onMarkDone={() => {
            toggleTaskStatus(playgroundTask.id, playgroundTask.status)
            setPlaygroundTask(null)
          }}
        />
      )}
    </div>
  )
}

// ── Upcoming Meets Section (full page) ────────────────────────────────────────

function MeetsSection({ employeeId, mentor }: { employeeId: string; mentor: any }) {
  const { state } = useApp()
  const today    = new Date().toISOString().split('T')[0]
  const meetings = state.meetings
    .filter(m => m.employeeId === employeeId)
    .sort((a, b) => a.date.localeCompare(b.date))

  const upcoming = meetings.filter(m => m.date >= today)
  const past     = meetings.filter(m => m.date < today)

  const formatDate = (dateStr: string, time: string) => {
    const d = new Date(dateStr + 'T00:00:00')
    return `${d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} · ${time}`
  }

  const getDaysUntil = (dateStr: string) => {
    const diff = Math.ceil((new Date(dateStr + 'T00:00:00').getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Tomorrow'
    if (diff < 0)  return `${Math.abs(diff)}d ago`
    return `In ${diff} days`
  }

  return (
    <div className="space-y-6">
      <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-text-primary text-lg flex items-center gap-2">
            <Video size={18} className="text-brand-400" /> Upcoming Meets
          </h3>
          {mentor && (
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold" style={{ background: mentor.color }}>{mentor.initials}</div>
              Scheduled by {mentor.name.split(' ')[0]}
            </div>
          )}
        </div>

        {upcoming.length === 0 && past.length === 0 ? (
          <div className="text-center py-12 text-text-secondary/70">
            <Calendar size={36} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm font-medium">No meetings scheduled yet</p>
            <p className="text-xs mt-1">Your mentor will schedule meetings from their portal</p>
          </div>
        ) : (
          <>
            {upcoming.length > 0 && (
              <div className="space-y-3 mb-5">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Upcoming</p>
                {upcoming.map(meet => (
                  <div key={meet.id} className="flex items-start gap-4 p-4 rounded-xl border border-brand-500/20 bg-brand-500/10/40 hover:bg-brand-500/10 transition-colors">
                    <div className="flex-shrink-0 bg-brand-500/20 rounded-xl p-2.5 text-center min-w-[52px]">
                      <p className="text-xs font-bold text-brand-400 uppercase">
                        {new Date(meet.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short' })}
                      </p>
                      <p className="text-xl font-black text-brand-400 leading-none">{new Date(meet.date + 'T00:00:00').getDate()}</p>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="font-semibold text-text-primary text-sm">{meet.title}</p>
                        <span className="text-xs font-semibold text-brand-400 bg-brand-500/20 px-2 py-0.5 rounded-full flex-shrink-0">{getDaysUntil(meet.date)}</span>
                      </div>
                      <p className="text-xs text-text-secondary mt-0.5 flex items-center gap-1"><Clock size={10} />{formatDate(meet.date, meet.time)}</p>
                      {meet.description && <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{meet.description}</p>}
                      {meet.link && (
                        <a href={meet.link} target="_blank" rel="noreferrer"
                          className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-brand-400 hover:text-brand-400 bg-surface border border-brand-500/20 px-2.5 py-1.5 rounded-lg hover:shadow-sm transition-all">
                          <Video size={12} /> Join Meeting
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {past.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide">Past</p>
                {past.map(meet => (
                  <div key={meet.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-surface-elevated/30 opacity-70">
                    <div className="w-8 h-8 rounded-lg bg-surface-elevated flex items-center justify-center flex-shrink-0">
                      <Calendar size={14} className="text-text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary truncate">{meet.title}</p>
                      <p className="text-xs text-text-secondary/70">{formatDate(meet.date, meet.time)} · {getDaysUntil(meet.date)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

// ── Buddy Section (no message button, full page) ─────────────────────────────

function BuddySection({ myTasks, mentor }: {
  myTasks: Task[]
  mentor: any
}) {
  if (!mentor) return (
    <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm text-center py-12 text-text-secondary/70">
      <Users size={36} className="mx-auto mb-3 opacity-30" />
      <p className="text-sm font-medium">No mentor assigned yet</p>
      <p className="text-xs mt-1">Contact HR to get a mentor assigned</p>
    </div>
  )

  const mentorTasks  = myTasks.filter(t => t.assignedBy === 'mentor')
  const doneMentor   = mentorTasks.filter(t => t.status === 'done').length
  const activeMentor = mentorTasks.filter(t => t.status === 'in-progress').length

  return (
    <div className="space-y-6">
      {/* Hero bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm */}
      <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-md"
            style={{ background: mentor.color }}>
            {mentor.initials}
          </div>
          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="font-bold text-text-primary text-xl">{mentor.name}</h2>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                <span className="text-xs text-emerald-400 font-semibold">Available</span>
              </div>
            </div>
            <p className="text-text-secondary mt-0.5">{mentor.specialty}</p>
            <p className="text-sm text-text-secondary/70">{mentor.department} Department</p>
          </div>
          {/* Hint */}
          <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl px-4 py-2.5 text-xs text-brand-400 font-medium flex-shrink-0">
            💬 Use the <strong>Chat</strong> tab to message your mentor
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Tasks Assigned', value: mentorTasks.length,                 color: 'bg-surface-elevated text-text-primary',   icon: <Bell size={20} /> },
          { label: 'Completed',      value: doneMentor,                          color: 'bg-emerald-500/10 text-emerald-400',   icon: <CheckCircle size={20} /> },
          { label: 'In Progress',    value: activeMentor,                        color: 'bg-brand-500/10 text-brand-400',     icon: <Clock size={20} /> },
          { label: 'Pending',        value: mentorTasks.filter(t => t.status === 'pending').length, color: 'bg-orange-50 text-orange-700', icon: <AlertCircle size={20} /> },
        ].map(s => (
          <div key={s.label} className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
            <div>
              <p className="text-sm text-text-secondary font-medium">{s.label}</p>
              <p className="font-bold text-text-primary text-2xl leading-tight">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Mentor tasks list */}
      {mentorTasks.length > 0 && (
        <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <Users size={16} className="text-brand-400" /> Tasks from Your Mentor
          </h3>
          <div className="space-y-2">
            {mentorTasks.map(task => (
              <div key={task.id} className={`flex items-center gap-3 p-3 rounded-xl border ${
                task.status === 'done'        ? 'border-emerald-500/20 bg-emerald-500/10/40' :
                task.status === 'in-progress' ? 'border-brand-500/20 bg-brand-500/10/40' :
                'border-border'
              }`}>
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  task.status === 'done'        ? 'bg-green-500 border-green-500' :
                  task.status === 'in-progress' ? 'border-teal-500' : 'border-border'
                }`}>
                  {task.status === 'done' && <CheckCircle size={9} className="text-white" />}
                  {task.status === 'in-progress' && <div className="w-1.5 h-1.5 bg-teal-500 rounded-full" />}
                </div>
                <span className={`text-sm flex-1 truncate ${task.status === 'done' ? 'line-through text-text-secondary/70' : 'text-text-primary font-medium'}`}>
                  {task.title}
                </span>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="badge-brown text-xs">{task.category}</span>
                  <span className="text-xs text-text-secondary/70">{task.estimatedTime}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── Settings Section (full page, task-based progress) ────────────────────────

function SettingsSection({ employee, myTasks }: { employee: any; myTasks: Task[] }) {
  const total       = myTasks.length
  const done        = myTasks.filter(t => t.status === 'done').length
  const inProgress  = myTasks.filter(t => t.status === 'in-progress').length
  const pending     = myTasks.filter(t => t.status === 'pending').length
  const taskProgress = total > 0 ? Math.round((done / total) * 100) : 0

  // Per-category breakdown
  const categories = [...new Set(myTasks.map(t => t.category))]
  const byCategory = categories.map(cat => {
    const catTasks = myTasks.filter(t => t.category === cat)
    const catDone  = catTasks.filter(t => t.status === 'done').length
    return { cat, total: catTasks.length, done: catDone, pct: Math.round((catDone / catTasks.length) * 100) }
  })

  return (
    <div className="space-y-6">
      {/* Profile hero */}
      <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-text-primary mb-5 flex items-center gap-2">
          <SettingsIcon size={18} className="text-text-secondary" /> Profile & Settings
        </h3>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-3xl flex-shrink-0 shadow-md"
            style={{ background: employee.color }}>
            {employee.initials}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-text-primary text-xl">{employee.name}</h2>
            <p className="text-text-secondary">{employee.role} · {employee.team}</p>
            <p className="text-sm text-text-secondary/70 mt-0.5">{employee.email}</p>
          </div>
        </div>
      </div>

      {/* Profile details grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Start Date', value: employee.startDate,                        color: 'text-blue-400' },
          { label: 'Day',        value: `${employee.day} / ${employee.totalDays}`, color: 'text-brand-400' },
          { label: 'Team',       value: employee.team,                             color: 'text-purple-700' },
          { label: 'Status',     value: employee.status === 'prarambh' ? 'Prarambh 🟡' : 'Completed ✅', color: 'text-emerald-400' },
        ].map(s => (
          <div key={s.label} className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm">
            <p className={`text-xs font-semibold uppercase tracking-wide mb-1 ${s.color}`}>{s.label}</p>
            <p className="font-bold text-text-primary text-base">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Task-based progress */}
      <div className="bg-surface-elevated border border-border rounded-2xl p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-text-primary flex items-center gap-2">
            <CheckCircle size={16} className="text-brand-400" /> Task Progress
          </h3>
          <span className="text-2xl font-black text-text-primary">{taskProgress}%</span>
        </div>

        {/* Main bar */}
        <div>
          <div className="h-4 bg-surface-elevated/50 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-teal-700 rounded-full transition-all duration-700"
              style={{ width: `${taskProgress}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary/70 mt-1.5">{done} of {total} tasks completed · {pending} pending · {inProgress} in progress</p>
        </div>

        {/* Status breakdown */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Done',        count: done,       color: 'bg-green-500',  bg: 'bg-emerald-500/10  border-emerald-500/20'  },
            { label: 'In Progress', count: inProgress, color: 'bg-teal-500',   bg: 'bg-brand-500/10   border-brand-500/20'   },
            { label: 'Pending',     count: pending,    color: 'bg-orange-400', bg: 'bg-orange-50 border-orange-200' },
          ].map(s => (
            <div key={s.label} className={`rounded-xl border p-3 ${s.bg}`}>
              <p className="text-xs font-semibold text-text-secondary mb-1">{s.label}</p>
              <p className="text-2xl font-black text-text-primary">{s.count}</p>
              <div className="mt-2 h-1.5 bg-surface/60 rounded-full overflow-hidden">
                <div className={`h-full ${s.color} rounded-full`} style={{ width: `${total > 0 ? (s.count / total) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* Per-category breakdown */}
        {byCategory.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wide mb-3">By Category</p>
            <div className="space-y-2.5">
              {byCategory.map(({ cat, total: ct, done: cd, pct }) => (
                <div key={cat}>
                  <div className="flex justify-between text-xs text-text-secondary mb-1 font-medium">
                    <span>{cat}</span>
                    <span>{cd}/{ct} · {pct}%</span>
                  </div>
                  <div className="h-2 bg-surface-elevated/50 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-green-500' : 'bg-teal-500'}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Info notice */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-4 text-sm text-blue-400 flex items-start gap-3">
        <Bot size={16} className="flex-shrink-0 mt-0.5" />
        <p>To update your profile details such as name, role, or team, please contact <strong>HR</strong> or your <strong>Admin</strong>.</p>
      </div>
    </div>
  )
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function NewHireDashboard({ activeSection, onMessageMentor }: Props) {
  const { state } = useApp()

  const employee = state.employees.find(e => e.id === state.currentUserId) ?? state.employees[0]
  const myTasks  = state.tasks.filter(t => t.assignedTo === employee?.id)
  const mentor   = initialMentors.find(m => m.id === employee?.mentorId)

  if (!employee) return (
    <div className="min-h-screen flex items-center justify-center text-text-secondary">
      <p>No employee profile found. Please log in again.</p>
    </div>
  )

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeSection === 'dashboard' && (
          <OverviewSection employee={employee} myTasks={myTasks} mentor={mentor} onMessageMentor={onMessageMentor} />
        )}
        {activeSection === 'tasks' && (
          <TasksSection myTasks={myTasks} />
        )}
        {activeSection === 'resources' && (
          <MeetsSection employeeId={employee.id} mentor={mentor} />
        )}
        {activeSection === 'buddy' && (
          <BuddySection myTasks={myTasks} mentor={mentor} />
        )}
        {activeSection === 'settings' && (
          <SettingsSection employee={employee} myTasks={myTasks} />
        )}
      </div>
    </div>
  )
}
