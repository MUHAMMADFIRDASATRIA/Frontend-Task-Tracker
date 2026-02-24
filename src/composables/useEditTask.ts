import { computed, reactive, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
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

interface Project {
  id: number
  title: string
  description?: string
  tenggat?: string
  status?: string
  [key: string]: unknown
}

interface Task {
    title: string
    description: string
    priority: string
    finish: boolean
}

export function useEditTask() {
    const router = useRouter()
    const route = useRoute()
    const projectId = String(route.params.projectId ?? '')
    const taskId = String(route.params.taskId ?? '')
    const user = ref<User>({name: 'Pengguna'})
    const loading = ref(false)
    const eror = reactive({ title: '' })
    const success = ref(false)
    const alertMessage = ref('')
    const alertSuccess = ref(false)
    const form = ref<Task>({
        title : '',
        description : '',
        priority : 'medium',
        finish : false,
    })

    const userInitial = computed(()=>
        user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'A',
    )

    const currentDate = computed(() =>
        new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
    )

    const parentTaskTitle = computed(() => form.value.title ? `Tugas: ${form.value.title}` : 'Tugas Induk')

    const submitting = ref(false)

    const priorities = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ]

    const showSuccess = ref(false)

    const fetchData = async () => {
      try {
        const response = await api.get('/profile')
        user.value = (response.data?.data as User) ?? { name: 'Pengguna' }
      } catch {
        user.value = { name: 'Pengguna' }
      }
    }

    const loadTask = async () => {
        try {
            const response = await api.get(`/users/project/${projectId}/tasks/${taskId}`)
            const data = response.data?.data
            if (data) {
                form.value = {
                    title: data.title ?? '',
                    description: data.description ?? '',
                    priority: data.priority ?? 'medium',
                    finish: Boolean(data.finish),
                }
            }
        } catch (err) {
            const apiError = err as ApiError
            eror.title = apiError.response?.data?.message || 'Gagal memuat tugas.'
        } finally {
            loading.value = false
        }
    }

    const submitForm = async () => {
        loading.value = true
        eror.title = form.value.title.trim() ? '' : 'Judul task wajib diisi.'
        if (eror.title) {
            loading.value = false
            return
        }
        success.value = false
        alertMessage.value = ''
        alertSuccess.value = false
        try {
            await api.put(`/users/project/${projectId}/tasks/${taskId}`, {
                title: form.value.title,
                description: form.value.description,
                priority: form.value.priority,
                finish: form.value.finish,
            })
            alertSuccess.value = true
            alertMessage.value = 'Tugas berhasil diperbarui.'
            router.push(`/projects/${projectId}`)
        } catch (err) {
            const apiError = err as ApiError
            eror.title = apiError.response?.data?.message || 'Gagal memperbarui tugas.'
        } finally {
            loading.value = false
        }
    }

    const goBack = () => {      
        router.push(`/projects/${projectId}`)
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

    return {
        user,
        form,
        currentDate,
        parentTaskTitle,
        loading,
        eror,
        success,
        alertMessage,
        alertSuccess,
        userInitial,
        fetchData,
        loadTask,
        submitForm,
        submitting,
        showSuccess,
        priorities,
        goBack,
        handleLogout,
    }
}