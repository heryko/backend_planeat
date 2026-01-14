import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getRecipes } from '../api/recipes'
import { getIngredients } from '../api/ingredients'
import { getRecipeIngredients } from '../api/recipeIngredients'
import { formatDatePL, formatQuantity, formatUnit } from '../utils/format'

export default function RecipeDetailsPage() {
  const params = useParams()
  const recipeId = Number(params.recipeId)

  const { data: recipes = [], isLoading: recipesLoading, error: recipesError } = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  })

  const { data: ingredients = [], isLoading: ingredientsLoading } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  })

  const { data: recipeIngredients = [], isLoading: recipeIngredientsLoading, error: recipeIngredientsError } = useQuery({
    queryKey: ['recipeIngredients', recipeId],
    queryFn: () => getRecipeIngredients(recipeId),
    enabled: Number.isFinite(recipeId) && recipeId > 0,
  })

  if (!Number.isFinite(recipeId) || recipeId <= 0) {
    return (
      <div className="space-y-4">
        <div className="text-red-600">Nieprawidłowy ID przepisu</div>
        <Link to="/recipes" className="text-emerald-700 hover:underline">Wróć do przepisów</Link>
      </div>
    )
  }

  if (recipesLoading || ingredientsLoading || recipeIngredientsLoading) {
    return <div className="text-center py-12">Ładowanie przepisu...</div>
  }

  if (recipesError) {
    return <div className="text-center py-12 text-red-600">{(recipesError as any)?.message || 'Błąd ładowania przepisu'}</div>
  }

  const recipe = Array.isArray(recipes) ? recipes.find((r: any) => Number(r.recipe_id) === recipeId) : undefined

  if (!recipe) {
    return (
      <div className="space-y-4">
        <div className="text-gray-700">Nie znaleziono przepisu #{recipeId}</div>
        <Link to="/recipes" className="text-emerald-700 hover:underline">Wróć do przepisów</Link>
      </div>
    )
  }

  const ingredientById = new Map<number, any>(
    (Array.isArray(ingredients) ? ingredients : []).map((i: any) => [Number(i.ingredient_id), i])
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{recipe.title}</h1>
          <div className="mt-2 flex flex-wrap gap-3 text-sm text-gray-600">
            <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{recipe.category || 'Bez kategorii'}</span>
            {recipe.created_at && <span>Dodano: {formatDatePL(recipe.created_at)}</span>}
            {recipe.user_id && <span>Autor: #{recipe.user_id}</span>}
          </div>
        </div>
        <Link
          to="/recipes"
          className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          ← Wróć
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Opis</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{recipe.description}</p>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Składniki</h2>

          {recipeIngredientsError ? (
            <div className="text-sm text-red-600">{(recipeIngredientsError as any)?.message || 'Błąd ładowania składników'}</div>
          ) : !Array.isArray(recipeIngredients) || recipeIngredients.length === 0 ? (
            <div className="text-sm text-gray-500">Brak składników w bazie dla tego przepisu</div>
          ) : (
            <div className="space-y-2">
              {recipeIngredients.map((ri: any, idx: number) => {
                const ing = ingredientById.get(Number(ri.ingredient_id))
                const qty = formatQuantity(ri.quantity)
                const unit = formatUnit(ing?.unit)
                return (
                  <div key={`${ri.ingredient_id}-${idx}`} className="flex items-center justify-between gap-4">
                    <div className="text-gray-900">
                      {ing?.name || `Składnik #${ri.ingredient_id}`}
                    </div>
                    <div className="text-gray-700 tabular-nums whitespace-nowrap">
                      {qty}{unit ? ` ${unit}` : ''}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
