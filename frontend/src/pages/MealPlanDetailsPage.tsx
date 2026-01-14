import { Link, useSearchParams } from 'react-router-dom'
import { useMutation, useQueries, useQuery, useQueryClient } from '@tanstack/react-query'
import { getMealPlans, updateMealPlan } from '../api/mealPlans'
import { getMealPlanRecipes, addMealPlanRecipe } from '../api/mealPlanRecipes'
import { getRecipes } from '../api/recipes'
import { useAuth } from '../hooks/useAuth'
import { formatDatePL, toISODateOnly } from '../utils/format'
import { useMemo, useState } from 'react'

function parseDateOnly(input: string | null): Date | null {
  if (!input) return null
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return null
  return d
}

function formatWeekdayPL(dateLike: unknown): string {
  const d = new Date(String(dateLike))
  if (Number.isNaN(d.getTime())) return ''
  const raw = new Intl.DateTimeFormat('pl-PL', { weekday: 'long' }).format(d)
  return raw ? raw.charAt(0).toUpperCase() + raw.slice(1) : ''
}

export default function MealPlanDetailsPage() {
  const { user } = useAuth()
  const userId = user?.user_id || 1
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()

  const name = searchParams.get('name') || ''
  const startStr = searchParams.get('start')
  const endStr = searchParams.get('end')

  const startDate = parseDateOnly(startStr)
  const endDate = parseDateOnly(endStr) || startDate

  const { data: plans = [], isLoading: plansLoading, error: plansError } = useQuery({
    queryKey: ['mealPlans', userId],
    queryFn: () => getMealPlans(userId),
  })

  const { data: recipes = [] } = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  })

  const plansInRange = useMemo(() => {
    if (!Array.isArray(plans) || !startDate) return [] as any[]

    const startKey = toISODateOnly(new Date(startDate))
    const endKey = endDate ? toISODateOnly(new Date(endDate)) : startKey

    return plans
      .filter((p: any) => {
        if (name && String(p?.name) !== name) return false
        const d = String(p?.plan_date || '').slice(0, 10)
        return d >= startKey && d <= endKey
      })
      .sort((a: any, b: any) => (String(a?.plan_date) > String(b?.plan_date) ? 1 : -1))
  }, [plans, name, startDate, endDate])

  const recipesById = useMemo(() => {
    return new Map<number, any>((Array.isArray(recipes) ? recipes : []).map((r: any) => [Number(r.recipe_id), r]))
  }, [recipes])

  const planRecipesQueries = useQueries({
    queries: plansInRange.map((p: any) => ({
      queryKey: ['mealPlanRecipes', p.plan_id],
      queryFn: () => getMealPlanRecipes(Number(p.plan_id)),
      enabled: Boolean(p?.plan_id),
    })),
  })

  const [selectedRecipeIdByPlan, setSelectedRecipeIdByPlan] = useState<Record<number, string>>({})
  const [mealTimeByPlan, setMealTimeByPlan] = useState<Record<number, string>>({})

  const MEAL_SLOTS: Array<{ id: number; label: string }> = useMemo(
    () => [
      { id: 1, label: 'Śniadanie' },
      { id: 2, label: 'Lunch' },
      { id: 3, label: 'Obiad' },
      { id: 4, label: 'Podwieczorek' },
      { id: 5, label: 'Kolacja' },
    ],
    []
  )

  const mealSlotLabel = (mealTime: unknown) => {
    const n = Number(mealTime)
    const slot = MEAL_SLOTS.find((s) => s.id === n)
    return slot ? slot.label : `Inna pora (${String(mealTime)})`
  }

  const addRecipeMutation = useMutation({
    mutationFn: async (payload: { plan_id: number; recipe_id: number; meal_time: number }) => {
      return addMealPlanRecipe(payload)
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: ['mealPlanRecipes', vars.plan_id] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: async (payload: { plan_id: number; name: string; plan_date: string }) => {
      return updateMealPlan(payload.plan_id, { name: payload.name, plan_date: payload.plan_date })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans', userId] })
    },
  })

  if (!startDate) {
    return (
      <div className="space-y-4">
        <div className="text-gray-700">Brakuje parametrów planu (start/end/name).</div>
        <Link to="/meal-plans" className="text-emerald-700 hover:underline">Wróć do planów</Link>
      </div>
    )
  }

  if (plansLoading) return <div className="text-center py-12">Ładowanie planu...</div>
  if (plansError) return <div className="text-center py-12 text-red-600">{(plansError as any)?.message || 'Błąd ładowania planu'}</div>

  const title = name || 'Plan posiłków'
  const isMultiDay = Boolean(endDate && toISODateOnly(endDate) !== toISODateOnly(startDate))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">{title}</h1>
          <div className="mt-2 text-sm text-gray-600">
            {formatDatePL(startDate)}{endDate && toISODateOnly(endDate) !== toISODateOnly(startDate) ? ` — ${formatDatePL(endDate)}` : ''}
          </div>
        </div>
        <Link
          to="/meal-plans"
          className="px-4 py-2 bg-gray-100 text-gray-900 rounded-lg font-medium hover:bg-gray-200 transition-colors"
        >
          ← Wróć
        </Link>
      </div>

      {plansInRange.length === 0 ? (
        <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">Nie znaleziono planów w tym zakresie</div>
      ) : (
        <div className="space-y-6">
          {plansInRange.map((p: any, idx: number) => {
            const query = planRecipesQueries[idx]
            const planRecipes = Array.isArray(query.data) ? query.data : []
            const planId = Number(p.plan_id)
            const weekdayTitle = formatWeekdayPL(p.plan_date)

            const groupedBySlot = (() => {
              const groups = new Map<number, any[]>()
              const others: any[] = []
              for (const mpr of planRecipes) {
                const mt = Number(mpr?.meal_time)
                if (MEAL_SLOTS.some((s) => s.id === mt)) {
                  groups.set(mt, [...(groups.get(mt) || []), mpr])
                } else {
                  others.push(mpr)
                }
              }
              return { groups, others }
            })()

            return (
              <div key={planId} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm text-gray-500">{formatDatePL(p.plan_date)}</div>
                    <div className="text-xl font-bold text-gray-900">{isMultiDay ? weekdayTitle : p.name}</div>
                  </div>

                  <button
                    onClick={() => {
                      const nextName = window.prompt('Nowa nazwa planu:', String(p.name || ''))
                      if (!nextName) return
                      const nextDate = window.prompt('Nowa data (YYYY-MM-DD):', String(p.plan_date || '').slice(0, 10))
                      if (!nextDate) return
                      updateMutation.mutate({ plan_id: planId, name: nextName, plan_date: nextDate })
                    }}
                    className="px-3 py-2 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                    disabled={updateMutation.isPending}
                    title="Edytuj"
                  >
                    Edytuj
                  </button>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-semibold text-gray-900">Przepisy w tym dniu</div>

                  {query.isLoading ? (
                    <div className="text-sm text-gray-500">Ładowanie przepisów...</div>
                  ) : query.error ? (
                    <div className="text-sm text-red-600">{(query.error as any)?.message || 'Błąd ładowania przepisów planu'}</div>
                  ) : planRecipes.length === 0 ? (
                    <div className="text-sm text-gray-500">Brak przypisanych przepisów</div>
                  ) : (
                    <div className="space-y-3">
                      {MEAL_SLOTS.map((slot) => {
                        const slotItems = groupedBySlot.groups.get(slot.id) || []
                        return (
                          <div key={slot.id} className="rounded border border-gray-100">
                            <div className="px-3 py-2 bg-gray-50 text-sm font-semibold text-gray-900">{slot.label}</div>
                            {slotItems.length === 0 ? (
                              <div className="px-3 py-2 text-sm text-gray-500">Brak</div>
                            ) : (
                              <div className="divide-y divide-gray-200">
                                {slotItems.map((mpr: any, j: number) => {
                                  const r = recipesById.get(Number(mpr.recipe_id))
                                  const rid = Number(mpr.recipe_id)
                                  return (
                                    <div key={`${mpr.mpr_id || j}`} className="py-2 px-3 flex items-center justify-between gap-4">
                                      <div className="text-gray-900">
                                        {Number.isFinite(rid) ? (
                                          <Link to={`/recipes/${rid}`} className="hover:underline text-emerald-800">
                                            {r?.title || `Przepis #${rid}`}
                                          </Link>
                                        ) : (
                                          <span>{r?.title || `Przepis #${mpr.recipe_id}`}</span>
                                        )}
                                        {r?.category ? <span className="text-gray-500"> · {r.category}</span> : null}
                                      </div>
                                    </div>
                                  )
                                })}
                              </div>
                            )}
                          </div>
                        )
                      })}

                      {groupedBySlot.others.length > 0 && (
                        <div className="rounded border border-gray-100">
                          <div className="px-3 py-2 bg-gray-50 text-sm font-semibold text-gray-900">Inne</div>
                          <div className="divide-y divide-gray-200">
                            {groupedBySlot.others.map((mpr: any, j: number) => {
                              const r = recipesById.get(Number(mpr.recipe_id))
                              const rid = Number(mpr.recipe_id)
                              return (
                                <div key={`other-${mpr.mpr_id || j}`} className="py-2 px-3 flex items-center justify-between gap-4">
                                  <div className="text-gray-900">
                                    {Number.isFinite(rid) ? (
                                      <Link to={`/recipes/${rid}`} className="hover:underline text-emerald-800">
                                        {r?.title || `Przepis #${rid}`}
                                      </Link>
                                    ) : (
                                      <span>{r?.title || `Przepis #${mpr.recipe_id}`}</span>
                                    )}
                                    <span className="text-gray-500"> · {mealSlotLabel(mpr.meal_time)}</span>
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-2">
                  <div className="text-sm font-semibold text-gray-900 mb-2">Dodaj przepis</div>
                  <div className="flex flex-col md:flex-row gap-2">
                    <select
                      value={selectedRecipeIdByPlan[planId] || ''}
                      onChange={(e) => setSelectedRecipeIdByPlan((prev) => ({ ...prev, [planId]: e.target.value }))}
                      className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    >
                      <option value="">Wybierz przepis...</option>
                      {(Array.isArray(recipes) ? recipes : []).map((r: any) => (
                        <option key={r.recipe_id} value={r.recipe_id}>
                          {r.title}
                        </option>
                      ))}
                    </select>

                    <select
                      value={mealTimeByPlan[planId] || '3'}
                      onChange={(e) => setMealTimeByPlan((prev) => ({ ...prev, [planId]: e.target.value }))}
                      className="w-48 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      title="Pora dnia"
                    >
                      {MEAL_SLOTS.map((s) => (
                        <option key={s.id} value={String(s.id)}>
                          {s.label}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => {
                        const rid = Number(selectedRecipeIdByPlan[planId])
                        const mt = Number(mealTimeByPlan[planId] || '3')
                        if (!rid || !Number.isFinite(rid)) return
                        if (!mt || !Number.isFinite(mt)) return
                        addRecipeMutation.mutate({ plan_id: planId, recipe_id: rid, meal_time: mt })
                      }}
                      disabled={addRecipeMutation.isPending || !selectedRecipeIdByPlan[planId]}
                      className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                    >
                      {addRecipeMutation.isPending ? 'Dodawanie...' : 'Dodaj'}
                    </button>
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
