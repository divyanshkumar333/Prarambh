import { useState, useRef } from 'react'
import {
  Users, TrendingUp, AlertTriangle, CheckCircle, Plus,
  Search, BarChart3, Bot, FileText, Trash2, Eye,
  Sparkles, BookOpen, Settings, Shield, Upload,
  Plug, Activity, Clock, Zap, GitBranch, Slack, Globe, Lock, ClipboardList
} from 'lucide-react'
import { useApp, initialMentors } from '../../context/AppContext'
import AddEmployeeModal from '../modals/AddEmployeeModal'
import EmployeeDetailModal from '../modals/EmployeeDetailModal'
import PDFViewerModal from '../modals/PDFViewerModal'
import AddMentorModal from '../modals/AddMentorModal'
import AIDocumentChat from '../chat/AIDocumentChat'
import AdminChatWidget from '../chat/AdminChatWidget'
import BulkTaskGenerationModal from '../modals/BulkTaskGenerationModal'
import type { Employee, Document, MentorUser } from '../../context/AppContext'
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { ProgressRing } from '../ui/ProgressRing'

interface Props { activeSection?: string; isHR?: boolean }

// ─── Settings Section (extracted to respect Rules of Hooks) ───────────────────
function SettingsSection() {
  const { state, dispatch } = useApp()
  const cs = state.companySettings
  const nameRef   = useRef<HTMLInputElement>(null)
  const industRef = useRef<HTMLInputElement>(null)
  const sizeRef   = useRef<HTMLInputElement>(null)
  const aboutRef  = useRef<HTMLTextAreaElement>(null)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    dispatch({
      type: 'UPDATE_COMPANY_SETTINGS',
      payload: {
        name:     nameRef.current?.value   ?? cs.name,
        industry: industRef.current?.value ?? cs.industry,
        teamSize: sizeRef.current?.value   ?? cs.teamSize,
        about:    aboutRef.current?.value  ?? cs.about,
      },
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      {/* Company Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Settings size={18} />Company Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5">Company Name</label><input ref={nameRef} type="text" defaultValue={cs.name} className="bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 ease-apple placeholder-text-secondary/50 text-sm py-2.5 w-full" /></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5">Industry</label><input ref={industRef} type="text" defaultValue={cs.industry} className="bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 ease-apple placeholder-text-secondary/50 text-sm py-2.5 w-full" /></div>
            <div><label className="block text-xs font-semibold text-text-secondary mb-1.5">Team Size</label><input ref={sizeRef} type="text" defaultValue={cs.teamSize} className="bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 ease-apple placeholder-text-secondary/50 text-sm py-2.5 w-full" /></div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">About the Company</label>
              <textarea ref={aboutRef} rows={4} defaultValue={cs.about} className="bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 ease-apple placeholder-text-secondary/50 text-sm py-2.5 resize-none w-full" placeholder="Write a short description about your company…" />
            </div>
          </div>
          <Button onClick={handleSave} variant={saved ? "secondary" : "primary"} className={saved ? 'w-full mt-5 bg-green-500/20 text-green-400 border-green-500/30' : 'w-full mt-5'}>
            {saved ? '✓ Saved!' : 'Save Changes'}
          </Button>
        </CardContent>
      </Card>
      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Shield size={18} />Security &amp; Compliance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[{ label: 'Authentication', value: 'SSO + MFA Enabled' }, { label: 'Data Encryption', value: 'AES-256' }, { label: 'Compliance', value: 'GDPR · CCPA · SOC 2' }].map(f => (
              <div key={f.label}><label className="block text-xs font-semibold text-text-secondary mb-1.5">{f.label}</label><input type="text" defaultValue={f.value} className="bg-surface-elevated border border-border rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 ease-apple placeholder-text-secondary/50 text-sm py-2.5 w-full" /></div>
            ))}
          </div>
          <Button className="w-full mt-5">Save Changes</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default function AdminPanel({ activeSection = 'overview', isHR = false }: Props) {
  const { state, dispatch } = useApp()
  const [search,           setSearch]           = useState('')
  const [showAddEmployee,  setShowAddEmployee]  = useState(false)
  const [showAIChat,       setShowAIChat]       = useState(false)
  const [selectedDoc,      setSelectedDoc]      = useState<string | undefined>()
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [confirmRemove,    setConfirmRemove]    = useState<Employee | null>(null)
  const [viewingDoc,       setViewingDoc]       = useState<Document | null>(null)
  const [showAddMentor,    setShowAddMentor]    = useState(false)
  const [confirmRemoveMentor, setConfirmRemoveMentor] = useState<MentorUser | null>(null)
  const [confirmDeleteDoc,    setConfirmDeleteDoc]    = useState<string | null>(null)
  const [docInUseError,       setDocInUseError]       = useState<string | null>(null)
  const [showBulkGenerate,    setShowBulkGenerate]    = useState(false)
  const docUploadRef = useRef<HTMLInputElement>(null)

  // Check if a document is referenced by any task's supportingDocs
  const isDocInUse = (docId: string) =>
    state.tasks.some(t => (t.supportingDocs ?? []).includes(docId))

  // Documents visible to this role only
  const roleDocs = state.documents.filter(d => isHR ? d.uploadedBy === 'hr' : d.uploadedBy === 'admin')

  const handleDirectUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const newDoc: Document = {
        id: `doc-${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        type: file.name.split('.').pop()?.toUpperCase() ?? 'PDF',
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        status: 'processed',
        uploadedBy: isHR ? 'hr' : 'admin',
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        content: `Document: ${file.name}. This document contains important company information, policies, procedures, and guidelines for new employees.`,
        fileData: reader.result as string,
      }
      dispatch({ type: 'ADD_DOCUMENT', payload: newDoc })
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  const filtered = state.employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.role.toLowerCase().includes(search.toLowerCase())
  )

  const atRisk     = state.employees.filter(e => e.risk === 'high').length
  const prarambh = state.employees.filter(e => e.status === 'prarambh').length

  // Compute progress dynamically from task completion; fall back to emp.progress if no tasks assigned
  const getProgress = (emp: Employee) => {
    const t = state.tasks.filter(t => t.assignedTo === emp.id)
    return t.length > 0 ? Math.round((t.filter(t => t.status === 'done').length / t.length) * 100) : emp.progress
  }
  const hasTasks = (empId: string) => state.tasks.some(t => t.assignedTo === empId)

  const avgProg    = state.employees.length
    ? Math.round(state.employees.reduce((a, e) => a + getProgress(e), 0) / state.employees.length)
    : 0

  const getMentor = (id: string | null) =>
    id ? initialMentors.find(m => m.id === id)?.name ?? '—' : 'Unassigned'

  return (
    <div className="min-h-screen">
      {/* Always-rendered hidden file input for document upload */}
      <input
        ref={docUploadRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.ppt,.pptx,.xls,.xlsx"
        onChange={handleDirectUpload}
      />
      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Stats — hidden on Mentors and Docs tabs */}
        {activeSection !== 'mentors' && activeSection !== 'docs' && <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: <Users size={20} />,        label: 'Total Employees', value: state.employees.length, sub: `${prarambh} prarambh`,  color: 'bg-blue-500/10 text-blue-400'   },
            { icon: <TrendingUp size={20} />,    label: 'Avg Progress',   value: `${avgProg}%`,          sub: 'across all hires',           color: 'bg-green-500/10 text-green-400' },
            { icon: <AlertTriangle size={20} />, label: 'At Risk',        value: atRisk,                 sub: atRisk > 0 ? 'need attention' : 'all on track ✅', color: atRisk > 0 ? 'bg-red-500/10 text-red-400' : 'bg-green-500/10 text-green-400' },
            { icon: <FileText size={20} />,      label: 'Documents',      value: state.documents.length, sub: `${state.documents.filter(d => d.status === 'processed').length} processed`, color: 'bg-purple-500/10 text-purple-400' },
          ].map(s => (
            <Card key={s.label} className="flex items-center gap-4 py-4 px-5">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
              <div>
                <p className="text-sm text-text-secondary font-medium tracking-tight">{s.label}</p>
                <p className="font-bold text-text-primary text-2xl leading-tight mt-0.5">{s.value}</p>
                <p className="text-xs text-text-secondary/70 mt-0.5">{s.sub}</p>
              </div>
            </Card>
          ))}
        </div>}

        {/* ═══ OVERVIEW ═══ */}
        {activeSection === 'overview' && (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <Card>
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-bold text-text-primary flex items-center gap-2"><BarChart3 size={18} className="text-brand-400" />Employee Progress</h3>
                  <div className="flex items-center gap-2">
                    <Button onClick={() => setShowBulkGenerate(true)} variant="secondary" className="text-sm py-2 px-3 flex items-center gap-1.5"><Sparkles size={14} />AI Generate Tasks</Button>
                    {!isHR && <Button onClick={() => setShowAddEmployee(true)} className="text-sm py-2 px-4 flex items-center gap-2"><Plus size={14} />Add Employee</Button>}
                  </div>
                </div>
                <div className="space-y-4">
                  {state.employees.filter(e => e.status === 'prarambh').map(emp => {
                    const prog     = getProgress(emp)
                    const hasTask  = hasTasks(emp.id)
                    return (
                      <button key={emp.id} onClick={() => setSelectedEmployee(emp)} className="w-full flex items-center gap-4 text-left hover:bg-surface-elevated -mx-2 px-2 py-2 rounded-xl transition-all duration-300 ease-apple active:scale-[0.99] group">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: emp.color }}>{emp.initials}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1.5">
                            <span className="text-sm font-semibold text-text-primary group-hover:text-brand-400 transition-colors truncate">{emp.name}</span>
                            {hasTask
                              ? <span className="text-xs text-text-secondary ml-2 flex-shrink-0 font-medium">Day {emp.day}/{emp.totalDays} · <span className="text-text-primary">{prog}%</span></span>
                              : <span className="text-xs text-orange-400 ml-2 flex-shrink-0 font-medium">No task assigned</span>
                            }
                          </div>
                          {hasTask
                            ? <ProgressRing progress={prog} size={8} strokeWidth={4} />
                            : <div className="h-2 rounded-full bg-orange-500/10 border border-dashed border-orange-500/30 w-full" />
                          }
                          <p className="text-xs text-text-secondary/70 mt-1">Mentor: {getMentor(emp.mentorId)}</p>
                        </div>
                        {emp.risk === 'high' && <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />}
                        {!isHR && (
                          <button
                            onClick={e => { e.stopPropagation(); setConfirmRemove(emp) }}
                            className="p-2 rounded-lg text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                            title="Remove employee"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                      </button>
                    )
                  })}
                  {state.employees.filter(e => e.status === 'prarambh').length === 0 && (
                    <div className="text-center py-10">
                      <Users size={32} className="mx-auto mb-3 text-text-secondary/30" />
                      <p className="text-sm text-text-secondary">No active prarambh.{!isHR && <> <button onClick={() => setShowAddEmployee(true)} className="text-brand-400 font-medium hover:underline">Add employee</button></>}</p>
                    </div>
                  )}
                </div>
              </Card>
              <AdminChatWidget
                employeeCount={state.employees.length}
                atRiskCount={atRisk}
                avgProgress={avgProg}
                docCount={state.documents.length}
                atRiskNames={state.employees.filter(e => e.risk === 'high').map(e => e.name)}
              />
            </div>
            <div className="space-y-5">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Bot size={16} className="text-brand-400" />AI Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {atRisk > 0 && <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-xs text-red-400">⚠️ <strong className="text-red-300">{state.employees.filter(e => e.risk === 'high').map(e => e.name).join(', ')}</strong> — low engagement. Schedule a check-in.</div>}
                    <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-3 text-xs text-emerald-400">✅ {state.documents.filter(d => d.status === 'processed').length} documents processed and ready.</div>
                    <div className="bg-brand-500/10 border border-brand-500/20 rounded-xl p-3 text-xs text-brand-400">💡 Click any employee row to view full details, tasks and analytics.</div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {!isHR && (
                      <button onClick={() => setShowAddEmployee(true)} className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-surface-elevated hover:bg-border/50 border border-border transition-all duration-300 ease-apple active:scale-[0.98] text-left group">
                        <div className="bg-border/50 p-1.5 rounded-lg group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors"><Plus size={16} className="flex-shrink-0" /></div>
                        <span className="text-sm font-semibold text-text-primary group-hover:text-brand-400 transition-colors">Add New Employee</span>
                      </button>
                    )}
                    <button onClick={() => docUploadRef.current?.click()} className="w-full flex items-center gap-3 p-3.5 rounded-xl bg-surface-elevated hover:bg-border/50 border border-border transition-all duration-300 ease-apple active:scale-[0.98] text-left group">
                      <div className="bg-border/50 p-1.5 rounded-lg group-hover:bg-brand-500/20 group-hover:text-brand-400 transition-colors"><Upload size={16} className="flex-shrink-0" /></div>
                      <span className="text-sm font-semibold text-text-primary group-hover:text-brand-400 transition-colors">Upload Documents</span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* ═══ EMPLOYEES ═══ */}
        {activeSection === 'employees' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <div className="relative max-w-sm w-full">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
                <input placeholder="Search employees…" value={search} onChange={e => setSearch(e.target.value)} className="bg-surface-elevated border border-border rounded-xl px-4 py-2.5 text-text-primary focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-all duration-300 ease-apple placeholder-text-secondary/50 pl-9 w-full text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <Button onClick={() => setShowBulkGenerate(true)} variant="secondary" className="inline-flex items-center gap-2 py-2.5 px-4 text-sm"><Sparkles size={15} />AI Generate Tasks</Button>
                {!isHR && <Button onClick={() => setShowAddEmployee(true)} className="inline-flex items-center gap-2 py-2.5 px-5 text-sm"><Plus size={16} />Add New Employee</Button>}
              </div>
            </div>
            <Card className="overflow-hidden p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-surface-elevated/50 border-b border-border">
                    <tr>{['Employee', 'Role / Team', 'Mentor', 'Progress', 'Tasks', 'Status', 'Resume', ''].map(h => <th key={h} className="text-left text-xs font-semibold text-text-secondary px-4 py-3.5 whitespace-nowrap">{h}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {filtered.map(emp => {
                      const myTasks = state.tasks.filter(t => t.assignedTo === emp.id)
                      const done    = myTasks.filter(t => t.status === 'done').length
                      const prog    = getProgress(emp)
                      const hasTask = hasTasks(emp.id)
                      return (
                        <tr key={emp.id} onClick={() => setSelectedEmployee(emp)} className="hover:bg-surface-elevated/60 transition-colors cursor-pointer group">
                          <td className="px-4 py-4"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" style={{ background: emp.color }}>{emp.initials}</div><div><span className="font-semibold text-text-primary text-sm group-hover:text-brand-400 transition-colors">{emp.name}</span><p className="text-xs text-text-secondary">{emp.email}</p></div></div></td>
                          <td className="px-4 py-4"><p className="text-sm text-text-primary font-medium">{emp.role}</p><p className="text-xs text-text-secondary/70">{emp.team}</p></td>
                          <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap">{getMentor(emp.mentorId)}</td>
                          <td className="px-4 py-4">
                            {hasTask
                              ? <div className="flex items-center gap-2"><div className="w-20"><ProgressRing progress={prog} size={16} strokeWidth={4} /></div><span className="text-xs text-text-secondary font-medium">{prog}%</span></div>
                              : <span className="text-[10px] font-semibold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full whitespace-nowrap">No task assigned</span>
                            }
                          </td>
                          <td className="px-4 py-4 text-sm text-text-secondary whitespace-nowrap"><span className="text-text-primary">{done}</span>/{myTasks.length} done</td>
                          <td className="px-4 py-4">{emp.status === 'completed' ? <Badge variant="success">Completed</Badge> : <Badge variant="warning">Prarambh</Badge>}</td>
                          <td className="px-4 py-4">{emp.resumeFileName ? <Badge variant="success" className="flex items-center gap-1 w-fit"><CheckCircle size={11} />{emp.resumeFileName.slice(0, 12)}…</Badge> : <span className="text-xs text-text-secondary/50">—</span>}</td>
                          <td className="px-4 py-4 text-xs text-brand-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity">View →</td>
                          {!isHR && (
                            <td className="px-4 py-4">
                              <button
                                onClick={e => { e.stopPropagation(); setConfirmRemove(emp) }}
                                className="p-1.5 rounded-lg text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                                title="Remove employee"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          )}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {filtered.length === 0 && <div className="text-center py-12 text-text-secondary"><Users size={36} className="mx-auto mb-3 opacity-20" /><p className="text-sm font-medium">No employees found</p><button onClick={() => setShowAddEmployee(true)} className="text-brand-400 font-medium hover:underline text-sm mt-1">Add first employee</button></div>}
              </div>
            </Card>
          </div>
        )}

        {/* ═══ DOCUMENTS ═══ */}
        {activeSection === 'docs' && (
          <div className="space-y-5">
            <div className="border-2 border-dashed border-border rounded-2xl p-10 text-center hover:border-brand-400 transition-all duration-300 ease-apple bg-surface-elevated/30">
              <div className="w-16 h-16 bg-surface-elevated rounded-2xl flex items-center justify-center mx-auto mb-4 border border-border shadow-sm"><Upload size={28} className="text-text-primary" /></div>
              <h3 className="font-bold text-text-primary text-lg mb-2">Upload Documents</h3>
              <p className="text-text-secondary text-sm mb-5">Upload HR policies, guides, playbooks and prarambh materials</p>
              <Button onClick={() => docUploadRef.current?.click()} className="inline-flex items-center gap-2"><Upload size={16} /> Upload Document</Button>
            </div>
            <Card className="p-0 overflow-hidden">
              <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface-elevated/50">
                <h3 className="font-bold text-text-primary">Uploaded Documents</h3>
                <Badge variant="default">{roleDocs.length} files</Badge>
              </div>
              <div className="divide-y divide-border/50">
                {roleDocs.length === 0 && (
                  <div className="text-center py-10 text-text-secondary">
                    <BookOpen size={28} className="mx-auto mb-2 opacity-30" />
                    <p className="text-sm">No documents uploaded yet.</p>
                  </div>
                )}
                {roleDocs.map(doc => (
                  <div key={doc.id} className={`transition-colors duration-300 ease-apple ${confirmDeleteDoc === doc.id ? 'bg-red-500/10' : 'hover:bg-surface-elevated'}`}>
                    {/* Main row */}
                    <div className="flex items-center gap-4 px-6 py-4 group">
                      <div className="w-10 h-10 bg-surface-elevated rounded-xl flex items-center justify-center border border-border flex-shrink-0 shadow-sm group-hover:bg-brand-500/10 group-hover:border-brand-500/20 transition-colors">
                        <BookOpen size={18} className="text-text-primary group-hover:text-brand-400 transition-colors" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-text-primary text-sm truncate">{doc.name}</p>
                        <p className="text-xs text-text-secondary/70 mt-0.5">{doc.type} · {doc.size} · {doc.date}</p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        {doc.status === 'processed'
                          ? <Badge variant="success" className="flex items-center gap-1"><CheckCircle size={11} />Processed</Badge>
                          : <Badge variant="warning">Processing…</Badge>
                        }
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="text-xs font-semibold text-text-secondary border border-border bg-surface-elevated px-2.5 py-1.5 rounded-lg hover:bg-card hover:text-text-primary transition-all duration-300 ease-apple flex items-center gap-1 active:scale-[0.97]"
                        >
                          <Eye size={12} />View
                        </button>
                        <button
                          onClick={() => {
                            setDocInUseError(null)
                            if (isDocInUse(doc.id)) {
                              setDocInUseError(doc.id)
                              setConfirmDeleteDoc(null)
                            } else {
                              setConfirmDeleteDoc(confirmDeleteDoc === doc.id ? null : doc.id)
                            }
                          }}
                          title="Delete document"
                          className={`p-1.5 rounded-lg transition-colors ${confirmDeleteDoc === doc.id ? 'text-red-400 bg-red-500/20' : 'text-text-secondary/50 hover:text-red-400 hover:bg-red-500/10'}`}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    {/* Document in-use error */}
                    {docInUseError === doc.id && (
                      <div className="flex items-center justify-between gap-3 px-6 py-3 bg-amber-500/10 border-t border-amber-500/20">
                        <p className="text-xs text-amber-400 font-medium flex items-center gap-2">
                          <AlertTriangle size={13} className="flex-shrink-0" />
                          This document is currently attached to one or more tasks and cannot be deleted.
                        </p>
                        <button onClick={() => setDocInUseError(null)} className="text-xs px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors flex-shrink-0 font-medium">Dismiss</button>
                      </div>
                    )}
                    {/* Inline delete confirmation */}
                    {confirmDeleteDoc === doc.id && (
                      <div className="px-6 py-3 bg-red-500/5 border-t border-red-500/10 space-y-2">
                        {docInUseError && confirmDeleteDoc === doc.id && (
                          <p className="text-xs text-red-400 font-semibold flex items-center gap-1">
                            ⚠️ {docInUseError}
                          </p>
                        )}
                        {!docInUseError && (
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-xs text-red-400 font-medium">
                              Delete <strong className="text-red-300">{doc.name}</strong>? This cannot be undone.
                            </p>
                            <div className="flex gap-2 flex-shrink-0">
                              <button
                                onClick={() => { setConfirmDeleteDoc(null); setDocInUseError(null) }}
                                className="text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-card transition-colors font-medium"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => {
                                  const inUse = state.tasks.some(t => (t.supportingDocs ?? []).includes(doc.id))
                                  if (inUse) {
                                    setDocInUseError(`"${doc.name}" is currently attached to one or more tasks and cannot be deleted.`)
                                    return
                                  }
                                  dispatch({ type: 'REMOVE_DOCUMENT', payload: { id: doc.id } })
                                  setConfirmDeleteDoc(null)
                                  setDocInUseError(null)
                                }}
                                className="text-xs px-3 py-1.5 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition-colors flex items-center gap-1 shadow-sm"
                              >
                                <Trash2 size={11} /> Delete
                              </button>
                            </div>
                          </div>
                        )}
                        {docInUseError && confirmDeleteDoc === doc.id && (
                          <button
                            onClick={() => { setConfirmDeleteDoc(null); setDocInUseError(null) }}
                            className="text-xs px-3 py-1.5 rounded-lg border border-border bg-surface-elevated text-text-secondary hover:text-text-primary hover:bg-card transition-colors font-medium"
                          >
                            Dismiss
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* ═══ TEMPLATES ═══ */}
        {activeSection === 'templates' && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: '💻', name: 'Software Developer',  tasks: 45, days: 30 },
              { icon: '📊', name: 'Sales Representative', tasks: 38, days: 21 },
              { icon: '📣', name: 'Marketing Manager',   tasks: 32, days: 21 },
              { icon: '🎨', name: 'UX/UI Designer',      tasks: 28, days: 14 },
              { icon: '⚙️', name: 'Operations Manager',  tasks: 40, days: 30 },
              { icon: '🤝', name: 'Customer Success',    tasks: 35, days: 21 },
            ].map(tmpl => (
              <Card key={tmpl.name} className="hover:border-brand-500/30 group">
                <div className="flex items-center gap-4 mb-5">
                  <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-300 ease-apple">{tmpl.icon}</span>
                  <div>
                    <h4 className="font-bold text-text-primary text-sm group-hover:text-brand-400 transition-colors">{tmpl.name}</h4>
                    <p className="text-xs text-text-secondary/70">{tmpl.tasks} tasks · {tmpl.days} days</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" className="flex-1 text-xs py-2">Edit</Button>
                  <Button onClick={() => setShowAIChat(true)} className="flex-1 text-xs py-2 flex items-center justify-center gap-1.5"><Bot size={13} />AI Generate</Button>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* ═══ ANALYTICS ═══ */}
        {activeSection === 'analytics' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Avg Time to Productivity', value: '12 days', icon: <Clock size={20} />,    color: 'bg-blue-500/10 text-blue-400',     delta: '↓ 3 days vs last month' },
                { label: 'Task Completion Rate',     value: `${avgProg}%`, icon: <Activity size={20} />, color: 'bg-emerald-500/10 text-emerald-400',  delta: '↑ 8% vs last month'   },
                { label: 'Mentor Satisfaction',      value: '4.8/5',  icon: <Zap size={20} />,       color: 'bg-purple-500/10 text-purple-400', delta: 'Based on 12 reviews'  },
              ].map(m => (
                <Card key={m.label} className="flex items-center gap-4 py-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${m.color}`}>{m.icon}</div>
                  <div><p className="text-xs text-text-secondary font-medium">{m.label}</p><p className="text-2xl font-bold text-text-primary leading-tight mt-0.5">{m.value}</p><p className="text-xs text-emerald-400 mt-0.5 font-medium">{m.delta}</p></div>
                </Card>
              ))}
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><BarChart3 size={16} className="text-brand-400" />Prarambh by Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {['Engineering', 'Product', 'Sales', 'Design'].map((team, i) => {
                      const emps = state.employees.filter(e => e.team === team)
                      const avg  = emps.length ? Math.round(emps.reduce((a, e) => a + getProgress(e), 0) / emps.length) : ([60,80,45,90] as number[])[i]
                      return (
                        <div key={team}>
                          <div className="flex justify-between mb-2"><span className="text-sm font-medium text-text-primary">{team}</span><span className="text-xs text-text-secondary">{avg}%</span></div>
                          <ProgressRing progress={avg} size={8} strokeWidth={4} />
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><TrendingUp size={16} className="text-brand-400" />Employee Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { label: 'On Track',  count: state.employees.filter(e => e.risk === 'low').length,              color: 'bg-emerald-500' },
                      { label: 'At Risk',   count: state.employees.filter(e => e.risk === 'high').length,             color: 'bg-red-500'   },
                      { label: 'Completed', count: state.employees.filter(e => e.status === 'completed').length,      color: 'bg-brand-500'  },
                    ].map(s => (
                      <div key={s.label} className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full flex-shrink-0 ${s.color} shadow-sm`} />
                        <span className="text-sm text-text-secondary flex-1 font-medium">{s.label}</span>
                        <span className="font-bold text-text-primary">{s.count}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Unassigned employees callout */}
            {(() => {
              const unassigned = state.employees.filter(e => !hasTasks(e.id))
              if (unassigned.length === 0) return null
              return (
                <Card className="border-l-4 border-l-orange-500/50 bg-orange-500/5 py-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle size={18} className="text-orange-400 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-orange-400 mb-3">Employees with no tasks assigned ({unassigned.length})</p>
                      <div className="flex flex-wrap gap-2">
                        {unassigned.map(emp => (
                          <div key={emp.id} className="flex items-center gap-2 bg-surface-elevated border border-orange-500/20 rounded-lg px-3 py-1.5 shadow-sm">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: emp.color }}>{emp.initials}</div>
                            <div>
                              <span className="text-xs font-semibold text-text-primary">{emp.name}</span>
                              <span className="text-[10px] text-orange-400 ml-1.5 font-medium tracking-wide uppercase">No task assigned</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })()}
          </div>
        )}

        {/* ═══ MENTORS ═══ */}
        {activeSection === 'mentors' && (() => {
          const mentors = state.mentors
          const getMentees = (mId: string) => state.employees.filter(e => e.mentorId === mId)
          const getMenteeAvgProgress = (mId: string) => {
            const mentees = getMentees(mId)
            if (!mentees.length) return 0
            return Math.round(mentees.reduce((a, e) => a + getProgress(e), 0) / mentees.length)
          }
          const totalMentees = mentors.reduce((a, m) => a + getMentees(m.id).length, 0)

          return (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid sm:grid-cols-2 gap-4 max-w-sm">
                {[
                  { label: 'Total Mentors', value: mentors.length, icon: <Users size={20} />,      color: 'bg-blue-500/10 text-blue-400'   },
                  { label: 'Total Mentees', value: totalMentees,   icon: <TrendingUp size={20} />, color: 'bg-emerald-500/10 text-emerald-400' },
                ].map(s => (
                  <Card key={s.label} className="flex items-center gap-4 py-4 px-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>{s.icon}</div>
                    <div>
                      <p className="text-xs text-text-secondary font-medium tracking-tight">{s.label}</p>
                      <p className="font-bold text-text-primary text-xl leading-tight mt-0.5">{s.value}</p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Header + Add button */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-text-primary flex items-center gap-2"><Users size={18} className="text-brand-400" />All Mentors <Badge variant="default" className="ml-1">{mentors.length}</Badge></h3>
                {!isHR && <Button onClick={() => setShowAddMentor(true)} className="text-sm py-2 px-4 flex items-center gap-2"><Plus size={14} />Add Mentor</Button>}
              </div>

              {/* Mentor cards */}
              {mentors.length === 0 ? (
                <div className="text-center py-14 bg-surface-elevated/30 rounded-2xl border border-dashed border-border hover:border-brand-500/50 transition-colors">
                  <Users size={36} className="mx-auto mb-3 text-text-secondary/30" />
                  <p className="text-text-secondary font-medium mb-3">No mentors added yet</p>
                  <Button onClick={() => setShowAddMentor(true)} className="text-sm py-2 px-5 inline-flex items-center gap-2"><Plus size={14} />Add First Mentor</Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mentors.map(mentor => {
                    const mentees   = getMentees(mentor.id)
                    const avgPct    = getMenteeAvgProgress(mentor.id)
                    const atRiskCt  = mentees.filter(e => e.risk === 'high').length
                    return (
                      <Card key={mentor.id} className="flex flex-col gap-5 hover:border-brand-500/30 group">
                        {/* Avatar + info */}
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg flex-shrink-0 shadow-sm" style={{ background: mentor.color }}>
                            {mentor.initials}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-bold text-text-primary text-sm truncate group-hover:text-brand-400 transition-colors">{mentor.name}</p>
                            <p className="text-xs text-text-secondary/70 truncate">{mentor.specialty}</p>
                            <div className="mt-2"><Badge variant="default">{mentor.department}</Badge></div>
                          </div>
                          {!isHR && (
                            <button
                              onClick={() => setConfirmRemoveMentor(mentor)}
                              className="p-1.5 rounded-lg text-red-400/50 hover:bg-red-500/10 hover:text-red-400 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"
                              title="Remove mentor"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Mentees stats */}
                        <div className="grid grid-cols-3 gap-2 text-center bg-surface-elevated/30 p-2 rounded-xl border border-border">
                          <div>
                            <p className="font-bold text-text-primary">{mentees.length}</p>
                            <p className="text-[10px] text-text-secondary/70 font-medium uppercase tracking-wider">Mentees</p>
                          </div>
                          <div className="border-x border-border/50">
                            <p className="font-bold text-emerald-400">{mentees.filter(e => e.status === 'completed').length}</p>
                            <p className="text-[10px] text-text-secondary/70 font-medium uppercase tracking-wider">Completed</p>
                          </div>
                          <div>
                            <p className={`font-bold ${atRiskCt > 0 ? 'text-red-400' : 'text-emerald-400'}`}>{atRiskCt}</p>
                            <p className="text-[10px] text-text-secondary/70 font-medium uppercase tracking-wider">At Risk</p>
                          </div>
                        </div>

                        {/* Avg progress bar */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-xs font-medium text-text-secondary">Avg. Mentee Progress</span>
                            <span className="text-xs font-bold text-text-primary">{avgPct}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
                            <div className="h-full bg-brand-500 rounded-full" style={{ width: `${avgPct}%` }} />
                          </div>
                        </div>

                        {/* Mentee list */}
                        {mentees.length > 0 && (
                          <div className="border-t border-border pt-4">
                            <p className="text-xs font-semibold text-text-secondary/50 mb-3 uppercase tracking-wider">Current Mentees</p>
                            <div className="space-y-2">
                              {mentees.map(e => (
                                <div key={e.id} className="flex items-center gap-3">
                                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold flex-shrink-0 shadow-sm" style={{ background: e.color }}>{e.initials}</div>
                                  <span className="text-xs text-text-secondary flex-1 truncate font-medium">{e.name}</span>
                                  <span className={`text-xs font-bold ${e.risk === 'high' ? 'text-red-400' : 'text-emerald-400'}`}>{getProgress(e)}%</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {mentees.length === 0 && (
                          <div className="border-t border-border pt-4 text-center">
                            <p className="text-xs text-text-secondary/50 font-medium">No mentees assigned yet</p>
                          </div>
                        )}
                      </Card>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })()}

        {/* ═══ INTEGRATIONS ═══ */}
        {activeSection === 'integrations' && (
          <div className="space-y-5">
            <p className="text-text-secondary text-sm">Connect Prarambh with your existing tools for seamless data sync.</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Slack',            icon: <Slack size={24} />,        desc: 'Send prarambh notifications',   connected: true,  color: 'bg-purple-500/10 text-purple-400' },
                { name: 'GitHub',           icon: <GitBranch size={24} />,    desc: 'Provision repo access on Day 1',  connected: false, color: 'bg-surface-elevated text-text-primary'     },
                { name: 'Google Workspace', icon: <Globe size={24} />,        desc: 'Sync calendar & Drive access',    connected: true,  color: 'bg-blue-500/10 text-blue-400'     },
                { name: 'Jira',             icon: <ClipboardList size={24} />,desc: 'Auto-create prarambh tickets',  connected: false, color: 'bg-brand-500/10 text-brand-400'     },
                { name: 'Okta',             icon: <Lock size={24} />,         desc: 'SSO and identity management',     connected: false, color: 'bg-red-500/10 text-red-400'       },
                { name: 'Zapier',           icon: <Zap size={24} />,          desc: 'Automate with 5,000+ apps',       connected: false, color: 'bg-orange-500/10 text-orange-400' },
              ].map(intg => (
                <Card key={intg.name} className="flex flex-col gap-5 hover:border-brand-500/30 group transition-all duration-300">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${intg.color} group-hover:scale-110 transition-transform duration-300 ease-apple`}>{intg.icon}</div>
                    <div><p className="font-bold text-text-primary text-sm group-hover:text-brand-400 transition-colors">{intg.name}</p><p className="text-xs text-text-secondary/70 mt-0.5">{intg.desc}</p></div>
                  </div>
                  <Button variant={intg.connected ? 'secondary' : 'ghost'} className={`w-full text-xs py-2 border ${intg.connected ? 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border-emerald-500/20' : 'border-border hover:border-brand-500/30'}`}>
                    {intg.connected ? '✓ Connected' : 'Connect'}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ═══ COMPLIANCE ═══ */}
        {activeSection === 'compliance' && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                { label: 'Compliance Score', value: '94%',                icon: <Shield size={20} />,        color: 'text-emerald-400', bg: 'bg-emerald-500/10'                             },
                { label: 'Policies Signed',  value: `${state.employees.length * 3}`, icon: <FileText size={20} />, color: 'text-brand-400', bg: 'bg-brand-500/10'                        },
                { label: 'Pending Actions',  value: `${atRisk}`,          icon: <AlertTriangle size={20} />, color: atRisk > 0 ? 'text-red-400' : 'text-emerald-400', bg: atRisk > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10' },
              ].map(s => (
                <Card key={s.label} className="flex items-center gap-4 py-4 px-5">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${s.bg} ${s.color}`}>{s.icon}</div>
                  <div><p className="text-xs text-text-secondary font-medium tracking-tight">{s.label}</p><p className={`text-2xl font-bold leading-tight mt-0.5 ${s.color}`}>{s.value}</p></div>
                </Card>
              ))}
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ClipboardList size={16} className="text-brand-400" />Compliance Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'GDPR Data Processing Agreement',       done: true  },
                    { label: 'Employee handbook acknowledgement',     done: true  },
                    { label: 'IT Security policy training',           done: true  },
                    { label: 'Background check completed',            done: false },
                    { label: 'SOC 2 access provisioning audit',       done: true  },
                    { label: 'CCPA data rights notification sent',    done: false },
                  ].map((item, i) => (
                    <div key={i} className={`flex items-center gap-3 p-3.5 rounded-xl border transition-colors ${item.done ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-orange-500/20 bg-orange-500/5'}`}>
                      {item.done ? <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" /> : <Clock size={16} className="text-orange-400 flex-shrink-0" />}
                      <span className={`text-sm font-medium ${item.done ? 'text-text-primary' : 'text-text-secondary'}`}>{item.label}</span>
                      <span className={`ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${item.done ? 'bg-emerald-500/10 text-emerald-400' : 'bg-orange-500/10 text-orange-400'}`}>{item.done ? 'Complete' : 'Pending'}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* ═══ SETTINGS ═══ */}
        {activeSection === 'settings' && <SettingsSection />}

      </div>

      {showAddEmployee   && <AddEmployeeModal onClose={() => setShowAddEmployee(false)} />}
      {showAddMentor     && <AddMentorModal   onClose={() => setShowAddMentor(false)} />}
      {selectedEmployee  && <EmployeeDetailModal employee={selectedEmployee} onClose={() => setSelectedEmployee(null)} />}
      {viewingDoc        && <PDFViewerModal doc={viewingDoc} onClose={() => setViewingDoc(null)} />}
      {showBulkGenerate  && <BulkTaskGenerationModal onClose={() => setShowBulkGenerate(false)} />}

      {/* ── Remove Mentor Confirmation ── */}
      {confirmRemoveMentor && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={() => setConfirmRemoveMentor(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-red-500/20"><Trash2 size={20} className="text-red-400" /></div>
              <div><h3 className="font-bold text-text-primary text-lg">Remove Mentor</h3><p className="text-xs text-text-secondary/70">This action cannot be undone</p></div>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Remove <strong className="text-text-primary">{confirmRemoveMentor.name}</strong> as a mentor? Any employees assigned to them will be unassigned.
            </p>
            <div className="flex gap-3">
              <Button onClick={() => setConfirmRemoveMentor(null)} variant="secondary" className="flex-1 py-2.5">Cancel</Button>
              <Button
                onClick={() => { dispatch({ type: 'REMOVE_MENTOR', payload: { id: confirmRemoveMentor.id } }); setConfirmRemoveMentor(null) }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-transparent transition-colors py-2.5 flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Remove Employee Confirmation ── */}
      {confirmRemove && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4" onClick={() => setConfirmRemove(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-surface rounded-2xl shadow-2xl w-full max-w-sm p-6 border border-border" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-4 mb-5">
              <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-red-500/20">
                <Trash2 size={20} className="text-red-400" />
              </div>
              <div>
                <h3 className="font-bold text-text-primary text-lg">Remove Employee</h3>
                <p className="text-xs text-text-secondary/70">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-sm text-text-secondary mb-6">
              Are you sure you want to remove <strong className="text-text-primary">{confirmRemove.name}</strong> ({confirmRemove.role}) from the organization? All their assigned tasks will also be deleted.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setConfirmRemove(null)}
                variant="secondary"
                className="flex-1 py-2.5"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  dispatch({ type: 'REMOVE_EMPLOYEE', payload: { id: confirmRemove.id } })
                  setConfirmRemove(null)
                  if (selectedEmployee?.id === confirmRemove.id) setSelectedEmployee(null)
                }}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white border-transparent transition-colors py-2.5 flex items-center justify-center gap-2"
              >
                <Trash2 size={14} /> Remove
              </Button>
            </div>
          </div>
        </div>
      )}
      {showAIChat && (
        <AIDocumentChat
          onClose={() => { setShowAIChat(false); setSelectedDoc(undefined) }}
          assignedBy="admin"
          assignedByName="Admin"
          preselectedDocId={selectedDoc}
        />
      )}
    </div>
  )
}
