import axios from 'axios'

// ─── Base URL ─────────────────────────────────────────────────────────────────
export const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend39.onrender.com'

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30s — Render free tier cold start
})

// ─── Endpoints ────────────────────────────────────────────────────────────────

/** GET /options — fetch valid crop/region/season lists from backend */
export const getOptions = () => api.get('/options')

/** POST /predict — all 21 fields required by backend */
export const predictSupplyChain = (payload) => api.post('/predict', payload)

export default api
