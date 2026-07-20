import { useI18n } from '../hooks/useI18n'

const opts = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
]

/** Visible EN | ES | PT control — dark=true for sidebar */
export default function LanguageSwitcher({ dark = false }) {
  const { locale, setLocale, t } = useI18n()
  return (
    <div className="w-full">
      <p className={`text-[10px] uppercase tracking-wide mb-1 ${dark ? 'text-gray-500' : 'text-gray-400'}`}>
        {t('language')}
      </p>
      <div className={`inline-flex w-full rounded-lg p-0.5 border ${dark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
        {opts.map((o) => (
          <button
            key={o.code}
            type="button"
            onClick={() => setLocale(o.code)}
            className={`flex-1 px-2 py-1.5 text-xs font-bold rounded-md transition ${
              locale === o.code
                ? 'bg-blue-600 text-white shadow'
                : dark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  )
}
