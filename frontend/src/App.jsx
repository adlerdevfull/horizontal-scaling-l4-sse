import LanguageSwitcher from './components/LanguageSwitcher'
import { useI18n } from './hooks/useI18n'
import { Routes, Route, Navigate, Outlet, NavLink } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Server, LayoutDashboard, Activity, LogOut } from 'lucide-react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LoadBalancer from './pages/LoadBalancer'

function Layout() {
  const { user, logout } = useAuth()
  const { t, locale } = useI18n()
  const nav = [
    { to: '/', icon: LayoutDashboard, label: t('nav.home') },
    { to: '/lb', icon: Server, label: t('nav.lb') }
  ]
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-lg font-bold">⚖️ {t('appName')}</h1>
          <p className="text-xs text-gray-400 mt-1">{t('appTagline')}</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {nav.map(({ to, icon: Icon, label }) => (
            <NavLink key={`${to}-${locale}`} to={to} end={to === '/'} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <Icon size={18} />{label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 pb-3"><LanguageSwitcher dark /></div>
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-gray-400">{user?.email}</p>
          </div>
          <button onClick={logout} className="text-gray-400 hover:text-white" title={t('logout')}><LogOut size={18} /></button>
        </div>
      </aside>
      <main className="flex-1 overflow-auto p-6 bg-gray-50"><Outlet /></main>
    </div>
  )
}
function Protected({ children }) { const { user, loading } = useAuth(); if (loading) return null; return user ? children : <Navigate to="/login" /> }
export default function App() {
  return (<AuthProvider><Routes><Route path="/login" element={<Login />} /><Route path="/" element={<Protected><Layout /></Protected>}><Route index element={<Dashboard />} /><Route path="lb" element={<LoadBalancer />} /></Route></Routes></AuthProvider>)
}
