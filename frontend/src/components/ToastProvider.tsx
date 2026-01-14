import { useState } from 'react'
import type { ReactNode } from 'react'
import { ToastContext } from '../contexts/toast'

export function ToastProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null)

  function show(msg: string) {
    setMessage(msg)
    setTimeout(() => setMessage(null), 3000)
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {message && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded shadow-lg z-50">
          {message}
        </div>
      )}
    </ToastContext.Provider>
  )
}
