import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

axios.defaults.baseURL = import.meta.env.VITE_API_URL
axios.defaults.withCredentials = true

export const useAuthStore = defineStore('auth', () => {
  const user = ref<any>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isLoggedIn = computed(() => !!token.value)

  if (token.value) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`
  }

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post('/login', { email, password })
      token.value = response.data.token
      user.value = response.data.user

      localStorage.setItem('token', token.value as string)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token.value}`

      return response.data
    } catch (error: any) {
      const message = error.response?.data?.message || 'Email atau password salah.'
      throw new Error(message)
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } finally {
      token.value = null
      user.value = null
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    }
  }

  return { user, token, isLoggedIn, login, logout }
})