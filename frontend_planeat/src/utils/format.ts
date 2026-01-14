export function formatQuantity(value: unknown): string {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return String(value ?? '')

  // DB uses DECIMAL(10,2) in a few places; show decimals only when needed.
  return new Intl.NumberFormat('pl-PL', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num)
}

export type Unit = 'g' | 'ml' | 'pcs'

export function formatUnit(unit: unknown): string {
  if (unit === 'pcs') return 'szt'
  if (unit === 'g') return 'g'
  if (unit === 'ml') return 'ml'
  return String(unit ?? '')
}

export function toISODateOnly(date: Date): string {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) return ''
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function formatDatePL(value: unknown): string {
  if (!value) return ''
  const d = new Date(String(value))
  if (Number.isNaN(d.getTime())) return String(value)
  return d.toLocaleDateString('pl-PL')
}
