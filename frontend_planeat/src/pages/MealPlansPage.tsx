import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getMealPlans, createMealPlan, updateMealPlan, deleteMealPlan } from '../api/mealPlans'
import { useAuth } from '../hooks/useAuth'
import { formatDatePL, toISODateOnly } from '../utils/format'

function MealPlansPage() {
  const navigate = useNavigate()
  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({ name: '', start_date: '', duration: '7' })
  const [editing, setEditing] = useState<null | {
    name: string
    start: string
    end: string
    plans: any[]
  }>(null)
  const [editName, setEditName] = useState('')
  const [editStart, setEditStart] = useState('')
  const { user } = useAuth()
  const queryClient = useQueryClient()
  const userId = user?.user_id || 1

  const { data: plans, isLoading, error } = useQuery({
    queryKey: ['mealPlans', userId],
    queryFn: () => getMealPlans(userId),
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const base = { user_id: userId, name: data.name }
      const start = new Date(String(data.start_date))
      if (Number.isNaN(start.getTime())) throw new Error('Nieprawidłowa data')

      const daysRaw = Number(data.duration)
      const days = Number.isFinite(daysRaw) ? Math.min(7, Math.max(1, Math.trunc(daysRaw))) : 7
      const payloads = Array.from({ length: days }).map((_, i) => {
        const d = new Date(start)
        d.setDate(d.getDate() + i)
        return { ...base, plan_date: toISODateOnly(d) }
      })

      for (const p of payloads) {
        await createMealPlan(p)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans', userId] })
      setFormData({ name: '', start_date: '', duration: '7' })
      setShowAddForm(false)
    },
  })

  const updateGroupMutation = useMutation({
    mutationFn: async (payload: { plans: any[]; newName: string; newStart: string }) => {
      const start = new Date(payload.newStart)
      if (Number.isNaN(start.getTime())) throw new Error('Nieprawidłowa data')

      const originalPlans = [...payload.plans].sort((a, b) => (String(a.plan_date) > String(b.plan_date) ? 1 : -1))
      const originalStart = new Date(String(originalPlans[0]?.plan_date))
      if (Number.isNaN(originalStart.getTime())) throw new Error('Nieprawidłowa data planu')
      originalStart.setHours(0, 0, 0, 0)
      start.setHours(0, 0, 0, 0)

      await Promise.all(
        originalPlans.map((p) => {
          const cur = new Date(String(p.plan_date))
          cur.setHours(0, 0, 0, 0)
          const offsetDays = Math.round((cur.getTime() - originalStart.getTime()) / (24 * 60 * 60 * 1000))
          const nextDate = new Date(start)
          nextDate.setDate(nextDate.getDate() + offsetDays)
          return updateMealPlan(Number(p.plan_id), { name: payload.newName, plan_date: toISODateOnly(nextDate) })
        })
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans', userId] })
      setEditing(null)
    },
  })

  const deleteGroupMutation = useMutation({
    mutationFn: async (payload: { plans: any[] }) => {
      const ids = payload.plans.map((p) => Number(p.plan_id)).filter((n) => Number.isFinite(n) && n > 0)
      for (const id of ids) {
        await deleteMealPlan(id)
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mealPlans', userId] })
    },
  })

  const handleAddPlan = () => {
    if (formData.name && formData.start_date) {
      createMutation.mutate(formData)
    }
  }

  const groups = useMemo(() => {
    const list = Array.isArray(plans) ? [...plans] : []
    list.sort((a: any, b: any) => (String(a?.plan_date) > String(b?.plan_date) ? -1 : 1))

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

    out.sort((a, b) => (a.start > b.start ? -1 : 1))
    return out
  }, [plans])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold text-gray-900">Plan posiłków</h1>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors"
        >
          + Dodaj plan
        </button>
      </div>

      {/* Add Meal Plan Form */}
      {showAddForm && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Nowy plan posiłków</h3>
          <input
            type="text"
            placeholder="Nazwa posiłku..."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <input
              type="date"
              value={formData.start_date}
              onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value as any })}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {Array.from({ length: 7 }).map((_, i) => {
                const d = i + 1
                return (
                  <option key={d} value={String(d)}>
                    Plan na {d} {d === 1 ? 'dzień' : 'dni'}
                  </option>
                )
              })}
            </select>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleAddPlan}
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

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg border border-gray-200 p-6 space-y-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Edytuj plan</h3>
                <div className="text-sm text-gray-500">
                  {formatDatePL(editing.start)}{editing.end !== editing.start ? ` — ${formatDatePL(editing.end)}` : ''}
                </div>
              </div>
              <button
                onClick={() => setEditing(null)}
                className="text-gray-500 hover:text-gray-900"
                title="Zamknij"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Nazwa</label>
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-900">Data startowa</label>
              <input
                type="date"
                value={editStart}
                onChange={(e) => setEditStart(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="text-xs text-gray-500">
                Dla planów wielodniowych daty przesuwają się automatycznie.
              </div>
            </div>

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setEditing(null)}
                className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
              >
                Anuluj
              </button>
              <button
                onClick={() => {
                  if (!editName.trim() || !editStart) return
                  updateGroupMutation.mutate({ plans: editing.plans, newName: editName.trim(), newStart: editStart })
                }}
                disabled={updateGroupMutation.isPending}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                {updateGroupMutation.isPending ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meals Grid */}
      {isLoading ? (
        <div className="text-center py-12">Ładowanie planów...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-600">{(error as any)?.message || 'Błąd ładowania planów'}</div>
      ) : (
        <div className="space-y-8">
          {groups.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-500">Brak planów - kliknij "Dodaj plan"</div>
          ) : (
            <div className="space-y-3">
              {groups.map((g) => {
                const isRange = g.start && g.end && g.end !== g.start
                const subtitle = isRange ? `od ${formatDatePL(g.start)} do ${formatDatePL(g.end)}` : formatDatePL(g.start)
                return (
                  <div
                    key={`${g.name}-${g.start}-${g.end}`}
                    className="bg-white rounded-lg p-4 shadow-sm border border-gray-200 flex justify-between items-center hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      const sp = new URLSearchParams({ name: g.name, start: g.start, end: g.end })
                      navigate(`/meal-plans/details?${sp.toString()}`)
                    }}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        const sp = new URLSearchParams({ name: g.name, start: g.start, end: g.end })
                        navigate(`/meal-plans/details?${sp.toString()}`)
                      }
                    }}
                  >
                    <div>
                      <p className="font-medium text-gray-900">{g.name}</p>
                      <p className="text-sm text-gray-500">{subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        className="px-3 py-2 text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          setEditing(g)
                          setEditName(g.name)
                          setEditStart(g.start)
                        }}
                        title="Edytuj"
                        disabled={deleteGroupMutation.isPending}
                      >
                        Edytuj
                      </button>
                      <button
                        className="px-3 py-2 text-red-700 hover:bg-red-50 rounded transition-colors"
                        onClick={(e) => {
                          e.stopPropagation()
                          const prettyRange = isRange ? ` (${formatDatePL(g.start)} — ${formatDatePL(g.end)})` : ` (${formatDatePL(g.start)})`
                          if (!window.confirm(`Na pewno usunąć plan "${g.name}"${prettyRange}?`)) return
                          deleteGroupMutation.mutate({ plans: g.plans })
                        }}
                        title="Usuń"
                        disabled={deleteGroupMutation.isPending}
                      >
                        ✖️
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default MealPlansPage
