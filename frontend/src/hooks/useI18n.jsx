import { createContext, useContext, useMemo, useState, useCallback } from 'react'

const messages = {
  "en": {
    "appName": "Scale Platform",
    "appTagline": "L4 LB + SSE",
    "logout": "Log out",
    "language": "Language",
    "login": {
      "title": "Scale Platform",
      "subtitle": "L4 LB + SSE",
      "email": "Email",
      "password": "Password",
      "submit": "Sign in",
      "loading": "Signing in…",
      "error": "Invalid credentials"
    },
    "nav": {
      "home": "Dashboard",
      "lb": "Load balancer"
    },
    "dashboard": "Dashboard"
  },
  "es": {
    "appName": "Plataforma Escalable",
    "appTagline": "LB L4 + SSE",
    "logout": "Cerrar sesión",
    "language": "Idioma",
    "login": {
      "title": "Plataforma Escalable",
      "subtitle": "LB L4 + SSE",
      "email": "Email",
      "password": "Contraseña",
      "submit": "Iniciar sesión",
      "loading": "Entrando…",
      "error": "Credenciales inválidas"
    },
    "nav": {
      "home": "Dashboard",
      "lb": "Load balancer"
    },
    "dashboard": "Dashboard"
  },
  "pt": {
    "appName": "Plataforma Escalável",
    "appTagline": "LB L4 + SSE",
    "logout": "Sair",
    "language": "Idioma",
    "login": {
      "title": "Plataforma Escalável",
      "subtitle": "LB L4 + SSE",
      "email": "Email",
      "password": "Senha",
      "submit": "Entrar",
      "loading": "Entrando…",
      "error": "Credenciais inválidas"
    },
    "nav": {
      "home": "Dashboard",
      "lb": "Load balancer"
    },
    "dashboard": "Dashboard"
  }
}

const I18nContext = createContext(null)

function detect() {
  const saved = localStorage.getItem('locale')
  if (saved && messages[saved]) return saved
  const nav = (navigator.language || 'en').slice(0, 2)
  if (nav === 'es' || nav === 'pt') return nav
  return 'en'
}

export function I18nProvider({ children }) {
  const [locale, setLocaleState] = useState(detect)
  const setLocale = useCallback((next) => {
    setLocaleState(next)
    localStorage.setItem('locale', next)
    document.documentElement.lang = next
  }, [])
  const t = useCallback((key) => {
    const parts = key.split('.')
    let cur = messages[locale]
    for (const p of parts) cur = cur?.[p]
    return typeof cur === 'string' ? cur : key
  }, [locale])
  const value = useMemo(() => ({ locale, setLocale, t, messages: messages[locale] }), [locale, setLocale, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
