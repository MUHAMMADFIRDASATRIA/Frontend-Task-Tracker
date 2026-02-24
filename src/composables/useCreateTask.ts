import { computed, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
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

export function useCreateTask() {
    const route = useRoute()
    const router = useRouter()
    const projectId = String(route.params.id ?? '')

    const user = ref<User>({ name: 'Pengguna' })
    const loadingData = ref(false)
    const submitting = ref(false)
    const error = ref('')
    const success = ref(false)
    const alertMessage = ref('')
    const alertSuccess = ref(false)
    const showSuccess = ref(false)
    const parentTaskTitle = ref('Tugas Induk')
    const eror = reactive({ title: '' })
    const form = ref({
        title: '',
        description: '',
        priority: 'medium',
        finish : false,
    })
    const priorities = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ]

    const userInitial = computed(() =>
        user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'A',
    )

    const currentDate = computed(() =>
        new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
    )

    const fetchData = async () => {
        loadingData.value = true
        try {
            const [profileRes, projectRes] = await Promise.all([
                api.get('/profile'),
                api.get(`/users/project/${projectId}`),
            ])

            user.value = (profileRes.data?.data as User) ?? { name: 'Pengguna' }
            parentTaskTitle.value = String(projectRes.data?.data?.title ?? 'Tugas Induk')
        } catch {
            user.value = { name: 'Pengguna' }
            parentTaskTitle.value = 'Tugas Induk'
        } finally {
            loadingData.value = false
        }
    }

    const submitForm = async () => {
        submitting.value = true
        error.value = ''
        eror.title = form.value.title.trim() ? '' : 'Judul task wajib diisi.'
        if (eror.title) {
            submitting.value = false
            return
        }
        success.value = false
        alertMessage.value = ''
        alertSuccess.value = false

        try {
            await api.post(`/users/project/${projectId}/tasks/create`, {
                title: form.value.title,
                description: form.value.description,
                priority: form.value.priority,
                finish: form.value.finish,
            })

            success.value = true
            alertSuccess.value = true
            alertMessage.value = 'Tugas berhasil dibuat.'
            showSuccess.value = true
            router.push(`/projects/${projectId}`)

        } catch (err) {
            const apiError = err as ApiError
            error.value = apiError.response?.data?.message || 'Gagal membuat tugas.'
            alertSuccess.value = false
        } finally {
            submitting.value = false
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
        form,
        eror,
        submitting,
        priorities,
        showSuccess,
        userInitial,
        user,
        currentDate,
        parentTaskTitle,
        loadingData,
        fetchData,
        submitForm,
        goBack,
        handleLogout,
        alertMessage,
        alertSuccess,
        error,
        success,
    }
}