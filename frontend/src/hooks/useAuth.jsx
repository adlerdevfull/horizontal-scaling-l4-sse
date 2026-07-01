import { useState, useEffect, createContext, useContext } from 'react'
import { auth } from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      auth.me().then(r => setUser(r.data.data || r.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false))
    } else { setLoading(false) }
  }, [])

  const login = async (email, password) => {
    const res = await auth.login({ email, password })
    const token = res.data.data?.token || res.data.token || res.data.access_token
    if (!token) throw new Error('No token')
    localStorage.setItem('token', token)
    const me = await auth.me()
    setUser(me.data.data || me.data)
  }

  const logout = () => { localStorage.removeItem('token'); setUser(null) }

  return <AuthContext.Provider value={{ user, login, logout, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
