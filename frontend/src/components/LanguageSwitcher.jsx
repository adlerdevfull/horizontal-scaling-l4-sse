import { useI18n } from '../hooks/useI18n'

const opts = [
  { code: 'en', label: 'EN' },
  { code: 'es', label: 'ES' },
  { code: 'pt', label: 'PT' },
]

export default function LanguageSwitcher({ dark = false }) {
  const { locale, setLocale } = useI18n()
  return (
    <div className={`inline-flex rounded-lg p-0.5 border ${dark ? 'border-gray-600 bg-gray-800' : 'border-gray-200 bg-gray-50'}`}>
      {opts.map((o) => (
        <button
          key={o.code}
          type="button"
          onClick={() => setLocale(o.code)}
          className={`px-2.5 py-1 text-xs font-semibold rounded-md transition ${
            locale === o.code
              ? 'bg-blue-600 text-white'
              : dark
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-500 hover:text-gray-800'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
