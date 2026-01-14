import { api } from './index'

export interface Favorite {
  user_id: number
  recipe_id: number
}

export async function getFavorites(user_id: number) {
  const { data } = await api.get(`/favorites/${user_id}`)
  return data
}

export async function createFavorite(favorite: Favorite) {
  const { data } = await api.post('/favorites', favorite)
  return data
}

export async function deleteFavorite(user_id: number, recipe_id: number) {
  const { data } = await api.delete(`/favorites/${user_id}/${recipe_id}`)
  return data
}
