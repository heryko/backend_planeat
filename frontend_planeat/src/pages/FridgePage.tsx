import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getFridge, addToFridge, removeFromFridge, type FridgeItem } from '../api/fridge'
import { getIngredients, type Ingredient } from '../api/ingredients'
import { useAuth } from '../hooks/useAuth'
import { formatQuantity, formatUnit } from '../utils/format'

function FridgePage() {
  const { user } = useAuth()
  const userId = user?.user_id || 1
  const [showAddForm, setShowAddForm] = useState(false)
  const [ingredientName, setIngredientName] = useState('')
  const [quantity, setQuantity] = useState('')
  const [expirationDate, setExpirationDate] = useState('')
  const [formError, setFormError] = useState('')
  const queryClient = useQueryClient()

  const { data: fridgeItems = [], isLoading: fridgeLoading, error: fridgeError } = useQuery<FridgeItem[]>({
    queryKey: ['fridge', userId],
    queryFn: () => getFridge(userId),
  })

  const { data: ingredients = [] } = useQuery<Ingredient[]>({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  })

  const resolvedIngredient = ingredients.find(
    (i) => i.name.trim().toLowerCase() === ingredientName.trim().toLowerCase()
  )

  const addMutation = useMutation({
    mutationFn: (data: any) => addToFridge(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fridge', userId] })
      setIngredientName('')
      setQuantity('')
      setExpirationDate('')
      setFormError('')
      setShowAddForm(false)
    },
  })

  const removeMutation = useMutation({
    mutationFn: (fridgeId: number) => removeFromFridge(fridgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['fridge', userId] })
    },
  })

  const handleAddIngredient = () => {
    const name = ingredientName.trim()
    const qty = quantity.trim()

    if (!name) {
      setFormError('Wpisz nazwę składnika')
      return
    }
    if (!resolvedIngredient) {
      setFormError('Wybierz składnik z listy')
      return
    }
    if (!qty) {
      setFormError('Wpisz ilość')
      return
    }

    setFormError('')
    addMutation.mutate({
      user_id: userId,
      ingredient_id: Number(resolvedIngredient.ingredient_id),
      quantity: qty,
      expiration_date: expirationDate || null,
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Moja lodówka</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          + Dodaj składnik
        </button>
      </div>

      {showAddForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Dodaj składnik do lodówki</h3>
          <div>
            <input
              list="fridge-ingredients-datalist"
              value={ingredientName}
              onChange={(e) => setIngredientName(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Składnik"
            />
            <datalist id="fridge-ingredients-datalist">
              {ingredients.map((ing) => (
                <option key={ing.ingredient_id} value={ing.name} />
              ))}
            </datalist>
          </div>
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              step="0.01"
              placeholder="Ilość"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={resolvedIngredient?.unit || 'g'}
              disabled
              className="w-24 px-4 py-2 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
              title="Jednostka (z bazy składników)"
            >
              <option value="g">g</option>
              <option value="ml">ml</option>
              <option value="pcs">szt</option>
            </select>
          </div>
          <input
            type="date"
            value={expirationDate}
            onChange={(e) => setExpirationDate(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="flex gap-2">
            <button 
              onClick={handleAddIngredient}
              disabled={addMutation.isPending}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {addMutation.isPending ? 'Dodawanie...' : 'Dodaj'}
            </button>
            <button 
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-gray-300 text-gray-900 rounded-lg font-medium hover:bg-gray-400 transition-colors"
            >
              Anuluj
            </button>
          </div>

          {formError && <div className="text-sm text-red-600">{formError}</div>}
        </div>
      )}

      {fridgeLoading ? (
        <div className="text-center py-12">Ładowanie lodówki...</div>
      ) : fridgeError ? (
        <div className="text-center py-12 text-red-600">{(fridgeError as any)?.message || 'Błąd ładowania lodówki'}</div>
      ) : fridgeItems.length === 0 ? (
        <div className="bg-white rounded-lg p-12 shadow-sm border border-gray-200 text-center">
          <div className="text-6xl mb-4">❄️</div>
          <p className="text-gray-500 text-lg">Twoja lodówka jest pusta</p>
          <p className="text-sm text-gray-400 mt-2">Kliknij "Dodaj składnik" aby zacząć</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-emerald-50">
              <tr>
                <th className="p-4 text-left text-gray-900 font-semibold">Składnik</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Ilość</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Data ważności</th>
                <th className="p-4 text-right text-gray-900 font-semibold">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {fridgeItems.map((item) => {
                const ingredient = ingredients.find((i) => i.ingredient_id === item.ingredient_id)
                const unitLabel = formatUnit(ingredient?.unit)
                const today = new Date()
                today.setHours(0, 0, 0, 0)
                const expires = item.expiration_date ? new Date(item.expiration_date) : null
                if (expires) expires.setHours(0, 0, 0, 0)

                let rowClass = 'hover:bg-gray-50 transition-colors'
                if (expires) {
                  const diffDays = Math.round((expires.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
                  if (diffDays < 0) {
                    rowClass = 'bg-red-50 hover:bg-red-100/50 transition-colors'
                  } else if (diffDays <= 3) {
                    rowClass = 'bg-yellow-50 hover:bg-yellow-100/50 transition-colors'
                  }
                }
                return (
                  <tr key={item.fridge_id} className={rowClass}>
                    <td className="p-4 text-gray-900">{ingredient?.name || `Składnik #${item.ingredient_id}`}</td>
                    <td className="p-4 text-gray-600">
                      {formatQuantity(item.quantity)}{unitLabel ? ` ${unitLabel}` : ''}
                    </td>
                    <td className="p-4 text-gray-600">
                      {item.expiration_date 
                        ? new Date(item.expiration_date).toLocaleDateString('pl-PL')
                        : 'Brak daty'
                      }
                    </td>
                    <td className="p-4 text-right">
                      <button 
                        onClick={() => {
                          if (item.fridge_id) removeMutation.mutate(item.fridge_id)
                        }}
                        disabled={removeMutation.isPending || !item.fridge_id}
                        className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                      >
                        ✖️
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default FridgePage
