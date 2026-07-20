import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { useI18n } from '../hooks/useI18n'
import LanguageSwitcher from '../components/LanguageSwitcher'

export default function Login() {
  const { t } = useI18n()
  const [email, setEmail] = useState('admin@platform.test')
  const [password, setPassword] = useState('password')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(email, password)
      navigate('/')
    } catch {
      setError(t('login.error'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-gradient-to-br from-amber-900 to-gray-900">
      <div className="absolute top-4 right-4 z-10 w-40">
        <LanguageSwitcher />
      </div>
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">⚖️</div>
          <h1 className="text-2xl font-bold text-gray-900">{t('login.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('login.subtitle')}</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">{error}</div>}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.email')}</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('login.password')}</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              className="w-full px-3 py-2 border rounded-lg text-sm" />
          </div>
          <button type="submit" disabled={loading}
            className="w-full bg-amber-600 text-white py-2.5 rounded-lg font-medium hover:opacity-90 disabled:opacity-50">
            {loading ? t('login.loading') : t('login.submit')}
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">{t('login.hint')}</p>
      </div>
    </div>
  )
}
