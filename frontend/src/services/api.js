import axios from 'axios'
const api = axios.create({ baseURL: '/api/v1', headers: { 'Accept': 'application/json' } })
api.interceptors.request.use(c => { const t = localStorage.getItem('token'); if (t) c.headers.Authorization = `Bearer ${t}`; return c })
api.interceptors.response.use(r => r, e => { if (e.response?.status === 401) { localStorage.removeItem('token'); window.location.href = '/login' }; return Promise.reject(e) })

export const auth = { login: d => api.post('/auth/login', d), me: () => api.get('/auth/me') }
export const health = () => api.get('/health')
export const events = { dispatch: d => api.post('/events/dispatch', d), recent: () => api.get('/events/recent') }
export default api
