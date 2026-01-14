import { useState, type FormEvent } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const DEMO_USERS = [
  { user_id: 0, username: 'admin', email: 'admin@admin.com', password: 'admin', role: 'admin' },
  { user_id: 1, username: 'user', email: 'user@user.com', password: 'user', role: 'user' },
] as const

function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [touched, setTouched] = useState({ id: false, pass: false })
  const [loading, setLoading] = useState(false)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    setTimeout(() => {
      const user = DEMO_USERS.find(
        u => (u.username === identifier || u.email === identifier) && u.password === password
      )
      setLoading(false)
      if (user) {
        login({ user_id: user.user_id, username: user.username, email: user.email, role: user.role })
        navigate('/')
      } else {
        setError('Nieprawidłowa nazwa/email lub hasło')
      }
    }, 500)
  }

  return (
    <div className="auth-page page-fade">
      <div className="auth-grid">
        <section className="auth-hero">
          <div className="auth-hero-content">
            <div className="auth-logo">
              <img
                src="/logo.png"
                alt="PlanEat"
                className="w-14 h-14 object-contain rounded-2xl"
                draggable={false}
              />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight drop-shadow-lg">
              Smaczny porządek w Twojej kuchni
            </h1>
            <p className="text-white/85 text-lg max-w-xl">
              Planuj posiłki, dodawaj przepisy i twórz listy zakupów w jednym miejscu. Zacznij już dziś!
            </p>
            <ul className="space-y-2 text-white/90 font-medium">
              <li className="flex items-center gap-3">🟢 Szybkie logowanie i start</li>
              <li className="flex items-center gap-3">🟢 Podgląd tygodniowego menu</li>
              <li className="flex items-center gap-3">🟢 Lista zakupów zawsze pod ręką</li>
            </ul>
          </div>
        </section>

        <section className="auth-card glass rise-in">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 grid place-items-center">
                <img
                  src="/logo.png"
                  alt="PlanEat"
                  className="w-9 h-9 object-contain rounded-xl"
                  draggable={false}
                />
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-emerald-600 font-semibold">PlanEat</p>
                <p className="text-lg font-bold text-slate-900">Panel logowania</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-slate-900">Witaj ponownie</h2>
              <p className="text-slate-500 text-base">Zaloguj się, aby zarządzać przepisami, planem posiłków i listami zakupów.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="identifier" className="text-sm font-semibold text-slate-700">Nazwa użytkownika lub email</label>
                <div className="relative">
                  <span className="field-icon">@</span>
                  <input
                    id="identifier"
                    className={`input-with-icon w-full px-4 py-3 rounded-2xl border text-base font-medium transition-all focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 bg-white placeholder-slate-400 ${touched.id && !identifier ? 'border-red-300' : 'border-emerald-100'}`}
                    placeholder="np. user lub user@user.com"
                    value={identifier}
                    onChange={e => setIdentifier(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, id: true }))}
                    required
                    autoFocus
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-slate-700">Hasło</label>
                <div className="relative">
                  <span className="field-icon" aria-hidden="true">
                    <img
                      src="/lock.svg"
                      alt=""
                      className="w-5 h-5 object-contain"
                      draggable={false}
                    />
                  </span>
                  <input
                    id="password"
                    className={`input-with-icon w-full px-4 py-3 rounded-2xl border text-base font-medium transition-all focus:ring-4 focus:ring-emerald-200 focus:border-emerald-500 bg-white placeholder-slate-400 ${touched.pass && !password ? 'border-red-300' : 'border-emerald-100'}`}
                    placeholder="Wpisz hasło"
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onBlur={() => setTouched(t => ({ ...t, pass: true }))}
                    required
                    minLength={4}
                    autoComplete="current-password"
                  />
                </div>
              </div>

              {error && (
                <div className="text-red-600 text-sm font-semibold bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{error}</span>
                </div>
              )}

              <button
                className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-lg font-semibold shadow-lg transition-all duration-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed shimmer"
                type="submit"
                disabled={loading || !identifier || !password}
              >
                {loading ? 'Logowanie...' : 'Zaloguj się'}
              </button>
            </form>

            <div className="flex items-center justify-between text-sm text-slate-500">
              <span>Nie masz konta?</span>
              <a href="/register" className="text-emerald-700 font-semibold hover:underline">Zarejestruj się</a>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 bg-emerald-50 border border-emerald-100 rounded-2xl px-4 py-3">
              <span className="font-semibold text-emerald-700">Dane testowe</span>
              <div className="flex gap-3 text-slate-600">
                <span>admin / admin</span>
                <span className="hidden sm:inline">|</span>
                <span>user / user</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default LoginPage
