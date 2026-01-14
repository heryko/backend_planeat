import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFavorites, deleteFavorite, createFavorite } from '../api/favorites'
import { getRecipes } from '../api/recipes'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

function FavoritesPage() {
  const { user } = useAuth()
  const userId = user?.user_id || 1
  const [selectedRecipe, setSelectedRecipe] = useState<string>('')
  const queryClient = useQueryClient()
  const toast = useToast()

  const { data: favorites, isLoading: favLoading, error: favError } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId),
  })

  const { data: recipes } = useQuery({
    queryKey: ['recipes'],
    queryFn: () => getRecipes(),
  })

  const addMutation = useMutation({
    mutationFn: (recipeId: number) => createFavorite({ recipe_id: recipeId, user_id: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
      setSelectedRecipe('')
      toast.show('Dodano do ulubionych')
    },
    onError: (e: any) => {
      toast.show(e?.message || 'Nie udało się dodać do ulubionych')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (recipeId: number) => deleteFavorite(userId, recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
    },
  })

  const handleAddFavorite = () => {
    if (selectedRecipe) {
      addMutation.mutate(Number(selectedRecipe))
    }
  }

  const favoriteIds = favorites?.map((f: any) => f.recipe_id) || []
  const availableRecipes = recipes?.filter((r: any) => !favoriteIds.includes(r.recipe_id)) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <h1 className="text-4xl font-bold text-gray-900">Ulubione przepisy</h1>

      {/* Add Favorite Form */}
      {availableRecipes.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Dodaj do ulubionych</h2>
          <div className="flex gap-2">
            <select
              value={selectedRecipe}
              onChange={(e) => setSelectedRecipe(e.target.value)}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Wybierz przepis do dodania...</option>
              {availableRecipes.map((recipe: any) => (
                <option key={recipe.recipe_id} value={recipe.recipe_id}>
                  {recipe.title}
                </option>
              ))}
            </select>
            <button
              onClick={handleAddFavorite}
              disabled={!selectedRecipe || addMutation.isPending}
              className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {addMutation.isPending ? 'Dodawanie...' : 'Dodaj ulubione'}
            </button>
          </div>
        </div>
      )}

      {/* Favorites List */}
      {favLoading ? (
        <div className="text-center py-12">Ładowanie ulubionych...</div>
      ) : favError ? (
        <div className="text-center py-12 text-red-600">{(favError as any)?.message || 'Błąd ładowania ulubionych'}</div>
      ) : !favorites || favorites.length === 0 ? (
        <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
          <div className="text-4xl mb-4">❤️</div>
          <p className="text-gray-500">Nie masz jeszcze ulubionych przepisów</p>
          <p className="text-sm text-gray-400 mt-2">Dodaj ulubiony przepis, klikając serce w zakładce Przepisy</p>
        </div>
      ) : (
        <div className="space-y-4">
          {favorites.map((fav: any) => {
            const recipe = recipes?.find((r: any) => r.recipe_id === fav.recipe_id)
            return (
              <div 
                key={fav.favorite_id || fav.recipe_id} 
                className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex gap-4"
              >
                <img 
                  src="https://via.placeholder.com/120" 
                  alt={recipe?.title || 'Recipe'}
                  className="w-32 h-32 rounded-lg object-cover bg-gray-200"
                />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      {recipe ? (
                        <Link
                          to={`/recipes/${recipe.recipe_id}`}
                          className="text-xl font-bold text-gray-900 mb-2 inline-block hover:underline"
                        >
                          {recipe.title}
                        </Link>
                      ) : (
                        <h3 className="text-xl font-bold text-gray-900 mb-2">—</h3>
                      )}
                      <p className="text-gray-600 mb-3">{recipe?.description}</p>
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>📁 {recipe?.category || 'Bez kategorii'}</span>
                        <span>👨‍🍳 Autor #{recipe?.user_id}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteMutation.mutate(fav.recipe_id)}
                        disabled={deleteMutation.isPending}
                        className="text-2xl hover:scale-110 transition-transform disabled:opacity-50"
                        title="Usuń z ulubionych"
                      >
                        ✖️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default FavoritesPage
