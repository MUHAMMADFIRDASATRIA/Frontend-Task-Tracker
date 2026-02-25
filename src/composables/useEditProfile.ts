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
  email?: string
    profile_photo?: string
  [key: string]: unknown
}

interface ProfileForm {
    name: string
    email: string
    oldpassword: string
    password: string
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

        const form = ref<ProfileForm>({
        name: '',
        email: '',
                oldpassword: '',
        password: '',
    })

    const userInitial = computed(() =>
        user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'U',
    )
    
    const currentDate = computed(() =>
        new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
    )

    const resolvePhotoUrl = (value?: string | null): string | null => {
        if (!value) return null
        if (/^https?:\/\//i.test(value)) return value

        const apiBase = String(api.defaults.baseURL ?? '').replace(/\/api\/?$/, '')
        const cleanPath = value.startsWith('/') ? value : `/${value}`

        if (!apiBase) return cleanPath
        return `${apiBase}${cleanPath}`
    }

    const loadProfile = async () => {
        loading.value = true
        try {
            const response = await api.get('/profile')
            user.value = (response.data?.data as User) ?? { name: 'Pengguna' }

            form.value.name = user.value.name ?? ''
            form.value.email = user.value.email ?? ''

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
        photoFile.value = file
        photoPreview.value = URL.createObjectURL(file)
        removePhotoRequested.value = false
    }

    const removePhoto = () => {
        photoPreview.value = null
        photoFile.value = null
        removePhotoRequested.value = true
    }

    const updateForm = (value: ProfileForm) => {
        form.value = value
    }

    const saveProfile = async () => {
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

            const response = await api.put('/profile/edit', payload, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })

            user.value = (response.data?.data as User) ?? user.value
            photoPreview.value = resolvePhotoUrl(user.value.profile_photo)
            form.value.oldpassword = ''
            form.value.password = ''
            photoFile.value = null
            removePhotoRequested.value = false
            successMsg.value = 'Profil berhasil diperbarui!'
            setTimeout(() => (successMsg.value = ''), 3000)
        } catch (err) {
            const apiError = err as ApiError
            errorMsg.value = apiError.response?.data?.message || 'Gagal menyimpan perubahan.'
            setTimeout(() => (errorMsg.value = ''), 4000)
        } finally {
            saving.value = false
        }
    }

    const deleteAccount = async () => {
        if (!confirm('Yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) return

        deleting.value = true
        try {
            await api.delete('/profile')
            localStorage.removeItem('token')
            router.push('/login')
        } catch (err) {
            console.error('Gagal menghapus akun:', err)
            deleting.value = false
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token')
        router.push('/')
    }

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