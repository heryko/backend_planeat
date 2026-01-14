import { api } from './index'

export interface FridgeItem {
  fridge_id?: number
  user_id: number
  ingredient_id: number
  quantity: string
  expiration_date?: string | null
  updated_at?: string
}

export async function getFridge(user_id: number) {
  const { data } = await api.get(`/fridge/${user_id}`)
  return data
}

export async function addToFridge(item: Omit<FridgeItem, 'fridge_id' | 'updated_at'>) {
  const { data } = await api.post('/fridge', item)
  return data
}

export async function removeFromFridge(fridge_id: number) {
  const { data } = await api.delete(`/fridge/${fridge_id}`)
  return data
}
