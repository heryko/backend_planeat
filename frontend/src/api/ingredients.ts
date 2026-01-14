import { api } from './index'

export interface Ingredient {
  ingredient_id?: number
  name: string
  unit: 'ml' | 'g' | 'pcs'
  capacity: number
}

export async function getIngredients() {
  const { data } = await api.get<Ingredient[]>('/ingredients')
  return data
}

export async function createIngredient(ingredient: Omit<Ingredient, 'ingredient_id'>) {
  const { data } = await api.post('/ingredients', ingredient)
  return data
}
