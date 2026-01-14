import { api } from './index'

export interface RecipeIngredient {
  recipe_id: number
  ingredient_id: number
  quantity: number
  name?: string
  unit?: string
}

export async function getRecipeIngredients(recipe_id: number) {
  const { data } = await api.get(`/recipe_ingredients/${recipe_id}`)
  return data
}

export async function addRecipeIngredient(ingredient: RecipeIngredient) {
  const { data } = await api.post('/recipe_ingredients', ingredient)
  return data
}
