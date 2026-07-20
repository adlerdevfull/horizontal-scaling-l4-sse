import LanguageSwitcher from '../components/LanguageSwitcher'
import { useI18n } from '../hooks/useI18n'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
export default function Login() {
  const { t } = useI18n()
  const [email, setEmail] = useState('admin@platform.test')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const handleSubmit = async (e) => { e.preventDefault(); try { await login(email, password); navigate('/') } catch { setError('Error') } }
  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-amber-900 to-gray-900">
      <div className="absolute top-4 right-4 z-10"><LanguageSwitcher /></div>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">⚖️ Load Balancer L4</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded-lg" />
          <button className="w-full bg-amber-600 text-white py-2 rounded-lg hover:bg-amber-700">Entrar</button>
        </form>
      </div>
    </div>
  )
}
