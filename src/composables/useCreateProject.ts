import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
      errors?: Record<string, string[]>
    }
  }
}

interface User {
  name?: string
  [key: string]: unknown
}

export function useCreateProject() {
    const router = useRouter()

    const user = ref<User>({name: 'Pengguna'})
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)
    const alertMessage = ref('')
    const alertSuccess = ref(false)

    // Form fields
    const form = ref({
        title: '',
        description: '',
        tenggat: '',
    })

    const userInitial = computed(()=>
        user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'A',
    )

    const loadProfile = async () => {
      try {
        const response = await api.get('/profile')
        user.value = (response.data?.data as User) ?? { name: 'Pengguna' }
      } catch {
        user.value = { name: 'Pengguna' }
      }
    }

    // Handle create project
    const handleSubmit = async () => {
        loading.value = true
        error.value = ''
        success.value = false
        alertMessage.value = ''
        alertSuccess.value = false
        try {
          await api.post('/users/project/create', {
                title: form.value.title,
                description: form.value.description,
                tenggat: form.value.tenggat,
            })
            success.value = true
            alertSuccess.value = true
            alertMessage.value = 'Proyek berhasil dibuat!'
          router.push('/projects')
        } catch (err) {
            const apiError = err as ApiError
            const firstValidationError = Object.values(apiError?.response?.data?.errors ?? {})
              .flat()
              .find(Boolean)

            error.value = firstValidationError || apiError?.response?.data?.message || 'Gagal membuat proyek'
            alertSuccess.value = false
            alertMessage.value = error.value
        } finally {
            loading.value = false
        }
    }

    return {
    form,
    userInitial,
    user,
    loading,
    handleSubmit,
    loadProfile,
    alertMessage,
    alertSuccess,
    error,
    success,
}
}


