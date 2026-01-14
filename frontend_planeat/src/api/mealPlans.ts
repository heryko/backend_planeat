import { api } from './index'

export interface MealPlan {
  plan_id?: number
  user_id: number
  name: string
  plan_date: string
  created_at?: string
}

export async function getMealPlans(user_id: number) {
  const { data } = await api.get(`/meal_plans/${user_id}`)
  return data
}

export async function createMealPlan(plan: Omit<MealPlan, 'plan_id' | 'created_at'>) {
  const { data } = await api.post('/meal_plans', plan)
  return data
}

export async function updateMealPlan(plan_id: number, patch: Pick<MealPlan, 'name' | 'plan_date'>) {
  const { data } = await api.put(`/meal_plans/${plan_id}`, patch)
  return data
}

export async function deleteMealPlan(plan_id: number) {
  const { data } = await api.delete(`/meal_plans/${plan_id}`)
  return data
}
