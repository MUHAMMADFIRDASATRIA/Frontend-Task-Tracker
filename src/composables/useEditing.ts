import { computed, onBeforeUnmount, reactive, ref, type Ref } from "vue";
import { useRouter, useRoute, type Router } from "vue-router";
import api from "@/services/api";
import { useToast } from "@/composables/useToast";

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
    email?: string
    profile_photo?: string
    [key: string]: unknown
}

interface Project {
    title: string
    description: string
    tenggat: string
    status: string
}

interface Task {
    title: string
    description: string
    priority: 'low' | 'medium' | 'high'
    finish: boolean
}

interface ProfileForm {
    name: string
    email: string
    oldpassword: string
    password: string
}

function makeUserInitial(user: Ref<User>, fallback = 'A') {
    return computed(() => user.value?.name ? user.value.name.charAt(0).toUpperCase() : fallback)
}

function makeCurrentDate() {
    return computed(() => new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }))
}

function makeHandleLogout(router: Router) {
    return () => {
        localStorage.removeItem('token')
        router.push('/')
    }
}

export function useEditProject() {
    const router = useRouter()

    const user = ref<User>({ name: 'Pengguna' })
    const loading = ref(false)
    const error = ref('')
    const success = ref(false)
    const alertMessage = ref('')
    const alertSuccess = ref(false)
    const form = ref<Project>({
        title: '',
        description: '',
        tenggat: '',
        status: '',
    })

    const userInitial = makeUserInitial(user)

    const loadProfile = async () => {
        try {
            const response = await api.get('/profile/show')
            user.value = (response.data?.data as User) ?? { name: 'Pengguna' }
        } catch {
            user.value = { name: 'Pengguna' }
        }
    }

    const loadProject = async (id: string) => {
        loading.value = true
        error.value = ''
        alertMessage.value = ''
        try {
            const response = await api.get(`/project/${id}`)
            const data = response.data?.data
            if (data) {
                form.value = {
                    title: data.title ?? '',
                    description: data.description ?? '',
                    tenggat: data.tenggat ?? '',
                    status: data.status ?? '',
                }
            } else {
                error.value = 'Data proyek tidak ditemukan.'
                alertSuccess.value = false
                alertMessage.value = error.value
            }
        } catch (err) {
            const apiError = err as ApiError
            error.value = apiError.response?.data?.message ?? 'Gagal memuat proyek.'
            alertSuccess.value = false
            alertMessage.value = error.value
        } finally {
            loading.value = false
        }
    }

    const handleSubmit = async (id: string) => {
        loading.value = true
        error.value = ''
        success.value = false
        alertMessage.value = ''
        alertSuccess.value = false
        try {
            const response = await api.put(`/project/${id}/update`, form.value)

            if (response.status === 200) {
                success.value = true
                alertSuccess.value = true
                alertMessage.value = 'Proyek berhasil diperbarui.'
                useToast().addToast('Proyek berhasil diperbarui!', 'success')
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

    const handleLogout = makeHandleLogout(router)

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

export function useEditTask() {
    const router = useRouter()
    const route = useRoute()
    const projectId = String(route.params.projectId ?? '')
    const taskId = String(route.params.taskId ?? '')

    const user = ref<User>({ name: 'Pengguna' })
    const loading = ref(false)
    const eror = reactive({ title: '' })
    const success = ref(false)
    const alertMessage = ref('')
    const alertSuccess = ref(false)
    const submitting = ref(false)
    const showSuccess = ref(false)
    const form = ref<Task>({
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

    const userInitial = makeUserInitial(user)
    const currentDate = makeCurrentDate()

    const parentTaskTitle = computed(() =>
        form.value.title ? `Tugas: ${form.value.title}` : 'Tugas Induk'
    )

    const fetchData = async () => {
        loading.value = true
        try {
            const response = await api.get('/profile/show')
            user.value = (response.data?.data as User) ?? { name: 'Pengguna' }
        } catch {
            user.value = { name: 'Pengguna' }
        } finally {
            loading.value = false
        }
    }

    const loadTask = async () => {
        loading.value = true
        try {
            const response = await api.get(`/tasks/${taskId}`)
            const data = response.data?.data
            if (data) {
                form.value = {
                    title: data.title ?? '',
                    description: data.description ?? '',
                    priority: data.priority ?? 'medium',
                    finish: Boolean(data.finish),
                }
            } else {
                eror.title = 'Data tugas tidak ditemukan.'
            }
        } catch (err) {
            const apiError = err as ApiError
            eror.title = apiError.response?.data?.message || 'Gagal memuat tugas.'
        } finally {
            loading.value = false
        }
    }

    const submitForm = async () => {
        submitting.value = true
        eror.title = form.value.title.trim() ? '' : 'Judul task wajib diisi.'
        if (eror.title) {
            submitting.value = false
            return
        }
        success.value = false
        alertMessage.value = ''
        alertSuccess.value = false
        try {
            await api.put(`/tasks/${taskId}/update`, {
                title: form.value.title,
                description: form.value.description,
                priority: form.value.priority,
                finish: form.value.finish,
            })
            success.value = true
            alertSuccess.value = true
            alertMessage.value = 'Tugas berhasil diperbarui.'
            showSuccess.value = true
            useToast().addToast('Tugas berhasil diperbarui!', 'success')
        } catch (err) {
            const apiError = err as ApiError
            const firstValidationError = Object.values(apiError.response?.data?.errors ?? {})
                .flat()
                .find(Boolean)

            eror.title = firstValidationError || apiError.response?.data?.message || 'Gagal memperbarui tugas.'
            alertMessage.value = eror.title
            alertSuccess.value = false
        } finally {
            submitting.value = false
        }
    }

    const goBack = () => {
        router.push(`/projects/${projectId}`)
    }

    const handleLogout = makeHandleLogout(router)

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

export function useEditProfile() {
    const router = useRouter()
    const user = ref<User>({ name: 'Pengguna' })
    const loading = ref(true)
    const saving = ref(false)
    const deleting = ref(false)
    const successMsg = ref('')
    const errorMsg = ref('')
    const photoPreview = ref<string | null>(null)
    const photoFile = ref<File | null>(null)
    const removePhotoRequested = ref(false)
    let previewObjectUrl: string | null = null
    let successTimeoutId: ReturnType<typeof setTimeout> | null = null
    let errorTimeoutId: ReturnType<typeof setTimeout> | null = null

    const form = ref<ProfileForm>({
        name: '',
        email: '',
        oldpassword: '',
        password: '',
    })

    const userInitial = makeUserInitial(user, 'U')
    const currentDate = makeCurrentDate()

    const resolvePhotoUrl = (value?: string | null): string | null => {
        if (!value) return null
        if (/^https?:\/\//i.test(value)) return value

        const apiBase = String(api.defaults.baseURL ?? '').replace(/\/api\/?$/, '')
        const cleanPath = value.startsWith('/') ? value : `/${value}`

        if (!apiBase) return cleanPath
        return `${apiBase}${cleanPath}`
    }

    const clearPreviewObjectUrl = () => {
        if (previewObjectUrl) {
            URL.revokeObjectURL(previewObjectUrl)
            previewObjectUrl = null
        }
    }

    const resetSuccessTimeout = () => {
        if (successTimeoutId) {
            clearTimeout(successTimeoutId)
            successTimeoutId = null
        }
    }

    const resetErrorTimeout = () => {
        if (errorTimeoutId) {
            clearTimeout(errorTimeoutId)
            errorTimeoutId = null
        }
    }

    const loadProfile = async () => {
        loading.value = true
        try {
            const response = await api.get('/profile/show')
            user.value = (response.data?.data as User) ?? { name: 'Pengguna' }

            form.value.name = user.value.name ?? ''
            form.value.email = user.value.email ?? ''

            clearPreviewObjectUrl()
            photoPreview.value = resolvePhotoUrl(user.value.profile_photo)
        } catch (err) {
            const apiError = err as ApiError
            if (apiError.response?.status !== 401) {
                errorMsg.value = apiError.response?.data?.message || 'Gagal memuat profil.'
            }
        } finally {
            loading.value = false
        }
    }

    const onPhotoChange = (file: File) => {
        clearPreviewObjectUrl()
        photoFile.value = file
        previewObjectUrl = URL.createObjectURL(file)
        photoPreview.value = previewObjectUrl
        removePhotoRequested.value = false
    }

    const removePhoto = () => {
        clearPreviewObjectUrl()
        photoPreview.value = null
        photoFile.value = null
        removePhotoRequested.value = true
    }

    const updateForm = (value: ProfileForm) => {
        form.value = value
    }

    const saveProfile = async () => {
        resetSuccessTimeout()
        resetErrorTimeout()
        successMsg.value = ''
        errorMsg.value = ''
        saving.value = true

        try {
            const payload = new FormData()

            if (form.value.name) payload.append('name', form.value.name)
            if (form.value.email) payload.append('email', form.value.email)
            if (form.value.oldpassword) payload.append('oldpassword', form.value.oldpassword)
            if (form.value.password) payload.append('password', form.value.password)
            if (photoFile.value) payload.append('profile_photo', photoFile.value)
            if (removePhotoRequested.value && !photoFile.value) payload.append('remove_photo', '1')

            const response = await api.put('/profile/me/update', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            user.value = (response.data?.data as User) ?? user.value
            clearPreviewObjectUrl()
            photoPreview.value = resolvePhotoUrl(user.value.profile_photo)
            form.value.oldpassword = ''
            form.value.password = ''
            photoFile.value = null
            removePhotoRequested.value = false
            successMsg.value = 'Profil berhasil diperbarui!'
            successTimeoutId = setTimeout(() => {
                successMsg.value = ''
                successTimeoutId = null
            }, 3000)
        } catch (err) {
            const apiError = err as ApiError
            errorMsg.value = apiError.response?.data?.message || 'Gagal menyimpan perubahan.'
            errorTimeoutId = setTimeout(() => {
                errorMsg.value = ''
                errorTimeoutId = null
            }, 4000)
        } finally {
            saving.value = false
        }
    }

    const deleteAccount = async () => {
        if (!confirm('Yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) return

        deleting.value = true
        errorMsg.value = ''
        try {
            await api.delete('/profile')
            localStorage.removeItem('token')
            router.push('/login')
        } catch (err) {
            const apiError = err as ApiError
            errorMsg.value = apiError.response?.data?.message || 'Gagal menghapus akun.'
        } finally {
            deleting.value = false
        }
    }

    onBeforeUnmount(() => {
        clearPreviewObjectUrl()
        resetSuccessTimeout()
        resetErrorTimeout()
    })

    const handleLogout = makeHandleLogout(router)

    return {
        user,
        loading,
        saving,
        deleting,
        successMsg,
        errorMsg,
        form,
        photoPreview,
        photoFile,
        userInitial,
        currentDate,
        loadProfile,
        onPhotoChange,
        removePhoto,
        updateForm,
        saveProfile,
        deleteAccount,
        handleLogout,
    }
}
