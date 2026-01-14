import { createContext } from 'react'

export interface ToastContextType {
  show: (msg: string) => void
}

export const ToastContext = createContext<ToastContextType>({ show: () => {} })
