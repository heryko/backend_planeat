import { api } from './index'

export interface MealPlanRecipe {
  plan_id: number
  recipe_id: number
  meal_time: number
}

export async function getMealPlanRecipes(plan_id: number) {
  const { data } = await api.get(`/meal_plan_recipes/${plan_id}`)
  return data
}

export async function addMealPlanRecipe(recipe: MealPlanRecipe) {
  const { data } = await api.post('/meal_plan_recipes', recipe)
  return data
}
