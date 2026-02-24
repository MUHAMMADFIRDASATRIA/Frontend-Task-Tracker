import {computed, ref} from 'vue'
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

export function useRegister() {
  const router = useRouter()
  const name = ref('')
  const email = ref('')
  const password = ref('')
  const confirmPassword = ref('')
  const showPassword = ref(false)
  const message = ref('')
  const loading = ref(false)
  const error = ref('')
  const success = ref(false)
  const passwordMismatch = computed(() => password.value !== confirmPassword.value)

  const handleRegister = async () => {
      if (confirmPassword.value && passwordMismatch.value) {
      error.value = 'Password dan konfirmasi password tidak cocok.'
      message.value = error.value
      success.value = false
      return
      }
        loading.value = true
        error.value = ''
      message.value = ''
      success.value = false

        try {
        await api.post('/register', {
            name: name.value,
            email: email.value,
            password: password.value,
        })
        success.value = true
      message.value = 'Pendaftaran berhasil! Mengarahkan ke login...'
        setTimeout(() => {
            router.push('/dahsboard')
        }, 1000)
      } catch (err: unknown) {
      error.value =
        (err as ApiError).response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.'
      message.value = error.value
      success.value = false
        } finally{
        loading.value = false
        }
    }
    
    return{
    name,
    email,
    password,
    confirmPassword,
    showPassword,
    message,
    loading,
    error,
    success,
    handleRegister,
    }
}