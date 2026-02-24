import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface ApiError {
  response?: {
    status?: number
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
    progress: number
    deadline?: string
    taskCount?: number
    [key: string]: unknown
}

interface Task {
  id: number
    title?: string
    description?: string
  finish?: boolean
  [key: string]: unknown
}

interface CreateProjectPayload {
    title: string
    description: string
    deadline: string
}

interface CreateProjectApiPayload {
    title: string
    description: string
    tenggat: string
}

export function useProject() {
    const router = useRouter()

    const user = ref<User>({})
    const projects = ref<Project[]>([])
    const loading = ref(true)
    const search = ref('')
    const filterStatus = ref('all')
    const showCreateModal = ref(false)
    const creating = ref(false)

    const filterTabs = [
    { label: 'Semua', value: 'all' },
    { label: 'Berjalan', value: 'progress' },
    { label: 'Selesai', value: 'completed' },
    ]

    const userInitial = computed(() =>
    user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'A',
    )

    const currentDate = computed(() =>
    new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }),
    )

    const filteredProjects = computed(() =>
    projects.value
            .filter((p) =>
        filterStatus.value === 'all'
                    ? true
                    : filterStatus.value === 'completed'
                        ? p.progress === 100
                        : p.progress < 100,
            )
            .filter((p) => p.title.toLowerCase().includes(search.value.toLowerCase())),
    )

    const loadData = async () => {
    loading.value = true

    try {
            const [profileRes, projectRes] = await Promise.all([
        api.get('/profile'),
        api.get('/users/project'),
            ])

            user.value = (profileRes.data?.data as User) ?? {}
            const raw: Array<Record<string, unknown>> = Array.isArray(projectRes.data?.data)
                ? projectRes.data.data
                : []

            const enriched: Project[] = await Promise.all(
        raw.map(async (p) => {
                    try {
            const taskRes = await api.get(`/users/project/${p.id}/tasks`)
                        const tasks: Task[] = Array.isArray(taskRes.data?.data) ? taskRes.data.data : []
            const done = tasks.filter((t) => t.finish).length

            return {
                            ...p,
                            deadline: String((p as { tenggat?: unknown }).tenggat ?? ''),
                            progress: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0,
                            taskCount: tasks.length,
                        } as Project
                    } catch {
                        return {
                            ...(p as Project),
                            deadline: String((p as { tenggat?: unknown }).tenggat ?? ''),
                            progress: Number((p as { progress?: number }).progress ?? 0),
                            taskCount: 0,
                        }
                    }
        }),
            )

            projects.value = enriched
        } catch (err: unknown) {
            if ((err as ApiError).response?.status !== 401) {
                console.error('Gagal memuat proyek:', err)
            }
    } finally {
            loading.value = false
    }
    }

    const handleCreateProject = async (data: CreateProjectPayload) => {
    creating.value = true

    try {
            const payload: CreateProjectApiPayload = {
                title: data.title,
                description: data.description,
                tenggat: data.deadline,
            }

            await api.post('/users/project/create', payload)
            showCreateModal.value = false
            await loadData()
        } catch (err: unknown) {
            console.error('Gagal membuat proyek:', err)
    } finally {
            creating.value = false
    }
    }

    const goToProject = (id: number) => {
    router.push(`/projects/${id}`)
    }

    const handleEditProject = (id: number) => {
        router.push(`/projects/${id}/edit`)
    }

    const handleDeleteProject = async (id: number) => {
        const confirmed = window.confirm('Hapus proyek ini? Tindakan ini tidak bisa dibatalkan.')
        if (!confirmed) return

        try {
            await api.delete(`/users/project/${id}`)
            projects.value = projects.value.filter((project) => project.id !== id)
        } catch (err: unknown) {
            console.error('Gagal menghapus proyek:', err)
        }
    }

    const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
    }

    return {
        user,
        projects,
        loading,
        search,
        filterStatus,
        showCreateModal,
        creating,
        filterTabs,
        userInitial,
        currentDate,
        filteredProjects,
        loadData,
        handleCreateProject,
        goToProject,
        handleEditProject,
        handleDeleteProject,
        handleLogout,
    }
}
