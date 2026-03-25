import { computed, reactive, ref, type Ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'
import { useToast } from '@/composables/useToast'

interface User {
    id?: number
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

interface SubmitState {
    loading: Ref<boolean>
    error: Ref<string>
    success: Ref<boolean>
    alertMessage: Ref<string>
    alertSuccess: Ref<boolean>
}

function createSubmitState(): SubmitState {
    return {
        loading: ref(false),
        error: ref(''),
        success: ref(false),
        alertMessage: ref(''),
        alertSuccess: ref(false),
    }
}

function resetSubmitState(state: SubmitState) {
    state.error.value = ''
    state.success.value = false
    state.alertMessage.value = ''
    state.alertSuccess.value = false
}

function startSubmit(state: SubmitState) {
    state.loading.value = true
    resetSubmitState(state)
}

function finishSubmit(state: SubmitState) {
    state.loading.value = false
}

function setSubmitSuccess(state: SubmitState, message: string) {
    state.success.value = true
    state.alertSuccess.value = true
    state.alertMessage.value = message
}

function setSubmitError(state: SubmitState, message: string) {
    state.error.value = message
    state.alertSuccess.value = false
    state.alertMessage.value = message
}

function extractApiErrorMessage(error: unknown, fallbackMessage: string) {
    const apiError = error as ApiError
    const firstValidationError = Object.values(apiError?.response?.data?.errors ?? {})
        .flat()
        .find(Boolean)

    return firstValidationError || apiError?.response?.data?.message || fallbackMessage
}

function createUserState() {
    const user = ref<User>({ name: 'Pengguna' })
    const userInitial = computed(() => user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'A')

    return { user, userInitial }
}

function createProfileLoader(user: Ref<User>, endpoint = '/profile/show') {
    return async () => {
        try {
            const response = await api.get(endpoint)
            user.value = (response.data?.data as User) ?? { name: 'Pengguna' }
        } catch {
            user.value = { name: 'Pengguna' }
        }
    }
}


export function useCreateProject() {
    const router = useRouter()
    const { user, userInitial } = createUserState()
    const { addToast } = useToast()
    const submitState = createSubmitState()

    const showCreateModal = ref(false)
    const form = ref({
        title: '',
        description: '',
        tenggat: '',
    })

    const loadProfile = createProfileLoader(user)

    const handleSubmit = async () => {
        startSubmit(submitState)

        try {
            await api.post('/project/create', form.value)

            setSubmitSuccess(submitState, 'Proyek berhasil dibuat!')
            addToast('Proyek berhasil dibuat!', 'success')
            router.push('/projects')
        } catch (error) {
            setSubmitError(submitState, extractApiErrorMessage(error, 'Gagal membuat proyek'))
        } finally {
            finishSubmit(submitState)
        }
    }

    return {
        form,
        userInitial,
        user,
        loading: submitState.loading,
        showCreateModal,
        handleSubmit,
        loadProfile,
        alertMessage: submitState.alertMessage,
        alertSuccess: submitState.alertSuccess,
        error: submitState.error,
        success: submitState.success,
    }
}

export function useCreateTask() {
    const route = useRoute()
    const router = useRouter()
    const { user, userInitial } = createUserState()
    const { addToast } = useToast()
    const submitState = createSubmitState()
    const projectId = String(route.params.id ?? '')

    const loadingData = ref(false)
    const showSuccess = ref(false)
    const parentTaskTitle = ref('Tugas Induk')
    const errors = reactive({ title: '' })
    const form = ref({
        title: '',
        description: '',
        priority: 'medium',
        finish: false,
    })
    const priorities = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ]

    const currentDate = computed(() =>
        new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
    )

    const loadProfile = createProfileLoader(user)

    const fetchData = async () => {
        loadingData.value = true

        try {
            const [, projectRes] = await Promise.all([
                loadProfile(),
                api.get(`/project/${projectId}`),
            ])

            parentTaskTitle.value = String(projectRes.data?.data?.title ?? 'Tugas Induk')
        } catch {
            parentTaskTitle.value = 'Tugas Induk'
        } finally {
            loadingData.value = false
        }
    }

    const submitForm = async () => {
        startSubmit(submitState)
        errors.title = form.value.title.trim() ? '' : 'Judul task wajib diisi.'

        if (errors.title) {
            finishSubmit(submitState)
            return
        }

        try {
            await api.post('/tasks/create', {
                project_id: projectId,
                title: form.value.title,
                description: form.value.description,
                priority: form.value.priority,
                finish: form.value.finish,
            })

            setSubmitSuccess(submitState, 'Tugas berhasil dibuat.')
            showSuccess.value = true
            addToast('Tugas berhasil dibuat!', 'success')
            router.push(`/projects/${projectId}`)
        } catch (error) {
            setSubmitError(submitState, extractApiErrorMessage(error, 'Gagal membuat tugas.'))
        } finally {
            finishSubmit(submitState)
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
        errors,
        eror: errors,
        submitting: submitState.loading,
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
        alertMessage: submitState.alertMessage,
        alertSuccess: submitState.alertSuccess,
        error: submitState.error,
        success: submitState.success,
    }
}