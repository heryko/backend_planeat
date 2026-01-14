import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { getMealPlans } from '../api/mealPlans'
import { getMealPlanRecipes } from '../api/mealPlanRecipes'
import { getRecipes } from '../api/recipes'
import { getFavorites } from '../api/favorites'
import { useAuth } from '../hooks/useAuth'
import { toISODateOnly } from '../utils/format'

function DashboardPage() {
  const { user } = useAuth()
  const userId = user?.user_id || 1
  const [showMenuPreview, setShowMenuPreview] = useState(false)

  const { data: meals = [], error: mealsError } = useQuery({
    queryKey: ['mealPlans', userId],
    queryFn: () => getMealPlans(userId),
  })

  const { data: recipes = [], error: recipesError } = useQuery({
    queryKey: ['recipes'],
    queryFn: getRecipes,
  })

  const { data: favorites = [], error: favoritesError } = useQuery({
    queryKey: ['favorites', userId],
    queryFn: () => getFavorites(userId),
  })

  const todayKey = toISODateOnly(new Date())
  const todaysPlans = useMemo(() => {
    if (!Array.isArray(meals)) return []
    return meals.filter((m: any) => {
      const key = toISODateOnly(new Date(String(m?.plan_date || '')))
      return key === todayKey
    })
  }, [meals, todayKey])

  const planGroups = useMemo(() => {
    const list = Array.isArray(meals) ? [...meals] : []
    list.sort((a: any, b: any) => (String(a?.plan_date) > String(b?.plan_date) ? 1 : -1))

    const byName = new Map<string, any[]>()
    for (const p of list) {
      const key = String(p?.name || 'Plan')
      byName.set(key, [...(byName.get(key) || []), p])
    }

    const out: Array<{ name: string; start: string; end: string; plans: any[] }> = []
    for (const [name, items] of byName.entries()) {
      const sorted = [...items].sort((a, b) => (String(a?.plan_date) > String(b?.plan_date) ? 1 : -1))
      let current: any[] = []

      const pushCurrent = () => {
        if (current.length === 0) return
        const start = String(current[0]?.plan_date || '').slice(0, 10)
        const end = String(current[current.length - 1]?.plan_date || '').slice(0, 10)
        out.push({ name, start, end, plans: current })
        current = []
      }

      for (const p of sorted) {
        if (current.length === 0) {
          current = [p]
          continue
        }
        const prev = current[current.length - 1]
        const prevD = new Date(String(prev.plan_date))
        const curD = new Date(String(p.plan_date))
        prevD.setHours(0, 0, 0, 0)
        curD.setHours(0, 0, 0, 0)
        const diff = Math.round((curD.getTime() - prevD.getTime()) / (24 * 60 * 60 * 1000))
        if (diff === 1) {
          current.push(p)
        } else {
          pushCurrent()
          current = [p]
        }
      }
      pushCurrent()
    }

    return out
  }, [meals])

  const MEAL_SLOTS: Array<{ id: number; label: string }> = [
    { id: 1, label: 'Śniadanie' },
    { id: 2, label: 'Lunch' },
    { id: 3, label: 'Obiad' },
    { id: 4, label: 'Podwieczorek' },
    { id: 5, label: 'Kolacja' },
  ]

  const recipesById = new Map<number, any>((Array.isArray(recipes) ? recipes : []).map((r: any) => [Number(r.recipe_id), r]))

  const todayPlanIds = useMemo(() => {
    return (todaysPlans || [])
      .map((p: any) => Number(p?.plan_id))
      .filter((n: number) => Number.isFinite(n) && n > 0)
  }, [todaysPlans])

  const {
    data: planRecipesByPlanId = {},
    isLoading: planRecipesLoading,
    error: planRecipesError,
  } = useQuery({
    queryKey: ['mealPlanRecipesByPlanIds', todayPlanIds],
    enabled: todayPlanIds.length > 0,
    queryFn: async () => {
      const out: Record<number, any[]> = {}
      const entries = await Promise.all(
        todayPlanIds.map(async (planId) => {
          const data = await getMealPlanRecipes(planId)
          return [planId, Array.isArray(data) ? data : []] as const
        })
      )
      for (const [planId, rows] of entries) {
        out[planId] = rows
      }
      return out
    },
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Witaj z powrotem, {user?.username}</h1>
        <p className="text-gray-600">Zarządzaj swoimi posiłkami i przepisami</p>
      </div>

      {/* Today's Meals */}
      <div>

        {/* Menu Preview Modal */}
        {showMenuPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-gray-900">Podgląd menu</h3>
                <button 
                  onClick={() => setShowMenuPreview(false)}
                  className="text-2xl hover:text-red-600"
                >
                  ✕
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Dzisiaj</h4>
                  {mealsError ? (
                    <p className="text-red-600 text-sm ml-4">{(mealsError as any)?.message || 'Błąd ładowania planów'}</p>
                  ) : todaysPlans.length === 0 ? (
                    <p className="text-gray-500 text-sm ml-4">Brak planów na dziś</p>
                  ) : (
                    <ul className="text-gray-600 text-sm ml-4 space-y-1">
                      {todaysPlans.map((item: any) => (
                        <li key={item.plan_id}>• {item.name}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="font-semibold text-gray-900 mb-4">Plan na dziś</h3>
          {mealsError ? (
            <div className="text-red-600 text-sm">{(mealsError as any)?.message || 'Błąd ładowania planów'}</div>
          ) : todaysPlans.length === 0 ? (
            <div className="text-gray-400 text-sm">Brak planów na dziś</div>
          ) : (
            <div className="space-y-3">
              {todaysPlans.map((plan: any) => {
                const planId = Number(plan?.plan_id)
                const planRecipes = Number.isFinite(planId) ? (planRecipesByPlanId as any)?.[planId] || [] : []

                const grouped = (() => {
                  const map = new Map<number, any[]>()
                  const others: any[] = []
                  for (const mpr of planRecipes) {
                    const mt = Number(mpr?.meal_time)
                    if (MEAL_SLOTS.some((s) => s.id === mt)) {
                      map.set(mt, [...(map.get(mt) || []), mpr])
                    } else {
                      others.push(mpr)
                    }
                  }
                  return { map, others }
                })()

                const detailsUrl = `/meal-plans/details?${new URLSearchParams({
                  name: String(plan.name || 'Plan'),
                  start: (() => {
                    const g = planGroups.find(
                      (gr) =>
                        String(gr.name) === String(plan.name || 'Plan') &&
                        gr.plans.some((pp: any) => Number(pp.plan_id) === Number(plan.plan_id))
                    )
                    return g?.start || todayKey
                  })(),
                  end: (() => {
                    const g = planGroups.find(
                      (gr) =>
                        String(gr.name) === String(plan.name || 'Plan') &&
                        gr.plans.some((pp: any) => Number(pp.plan_id) === Number(plan.plan_id))
                    )
                    return g?.end || todayKey
                  })(),
                }).toString()}`

                return (
                  <div key={plan.plan_id} className="rounded-lg border border-gray-100 p-3">
                    <Link
                      to={detailsUrl}
                      className="flex items-center gap-3 hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                      title="Zobacz szczegóły planu"
                    >
                      <img
                        src="https://via.placeholder.com/80"
                        alt={plan.name}
                        className="w-16 h-16 rounded-lg object-cover bg-gray-200"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{plan.name}</p>
                        <p className="text-sm text-gray-500">{new Date(plan.plan_date).toLocaleDateString('pl-PL')}</p>
                      </div>
                    </Link>

                    <div className="mt-3 space-y-1">
                      {planRecipesLoading ? (
                        <div className="text-sm text-gray-500">Ładowanie posiłków...</div>
                      ) : planRecipesError ? (
                        <div className="text-sm text-red-600">{(planRecipesError as any)?.message || 'Błąd ładowania posiłków'}</div>
                      ) : planRecipes.length === 0 ? (
                        <div className="text-sm text-gray-500">Brak przypisanych przepisów</div>
                      ) : (
                        <div className="space-y-1">
                          {MEAL_SLOTS.map((slot) => {
                            const items = grouped.map.get(slot.id) || []
                            if (items.length === 0) return null
                            return (
                              <div key={slot.id} className="text-sm text-gray-700">
                                <span className="font-semibold text-gray-900">{slot.label}:</span>{' '}
                                {items.map((mpr: any, j: number) => {
                                  const rid = Number(mpr?.recipe_id)
                                  const r = recipesById.get(rid)
                                  const title = r?.title || `Przepis #${mpr?.recipe_id}`
                                  return (
                                    <span key={`${mpr.mpr_id || j}`}>
                                      {j > 0 ? ', ' : ''}
                                      {Number.isFinite(rid) ? (
                                        <Link
                                          to={`/recipes/${rid}`}
                                          className="text-emerald-800 hover:underline"
                                          onClick={(e) => e.stopPropagation()}
                                        >
                                          {title}
                                        </Link>
                                      ) : (
                                        <span>{title}</span>
                                      )}
                                    </span>
                                  )
                                })}
                              </div>
                            )
                          })}

                          {grouped.others.length > 0 && (
                            <div className="text-sm text-gray-700">
                              <span className="font-semibold text-gray-900">Inne:</span>{' '}
                              {grouped.others.map((mpr: any, j: number) => {
                                const rid = Number(mpr?.recipe_id)
                                const r = recipesById.get(rid)
                                const title = r?.title || `Przepis #${mpr?.recipe_id}`
                                return (
                                  <span key={`other-${mpr.mpr_id || j}`}>
                                    {j > 0 ? ', ' : ''}
                                    {Number.isFinite(rid) ? (
                                      <Link
                                        to={`/recipes/${rid}`}
                                        className="text-emerald-800 hover:underline"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        {title}
                                      </Link>
                                    ) : (
                                      <span>{title}</span>
                                    )}
                                  </span>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 rounded-lg p-6 border border-emerald-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📖</span>
            <div>
              <p className="text-sm text-emerald-600">Przepisy</p>
              <p className="text-2xl font-bold text-emerald-900">{recipesError ? '-' : recipes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <p className="text-sm text-blue-600">Plany posiłków</p>
              <p className="text-2xl font-bold text-blue-900">{meals.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
          <div className="flex items-center gap-3">
            <span className="text-3xl">❤️</span>
            <div>
              <p className="text-sm text-purple-600">Ulubione</p>
              <p className="text-2xl font-bold text-purple-900">{favoritesError ? '-' : (Array.isArray(favorites) ? favorites.length : 0)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
