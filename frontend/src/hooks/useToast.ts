import { useContext } from 'react'
import { ToastContext } from '../contexts/toast'

export function useToast() {
  return useContext(ToastContext)
}
