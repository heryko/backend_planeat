import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createUser } from '../api/users'

export function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    if (!username || !email || !password) {
      setError('Wszystkie pola są wymagane')
      return
    }
    if (password.length < 4) {
      setError('Hasło musi mieć min. 4 znaki')
      return
    }
    setLoading(true)
    try {
      await createUser({ username, email, password })
      setSuccess('Konto utworzone! Możesz się zalogować.')
      setTimeout(() => navigate('/login'), 1200)
    } catch (e: any) {
      setError(e?.message || 'Nie udało się utworzyć konta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-emerald-50">
      <form onSubmit={handleSubmit} className="bg-white border border-emerald-100 rounded-2xl shadow-lg p-8 w-full max-w-sm space-y-5">
        <h2 className="text-3xl font-extrabold text-emerald-700 mb-2 text-center">Rejestracja</h2>
        <div className="space-y-2">
          <input
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="Nazwa użytkownika"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
          <input
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="Email"
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
          <input
            className="w-full border border-emerald-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            placeholder="Hasło"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={4}
          />
        </div>
        {error && <div className="text-red-600 text-sm text-center">{error}</div>}
        {success && <div className="text-emerald-700 text-sm text-center">{success}</div>}
        <button
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold text-lg transition"
          type="submit"
          disabled={loading}
        >
          {loading ? 'Tworzenie konta…' : 'Zarejestruj się'}
        </button>
        <div className="text-center text-gray-500 text-sm pt-2">
          Masz już konto? <a href="/login" className="text-emerald-700 hover:underline">Zaloguj się</a>
        </div>
      </form>
    </div>
  )
}
