import axios from 'axios'

export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const responseMessage = error?.response?.data?.message
    const axiosMessage = error?.message

    if (!error?.response) {
      return Promise.reject(
        new Error(
          `Brak połączenia z API (${API_URL}). Uruchom backend lub ustaw VITE_API_URL. Szczegóły: ${axiosMessage || 'network error'}`
        )
      )
    }

    const msg =
      responseMessage ||
      (typeof status === 'number' ? `Błąd API (HTTP ${status})` : 'Błąd API')

    return Promise.reject(new Error(msg))
  },
)
