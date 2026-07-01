import { Routes, Route, Navigate, Outlet, NavLink } from 'react-router-dom'
import { AuthProvider, useAuth } from './hooks/useAuth'
import { Server, LayoutDashboard, Activity, LogOut } from 'lucide-react'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import LoadBalancer from './pages/LoadBalancer'

function Layout() {
  const { user, logout } = useAuth()
  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-4 border-b border-gray-700"><h1 className="text-lg font-bold">⚖️ Load Balancer</h1><p className="text-xs text-gray-400 mt-1">Escalabilidade Horizontal</p></div>
        <nav className="flex-1 p-3 space-y-1">
          {[{ to: '/', icon: LayoutDashboard, label: 'Dashboard' }, { to: '/lb', icon: Server, label: 'Load Balancer' }].map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${isActive ? 'bg-amber-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}><Icon size={18} />{label}</NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-700 flex items-center justify-between"><p className="text-sm">{user?.name}</p><button onClick={logout} className="text-gray-400 hover:text-white"><LogOut size={18} /></button></div>
      </aside>
      <main className="flex-1 overflow-auto p-6 bg-gray-50"><Outlet /></main>
    </div>
  )
}
function Protected({ children }) { const { user, loading } = useAuth(); if (loading) return null; return user ? children : <Navigate to="/login" /> }
export default function App() {
  return (<AuthProvider><Routes><Route path="/login" element={<Login />} /><Route path="/" element={<Protected><Layout /></Protected>}><Route index element={<Dashboard />} /><Route path="lb" element={<LoadBalancer />} /></Route></Routes></AuthProvider>)
}
