import { api } from './index'

export interface ShoppingList {
  list_id?: number
  user_id: number
  plan_id?: number | null
  name?: string
  created_at?: string
}

export interface ShoppingItem {
  si_id?: number
  list_id: number
  ingredient_id: number
  quantity: number
}

export async function getShoppingLists(user_id: number) {
  const { data } = await api.get(`/shopping_list/${user_id}`)
  return data
}

export async function getShoppingItems(list_id: number) {
  const { data } = await api.get(`/shopping_items/${list_id}`)
  return data
}

export async function createShoppingList(list: Omit<ShoppingList, 'list_id' | 'created_at'>) {
  const { data } = await api.post('/shopping_list', list)
  return data
}

export async function createShoppingItem(item: ShoppingItem) {
  const { data } = await api.post('/shopping_items', item)
  return data
}

export async function deleteShoppingList(list_id: number) {
  const { data } = await api.delete(`/shopping_list/${list_id}`)
  return data
}

export async function deleteShoppingItem(itemId: number) {
  const { data } = await api.delete(`/shopping_items/${itemId}`)
  return data
}
