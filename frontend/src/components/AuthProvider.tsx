import { useState } from 'react'
import type { ReactNode } from 'react'
import { AuthContext, type AuthUser } from '../contexts/auth'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)

  const login = (user: AuthUser) => setUser(user)
  const logout = () => setUser(null)

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
