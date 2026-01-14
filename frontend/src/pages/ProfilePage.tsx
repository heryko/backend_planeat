import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@tanstack/react-query'
import { useAuth } from '../hooks/useAuth'
import { updateUser, deleteUser, changePassword } from '../api/users'

function ProfilePage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const userId = user?.user_id || 1

  const [username, setUsername] = useState(user?.username || '')
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const updateUsernameMutation = useMutation({
    mutationFn: async (newUsername: string) => updateUser(userId, { username: newUsername }),
    onSuccess: () => {
      setMessage('Nazwa użytkownika zaktualizowana!')
      setError('')
    },
    onError: () => {
      setError('Błąd przy aktualizacji nazwy użytkownika')
      setMessage('')
    },
  })

  const deleteAccountMutation = useMutation({
    mutationFn: async () => deleteUser(userId),
    onSuccess: () => {
      logout()
      navigate('/login')
    },
    onError: () => {
      setError('Błąd przy usuwaniu konta')
    },
  })

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      return changePassword(userId, currentPassword, newPassword)
    },
    onSuccess: () => {
      setMessage('Hasło zaktualizowane!')
      setError('')
      setCurrentPassword('')
      setNewPassword('')
      setNewPasswordConfirm('')
    },
    onError: () => {
      setError('Błąd przy zmianie hasła')
      setMessage('')
    },
  })

  const handleUpdateUsername = () => {
    if (username.trim() && username !== user?.username) {
      updateUsernameMutation.mutate(username)
    }
  }

  const handleDeleteAccount = () => {
    if (window.confirm('Czy na pewno chcesz usunąć swoje konto? Ta operacja jest nieodwracalna.')) {
      deleteAccountMutation.mutate()
    }
  }

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) {
      setError('Wpisz obecne i nowe hasło')
      setMessage('')
      return
    }
    if (newPassword !== newPasswordConfirm) {
      setError('Nowe hasła nie są takie same')
      setMessage('')
      return
    }
    changePasswordMutation.mutate()
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Ustawienia profilu</h1>
        <p className="text-gray-600">Zarządzaj swoim kontem</p>
      </div>

      {message && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-emerald-700">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          ✕ {error}
        </div>
      )}

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Informacje o profilu</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nazwa użytkownika</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={handleUpdateUsername}
                disabled={updateUsernameMutation.isPending || username === user?.username}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {updateUsernameMutation.isPending ? 'Zmiana...' : 'Zmień'}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Zmiana hasła</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Obecne hasło</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoComplete="current-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nowe hasło</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Powtórz nowe hasło</label>
            <input
              type="password"
              value={newPasswordConfirm}
              onChange={(e) => setNewPasswordConfirm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              autoComplete="new-password"
            />
          </div>

          <button
            onClick={handleChangePassword}
            disabled={changePasswordMutation.isPending}
            className="w-full px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {changePasswordMutation.isPending ? 'Zmiana...' : 'Zmień hasło'}
          </button>
        </div>
      </div>

      <div className="bg-red-50 rounded-lg p-6 shadow-sm border border-red-200">
        <h2 className="text-xl font-semibold text-red-800 mb-4">Strefa niebezpieczna</h2>
        <p className="text-sm text-red-700 mb-4">Usunięcie konta jest nieodwracalne.</p>
        <button
          onClick={handleDeleteAccount}
          disabled={deleteAccountMutation.isPending}
          className="w-full px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {deleteAccountMutation.isPending ? 'Usuwanie...' : 'Usuń konto'}
        </button>
      </div>
    </div>
  )
}

export default ProfilePage
