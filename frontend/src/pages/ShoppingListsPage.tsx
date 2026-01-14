import { useEffect, useMemo, useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getShoppingItems,
  createShoppingItem,
  deleteShoppingItem,
  getShoppingLists,
  createShoppingList,
  deleteShoppingList,
} from '../api/shoppingLists'
import { getIngredients } from '../api/ingredients'
import { getMealPlans } from '../api/mealPlans'
import { getMealPlanRecipes } from '../api/mealPlanRecipes'
import { getRecipeIngredients } from '../api/recipeIngredients'
import { useAuth } from '../hooks/useAuth'
import { formatDatePL, formatQuantity, formatUnit } from '../utils/format'

function ShoppingListsPage() {
  const [ingredientName, setIngredientName] = useState('')
  const [newQuantity, setNewQuantity] = useState('1')
  const [unit, setUnit] = useState<'g' | 'ml' | 'pcs'>('g')
  const [formError, setFormError] = useState('')
  const [selectedListId, setSelectedListId] = useState<number | ''>('')
  const [selectedPlanId, setSelectedPlanId] = useState<string>('')
  const [newListName, setNewListName] = useState('')
  const [localListNames, setLocalListNames] = useState<Record<number, string>>({})
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const userId = user?.user_id || 1

  const listNamesStorageKey = `planeat:shoppingListNames:${userId}`

  useEffect(() => {
    try {
      const raw = localStorage.getItem(listNamesStorageKey)
      if (!raw) {
        setLocalListNames({})
        return
      }
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed === 'object') {
        setLocalListNames(parsed)
      } else {
        setLocalListNames({})
      }
    } catch {
      setLocalListNames({})
    }
  }, [listNamesStorageKey])

  useEffect(() => {
    try {
      localStorage.setItem(listNamesStorageKey, JSON.stringify(localListNames))
    } catch {
      // Ignore
    }
  }, [localListNames, listNamesStorageKey])

  const { data: lists = [] } = useQuery({
    queryKey: ['shoppingLists', userId],
    queryFn: () => getShoppingLists(userId),
  })

  useEffect(() => {
    if (!Array.isArray(lists) || lists.length === 0) return
    const incoming: Record<number, string> = {}
    for (const l of lists) {
      const id = Number((l as any)?.list_id)
      const nm = String((l as any)?.name || '').trim()
      if (Number.isFinite(id) && id > 0 && nm) incoming[id] = nm
    }
    if (Object.keys(incoming).length === 0) return
    setLocalListNames((prev) => ({ ...prev, ...incoming }))
  }, [lists])

  useEffect(() => {
    if (selectedListId) return
    if (Array.isArray(lists) && lists.length > 0) {
      setSelectedListId(Number(lists[0].list_id))
    }
  }, [lists, selectedListId])

  const { data: items = [], isLoading, error } = useQuery({
    queryKey: ['shoppingItems', selectedListId],
    queryFn: () => getShoppingItems(Number(selectedListId)),
    enabled: Boolean(selectedListId),
  })

  const { data: ingredients = [] } = useQuery({
    queryKey: ['ingredients'],
    queryFn: getIngredients,
  })

  const { data: mealPlans = [] } = useQuery({
    queryKey: ['mealPlans', userId],
    queryFn: () => getMealPlans(userId),
  })

  const allPlans = useMemo(() => {
    return (Array.isArray(mealPlans) ? mealPlans : [])
      .slice()
      .sort((a: any, b: any) => {
        const ad = String(a?.plan_date || '')
        const bd = String(b?.plan_date || '')
        if (ad !== bd) return ad > bd ? -1 : 1
        const an = String(a?.name || '')
        const bn = String(b?.name || '')
        return an > bn ? 1 : -1
      })
  }, [mealPlans])

  const resolvedIngredient = ingredients.find(
    (i: any) => String(i.name).trim().toLowerCase() === ingredientName.trim().toLowerCase()
  )

  const addMutation = useMutation({
    mutationFn: (data: any) => createShoppingItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingItems', selectedListId] })
      setIngredientName('')
      setNewQuantity('1')
      setFormError('')
    },
  })

  const createListMutation = useMutation({
    mutationFn: async (payload: { user_id: number; name?: string }) => {
      return createShoppingList({ user_id: payload.user_id, plan_id: null, name: payload.name })
    },
    onSuccess: (data: any, vars) => {
      queryClient.invalidateQueries({ queryKey: ['shoppingLists', userId] })
      const nextId = Number(data?.id)
      if (Number.isFinite(nextId) && nextId > 0) setSelectedListId(nextId)
      if (Number.isFinite(nextId) && nextId > 0 && vars?.name) {
        setLocalListNames((prev) => ({ ...prev, [nextId]: String(vars.name) }))
      }
      setNewListName('')
      setFormError('')
    },
    onError: (err: any) => {
      setFormError(err?.message || 'Nie udało się utworzyć listy zakupów')
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (itemId: number) => deleteShoppingItem(itemId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingItems', selectedListId] })
    },
  })

  const deleteListMutation = useMutation({
    mutationFn: async (listId: number) => deleteShoppingList(listId),
    onSuccess: (_data, deletedId) => {
      const remaining = (Array.isArray(lists) ? lists : []).filter((l: any) => Number(l.list_id) !== Number(deletedId))
      setSelectedListId(remaining.length > 0 ? Number(remaining[0].list_id) : '')
      setLocalListNames((prev) => {
        const next = { ...prev }
        delete next[Number(deletedId)]
        return next
      })

      queryClient.invalidateQueries({ queryKey: ['shoppingLists', userId] })
      queryClient.invalidateQueries({ queryKey: ['shoppingItems', deletedId] })
      setFormError('')
    },
    onError: (err: any) => {
      setFormError(err?.message || 'Nie udało się usunąć listy zakupów')
    },
  })

  const addFromPlanDayMutation = useMutation({
    mutationFn: async (payload: { list_id: number; plan_ids: number[] }) => {
      const planRecipesArrays = await Promise.all(payload.plan_ids.map((pid) => getMealPlanRecipes(pid)))
      const planRecipes = planRecipesArrays.flatMap((arr: any) => (Array.isArray(arr) ? arr : []))

      const recipeIds = Array.from(
        new Set(planRecipes.map((mpr: any) => Number(mpr?.recipe_id)).filter((n: any) => Number.isFinite(n) && n > 0))
      )

      const recipeIngredientsArrays = await Promise.all(recipeIds.map((rid) => getRecipeIngredients(rid)))
      const allRecipeIngredients = recipeIngredientsArrays.flatMap((arr: any) => (Array.isArray(arr) ? arr : []))

      const agg = new Map<number, number>()
      for (const ri of allRecipeIngredients) {
        const ingId = Number(ri?.ingredient_id)
        if (!Number.isFinite(ingId) || ingId <= 0) continue
        const qty = Number(ri?.quantity)
        const nextQty = (Number.isFinite(qty) ? qty : 1) + (agg.get(ingId) || 0)
        agg.set(ingId, nextQty)
      }

      for (const [ingredient_id, quantity] of agg.entries()) {
        await createShoppingItem({
          list_id: payload.list_id,
          ingredient_id,
          quantity: Number(quantity) || 1,
        })
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['shoppingItems', selectedListId] })
      setFormError('')
    },
    onError: (err: any) => {
      setFormError(err?.message || 'Nie udało się dodać składników z planu dnia')
    },
  })

  const handleAddItem = () => {
    if (!selectedListId) {
      setFormError('Wybierz listę zakupów')
      return
    }
    if (!ingredientName.trim()) {
      setFormError('Wpisz nazwę składnika')
      return
    }
    if (!resolvedIngredient) {
      setFormError('Wybierz składnik z listy')
      return
    }

    setFormError('')
    if (resolvedIngredient) {
      addMutation.mutate({
        list_id: Number(selectedListId),
        ingredient_id: Number(resolvedIngredient.ingredient_id),
        quantity: Number(newQuantity) || 1,
      })
    }
  }

  const ingredientById = useMemo(() => {
    return new Map<number, any>((Array.isArray(ingredients) ? ingredients : []).map((i: any) => [Number(i.ingredient_id), i]))
  }, [ingredients])

  const handleExport = () => {
    if (!selectedListId) return
    const text = items.map((item: any) => {
      const ing = ingredientById.get(Number(item.ingredient_id))
      const itemUnit = ing?.unit ? ` ${formatUnit(ing.unit)}` : ''
      return `${ing?.name || 'Składnik'} - ${formatQuantity(item.quantity)}${itemUnit}`
    }).join('\n')
    const element = document.createElement('a')
    element.setAttribute('href', `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`)
    element.setAttribute('download', `lista_zakupow_${new Date().toISOString().split('T')[0]}.txt`)
    element.style.display = 'none'
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddItem()
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Lista zakupów</h1>
        {items.length > 0 && (
          <button 
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            📥 Eksportuj listę
          </button>
        )}
      </div>

      {/* Add Item Form */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <select
            value={selectedListId}
            onChange={(e) => setSelectedListId(e.target.value ? Number(e.target.value) : '')}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            title="Lista zakupów"
          >
            {Array.isArray(lists) && lists.length > 0 ? (
              lists.map((l: any) => (
                <option key={l.list_id} value={l.list_id}>
                  {String(l.name || '').trim() || String(localListNames[Number(l.list_id)] || '').trim()
                    ? String(l.name || localListNames[Number(l.list_id)] || '').trim()
                    : `Lista zakupów (${l.created_at ? new Date(l.created_at).toLocaleDateString('pl-PL') : 'bez nazwy'})`}
                </option>
              ))
            ) : (
              <option value="">Brak list zakupów</option>
            )}
          </select>

          <button
            onClick={() => {
              if (!selectedListId) return
              const selected = (Array.isArray(lists) ? lists : []).find((l: any) => Number(l.list_id) === Number(selectedListId))
              const label = String(selected?.name || localListNames[Number(selectedListId)] || '').trim()
              const pretty = label || 'tę listę zakupów'
              if (!window.confirm(`Na pewno usunąć ${pretty}?`)) return
              deleteListMutation.mutate(Number(selectedListId))
            }}
            disabled={!selectedListId || deleteListMutation.isPending}
            className="px-4 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
            title="Usuń wybraną listę zakupów"
          >
            {deleteListMutation.isPending ? 'Usuwanie...' : 'Usuń listę'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            title="Plan posiłków"
          >
            <option value="">Wybierz plan...</option>
            {allPlans.map((p: any) => (
              <option key={p.plan_id} value={String(p.plan_id)}>
                {String(p.name || 'Plan')} — {formatDatePL(p.plan_date)}
              </option>
            ))}
          </select>

          <button
            onClick={() => {
              if (!selectedListId) {
                setFormError('Wybierz listę zakupów')
                return
              }
              const pid = Number(selectedPlanId)
              if (!pid || !Number.isFinite(pid)) {
                setFormError('Wybierz plan')
                return
              }
              addFromPlanDayMutation.mutate({ list_id: Number(selectedListId), plan_ids: [pid] })
            }}
            disabled={!selectedListId || !selectedPlanId || addFromPlanDayMutation.isPending}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            title="Dodaj składniki z planu"
          >
            {addFromPlanDayMutation.isPending ? 'Dodawanie...' : 'Dodaj z planu'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-2 mb-4">
          <input
            type="text"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            placeholder="Nazwa nowej listy zakupów..."
            className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            onClick={() => {
              createListMutation.mutate({ user_id: userId, name: newListName.trim() || undefined })
            }}
            disabled={createListMutation.isPending}
            className="px-6 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-black transition-colors disabled:opacity-50"
            title="Utwórz nową listę zakupów"
          >
            {createListMutation.isPending ? 'Tworzenie...' : '+ Nowa lista'}
          </button>
        </div>

        <div className="flex gap-2">
          <div className="flex-1">
            <input
              list="ingredients-datalist"
              value={ingredientName}
              onChange={(e) => {
                const next = e.target.value
                setIngredientName(next)
                const match = ingredients.find(
                  (i: any) => String(i.name).trim().toLowerCase() === next.trim().toLowerCase()
                )
                if (match?.unit) setUnit(match.unit)
              }}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
              placeholder="Składnik"
            />
            <datalist id="ingredients-datalist">
              {ingredients.map((ing: any) => (
                <option key={ing.ingredient_id} value={ing.name} />
              ))}
            </datalist>
          </div>
          <input
            type="text"
            placeholder="Ilość"
            value={newQuantity}
            onChange={(e) => setNewQuantity(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-24 px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <select
            value={unit}
            disabled
            onKeyPress={handleKeyPress}
            className="w-28 px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-600"
            title="Jednostka (dobierana z bazy składników)"
          >
            <option value="g">g</option>
            <option value="ml">ml</option>
            <option value="pcs">szt</option>
          </select>
          <button 
            onClick={handleAddItem}
            disabled={addMutation.isPending}
            className="px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {addMutation.isPending ? 'Dodawanie...' : 'Dodaj'}
          </button>
        </div>

        {formError && (
          <div className="mt-3 text-sm text-red-600">{formError}</div>
        )}
      </div>

      {/* Shopping Items List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {isLoading ? (
          <div className="text-center py-12">Ładowanie listy zakupów...</div>
        ) : error ? (
          <div className="text-center py-12 text-red-600">{(error as any)?.message || 'Błąd ładowania listy zakupów'}</div>
        ) : !selectedListId ? (
          <div className="text-center py-12 text-gray-500">
            Brak wybranej listy zakupów. Utwórz nową listę powyżej.
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            Twoja lista jest pusta - dodaj produkty aby zacząć
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {items.map((item: any) => (
              <div
                key={item.si_id || item.shopping_item_id || item.id}
                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
              >
                <span className="flex-1 text-gray-900">
                  <span className="font-medium">
                    {ingredientById.get(Number(item.ingredient_id))?.name || 'Składnik'}
                  </span>
                  <span className="text-gray-500 ml-2">
                    {(() => {
                      const u = formatUnit(ingredientById.get(Number(item.ingredient_id))?.unit)
                      return `(${formatQuantity(item.quantity)}${u ? ` ${u}` : ''})`
                    })()}
                  </span>
                </span>
                <button 
                  onClick={() => deleteMutation.mutate(item.si_id || item.shopping_item_id || item.id)}
                  disabled={deleteMutation.isPending}
                  className="text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                >
                  ✖️
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ShoppingListsPage
