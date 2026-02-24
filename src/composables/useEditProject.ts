import {computed, ref} from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface project {
    title : string,
    description : string,
    tenggat : string,
    status : string,
}

interface User {
    name?: string
    [key: string]: unknown
}

interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
            errors?: Record<string, string[]>
    }
  }
}

export function useEditProject() {
    const router = useRouter()

    const user = ref<User>({name: 'Pengguna'})
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)
    const alertMessage = ref('')
    const alertSuccess = ref(false)
    const form = ref<project>({
        title : '',
        description : '',
        tenggat : '',
        status : '',
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

    const loadProject = async (id: string) => {
        try {
            const response = await api.get(`/users/project/${id}`)
            const data = response.data?.data
            if (data) {
                form.value = {
                    title: data.title,
                    description: data.description,
                    tenggat: data.tenggat,
                    status: data.status,
                }
            } else {
                error.value = 'Data proyek tidak ditemukan.'
            }
        } catch (err) {
            const apiError = err as ApiError
            error.value = apiError.response?.data?.message ?? 'Gagal memuat proyek.'
        }
    }

    const handleSubmit = async (id: string) => {
        loading.value = true
        error.value = ''
        success.value = false
        alertMessage.value = ''
        alertSuccess.value = false
        try {
            const response = await api.put(`/users/project/${id}/update`, form.value)

            if (response.status === 200) {
                success.value = true
                alertSuccess.value = true
                alertMessage.value = 'Proyek berhasil diperbarui.'
                router.push('/projects')
            } else {
                error.value = 'Gagal memperbarui proyek.'
                alertSuccess.value = false
                alertMessage.value = error.value
            }
        } catch (err) {
            const apiError = err as ApiError
            const firstValidationError = Object.values(apiError?.response?.data?.errors ?? {})
              .flat()
              .find(Boolean)

            error.value = firstValidationError || apiError.response?.data?.message || 'Gagal memperbarui proyek.'
            alertSuccess.value = false
            alertMessage.value = error.value
        } finally {
            loading.value = false
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    return {
    form,
    userInitial,
    user,
    loading,
    handleSubmit,
    loadProfile,
    loadProject,
    handleLogout,
    alertMessage,
    alertSuccess,
    error,
    }
}