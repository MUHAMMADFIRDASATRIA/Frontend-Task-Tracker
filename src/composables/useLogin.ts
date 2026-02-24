import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
}

export function useLogin() {
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const loading = ref(false)
    const errorMessage = ref('')

    const handleLogin = async () => {
        loading.value = true
        errorMessage.value = ''
        
        try{
            const response = await api.post('/login', {
                email: email.value,
                password: password.value,
            })
            const token = response.data?.api_token || response.data?.token

            if (!token) {
                throw new Error('Token tidak ditemukan pada response login')
            }

            localStorage.setItem('token', token)

            router.push('/dashboard')
        } catch (err: unknown) {
            errorMessage.value = (err as ApiError).response?.data?.message || 'Login gagal. Silakan coba lagi.'
        } finally {
            loading.value = false
        }
    }

    return {
        email,
        password,
        loading,
        errorMessage,
        handleLogin,
    }
}