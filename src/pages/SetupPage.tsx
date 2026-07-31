import { Link } from 'react-router-dom'
import Logo from '../components/common/Logo'
import SetupWizard from '../components/setup/SetupWizard'

export default function SetupPage() {
  return (
    <div className="min-h-screen">
      {/* Simple top bar */}
      <header className="bg-surface-elevated border-b border-border px-6 py-4 flex items-center justify-between">
        <Link to="/">
          <Logo size="sm" />
        </Link>
        <div className="flex items-center gap-4">
          <p className="text-sm text-text-secondary">Already have an account?</p>
          <Link to="/admin" className="btn-secondary text-sm py-2 px-4">Sign In</Link>
        </div>
      </header>
      <SetupWizard />
    </div>
  )
}
