
import axios from 'axios'

// ─── Base URL ─────────────────────────────────────────────────────────────────
// Change this to your deployed backend URL when deploying to Vercel
export const BASE_URL = import.meta.env.VITE_API_URL || 'https://backend39.onrender.com'

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30s — Render free tier can be slow on cold start
})

// ─── Endpoints ────────────────────────────────────────────────────────────────

/**
 * POST /predict
 * @param {Object} payload
 * @param {string} payload.crop
 * @param {string} payload.region
 * @param {string} payload.season
 * @param {number} payload.temperature
 * @param {number} payload.rainfall
 * @returns {Promise<Object>} prediction results
 */
export const predictSupplyChain = (payload) => api.post('/predict', payload)

export default api