import axios from 'axios'

// Jika VITE_API_BASE_URL tidak diisi di .env, otomatis menggunakan '/api'
// (Sangat cocok untuk proxy lokal maupun saat digabung di public_html shared hosting)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

export default api