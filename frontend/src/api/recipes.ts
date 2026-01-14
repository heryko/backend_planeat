import { api } from './index'

export interface Recipe {
  recipe_id?: number
  user_id: number
  title: string
  category?: string
  description: string
  created_at?: string
}

export async function getRecipes() {
  const { data } = await api.get<Recipe[]>('/recipes')
  return data
}

export async function createRecipe(recipe: Omit<Recipe, 'recipe_id' | 'created_at'>) {
  const { data } = await api.post('/recipes', {
    name: recipe.title,
    description: recipe.description,
    user_id: recipe.user_id,
    category: recipe.category,
  })
  return data
}
