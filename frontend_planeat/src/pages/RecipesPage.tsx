import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getRecipes, createRecipe } from '../api/recipes'
import { createFavorite, deleteFavorite, getFavorites } from '../api/favorites'
import { getIngredients } from '../api/ingredients'
import { addRecipeIngredient } from '../api/recipeIngredients'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-6 w-6"
      fill={filled ? '#dc2626' : 'none'}
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61c-1.54-1.35-3.78-1.35-5.32 0L12 7.77 8.48 4.61c-1.54-1.35-3.78-1.35-5.32 0-1.78 1.56-1.78 4.09 0 5.65L12 21.35l8.84-11.09c1.78-1.56 1.78-4.09 0-5.65z" />
    </svg>
  )
}

function RecipesPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ title: '', description: '', category: '' })
  const [ingredientRows, setIngredientRows] = useState<
    Array<{ name: string; quantity: string; unit: 'g' | 'ml' | 'pcs' }>
  >([{ name: '', quantity: '1', unit: 'g' }])
  const [ingredientError, setIngredientError] = useState('')
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const { data: recipes, isLoading, error } = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  })

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const rowsToSave = ingredientRows
        .map((row) => ({ name: row.name.trim(), quantity: Number(row.quantity) }))
        .filter((row) => row.name && Number.isFinite(row.quantity) && row.quantity > 0)

      const resolved = rowsToSave.map((row) => {
        const ing = ingredients.find(
          (i: any) => String(i.name).trim().toLowerCase() === row.name.toLowerCase()
        )
        return { ingredient: ing, quantity: row.quantity }
      })

      const hasMissing = resolved.some((r) => !r.ingredient)
      if (hasMissing) {
        throw new Error('Nie znaleziono jednego lub więcej składników w bazie')
      }

      const resolvedOk = resolved.map((r) => {
        if (!r.ingredient) {
          throw new Error('Nie znaleziono jednego lub więcej składników w bazie')
        }
        return { ingredient: r.ingredient as any, quantity: r.quantity }
      })

      const result = await createRecipe({ ...data, user_id: user?.user_id || 1 })
      const recipeId = result?.id ?? result?.recipe_id
      if (!recipeId) throw new Error('Brak ID przepisu z backendu')

      if (resolvedOk.length > 0) {
        await Promise.all(
          resolvedOk.map((r) =>
            addRecipeIngredient({
              recipe_id: recipeId,
              ingredient_id: Number(r.ingredient.ingredient_id),
              quantity: r.quantity,
            })
          )
        )
      }

      return result
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      setFormData({ title: '', description: '', category: '' })
      setIngredientRows([{ name: '', quantity: '1', unit: 'g' }])
      setIngredientError('')
      setShowAddForm(false)
    },
    onError: (e: any) => {
      setIngredientError(e?.message || 'Błąd przy dodawaniu składników')
    },
  })

  const userId = user?.user_id || 1

  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId),
  })

  const favoriteIds = new Set<number>(
    (Array.isArray(favorites) ? favorites : []).map((f: any) => Number(f?.recipe_id)).filter((n) => Number.isFinite(n))
  )

  const favoriteMutation = useMutation({
    mutationFn: (recipeId: number) => createFavorite({ recipe_id: recipeId, user_id: userId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
      toast.show('Dodano do ulubionych')
    },
    onError: (e: any) => {
      const msg = e?.message || 'Nie udało się dodać do ulubionych'
      toast.show(msg)
    },
  })

  const removeFavoriteMutation = useMutation({
    mutationFn: (recipeId: number) => deleteFavorite(userId, recipeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites', userId] })
      toast.show('Usunięto z ulubionych')
    },
    onError: (e: any) => {
      toast.show(e?.message || 'Nie udało się usunąć z ulubionych')
    },
  })

  const filtered = recipes?.filter(r => 
    r.title.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  const handleAddRecipe = () => {
    if (formData.title && formData.description) {
      setIngredientError('')
      createMutation.mutate(formData)
    }
  }

  const handleAddIngredientRow = () => {
    setIngredientRows((prev) => [...prev, { name: '', quantity: '1', unit: 'g' }])
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Przepisy</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          + Dodaj przepis
        </button>
      </div>

      {/* Add Recipe Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Nowy przepis</h3>
          <input
            type="text"
            placeholder="Nazwa przepisu..."
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <textarea
            placeholder="Opis przepisu..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            rows={4}
          />
          <input
            type="text"
            placeholder="Kategoria..."
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />

          {/* Recipe ingredients */}
          <div className="pt-2">
            <h4 className="text-sm font-semibold text-gray-900 mb-2">Składniki</h4>
            <div className="space-y-2">
              {ingredientRows.map((row, index) => {
                return (
                  <div key={index} className="flex gap-2">
                    <div className="flex-1">
                      <input
                        list="recipe-ingredients-datalist"
                        value={row.name}
                        onChange={(e) => {
                          const next = e.target.value
                          setIngredientRows((prev) =>
                            prev.map((r, i) => {
                              if (i !== index) return r
                              const matched = ingredients.find(
                                (ing: any) => String(ing.name).trim().toLowerCase() === next.trim().toLowerCase()
                              )
                              return { ...r, name: next, unit: matched?.unit || r.unit }
                            })
                          )
                        }}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Składnik"
                      />
                    </div>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={row.quantity}
                      onChange={(e) => {
                        const next = e.target.value
                        setIngredientRows((prev) =>
                          prev.map((r, i) => (i === index ? { ...r, quantity: next } : r))
                        )
                      }}
                      className="w-28 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Ilość"
                    />
                    <select
                      value={row.unit}
                      disabled
                      className="w-24 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
                      title="Jednostka (dobierana z bazy składników)"
                    >
                      <option value="g">g</option>
                      <option value="ml">ml</option>
                      <option value="pcs">szt</option>
                    </select>
                  </div>
                )
              })}

              <datalist id="recipe-ingredients-datalist">
                {ingredients.map((ing: any) => (
                  <option key={ing.ingredient_id} value={ing.name} />
                ))}
              </datalist>

              <button
                type="button"
                onClick={handleAddIngredientRow}
                className="mt-2 px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
              >
                + Dodaj kolejny składnik
              </button>

              {ingredientError && <div className="text-sm text-red-600">{ingredientError}</div>}
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={handleAddRecipe}
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {createMutation.isPending ? 'Dodawanie...' : 'Dodaj'}
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Anuluj
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <input
          type="text"
          placeholder="Szukaj przepisu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
        <span className="absolute right-4 top-3 text-gray-400">🔍</span>
      </div>

      {/* Recipes Grid */}
      {isLoading ? (
        <div className="text-center py-12">Ładowanie przepisów...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{(error as any)?.message || 'Błąd ładowania przepisów'}</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">Brak przepisów</div>
      ) : (
        <div className="space-y-4">
          {filtered.map((recipe: any) => (
            <div
              key={recipe.recipe_id}
              className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex gap-4 cursor-pointer"
              onClick={() => navigate(`/recipes/${recipe.recipe_id}`)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') navigate(`/recipes/${recipe.recipe_id}`)
              }}
            >
              <img 
                src="https://via.placeholder.com/120" 
                alt={recipe.title}
                className="w-32 h-32 rounded-lg object-cover bg-gray-200"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{recipe.title}</h3>
                    <p className="text-gray-600 mb-3">{recipe.description}</p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>📁 {recipe.category || 'Bez kategorii'}</span>
                      <span>👨‍🍳 Autor #{recipe.user_id}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      const rid = Number(recipe.recipe_id)
                      if (!Number.isFinite(rid)) return
                      if (favoriteIds.has(rid)) {
                        removeFavoriteMutation.mutate(rid)
                      } else {
                        favoriteMutation.mutate(rid)
                      }
                    }}
                    disabled={favoriteMutation.isPending || removeFavoriteMutation.isPending}
                    className="p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
                    title={favoriteIds.has(Number(recipe.recipe_id)) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                    aria-label={favoriteIds.has(Number(recipe.recipe_id)) ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}
                  >
                    <HeartIcon filled={favoriteIds.has(Number(recipe.recipe_id))} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default RecipesPage
