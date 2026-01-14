import { createContext } from 'react'

export interface AuthUser {
  user_id: number
  username: string
  email: string
  role: 'user' | 'admin'
}

export interface AuthContextType {
  user: AuthUser | null
  login: (user: AuthUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
