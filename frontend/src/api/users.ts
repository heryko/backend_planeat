import { api } from './index'

export interface User {
  user_id?: number
  username: string
  email: string
  password?: string
  role?: 'user' | 'admin'
  created_at?: string
}

export async function getUsers() {
  const { data } = await api.get<User[]>('/users')
  return data
}

export async function createUser(user: Omit<User, 'user_id' | 'created_at'>) {
  const { data } = await api.post('/users', user)
  return data
}

export async function updateUser(user_id: number, user: Partial<User>) {
  const { data } = await api.put(`/users/${user_id}`, user)
  return data
}

export async function deleteUser(user_id: number) {
  const { data } = await api.delete(`/users/${user_id}`)
  return data
}

export async function changePassword(user_id: number, currentPassword: string, newPassword: string) {
  const { data } = await api.put(`/users/${user_id}/password`, { currentPassword, newPassword })
  return data
}
