import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '@/services/api'

interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
}

interface Task {
  id: number
  title?: string
  finish?: boolean
  projectTitle?: string
  [key: string]: unknown
}

interface User {
  id?: number
  name?: string
  [key: string]: unknown
}

interface Project {
  id: number
  title: string
  [key: string]: unknown
}

export function useTasks() {
    const route = useRoute()
    const router = useRouter()

    const tasks = ref<Task[]>([])
    const loading = ref(true)
    const user = ref<User>({})
    const project = ref<Project>()
    const userRole = ref<'leader' | 'member'>('member')

    const isLeader = computed(() => userRole.value === 'leader')

    const userInitial = computed(()=>
        user.value?.name? user.value.name.charAt(0).toUpperCase() : 'A',
    )

    const completionPercent = computed(() =>
        tasks.value.length > 0 ? Math.round((tasks.value.filter(t => t.finish).length / tasks.value.length) * 100) : 0,
    )

    const currentDate = computed(() =>
        new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
    )

    const projectId = String(route.params.id ?? '')
    // const taskId = String(route.params.taskId ?? '')

    const completedTasks = computed(()=>
        tasks.value.filter(t => t.finish).length
    )

    const pendingTasks = computed(()=>
        tasks.value.filter(t => !t.finish).length
    )   

    const progressPercentage = computed(() => {
        if (tasks.value.length === 0) return 0
        return Math.round((completedTasks.value / tasks.value.length) * 100)
    })
    
    const fetchData = async () => {
        if (!projectId) {
            loading.value = false
            tasks.value = []
            return
        }

        loading.value = true
        try {
        const [projectRes, taskRes, userRes, memberRes] = await Promise.all([
        api.get(`/users/project/${projectId}`),
        api.get(`/users/project/${projectId}/tasks`),
        api.get(`/profile`),
        api.get(`/users/project/${projectId}/members`),
        ])

        project.value = (projectRes.data?.data as Project) ?? undefined
        tasks.value = Array.isArray(taskRes.data?.data) ? taskRes.data.data : []
        user.value = (userRes.data?.data as User) ?? {}

        const members = Array.isArray(memberRes.data?.data) ? memberRes.data.data : []
        const myMember = members.find(
            (m: { user_id: number; role: string }) => Number(m.user_id) === Number(user.value.id)
        )

        const role = myMember?.role
        userRole.value = role === 'leader' ? 'leader' : 'member'

    } catch (error: unknown) {
        const err = error as { response?: { status?: number}}

        if (err.response?.status === 403 || err.response?.status === 404) {
        alert('Proyek tidak ditemukan atau kamu tidak memiliki akses.')
        router.replace('/projects')
        }
    
        console.error(error)
        tasks.value = []
    } finally {
        loading.value = false
    }
    }

    const toggleTask = async (task: Task) => {
    // Optimistic update — langsung ubah UI
    const found = tasks.value.find(t => t.id === task.id)
    if (found) {
        found.finish = Boolean(task.finish)
    }
    console.log('toggle task:', task)        // ← cek isi task
    console.log('task.id:', task.id)         // ← cek id-nya
    console.log('projectId:', projectId) 

    try {
        if (!projectId) return

        await api.patch(`/users/project/${projectId}/tasks/${task.id}/finish`, {
        finish: task.finish
        })
    } catch (error) {
        console.error(error)
        // Revert jika API gagal
        if (found) {
            found.finish = !task.finish
        }
    }
    }

    const goToAddTask = () => {
            router.push(`/projects/${projectId}/tasks/create`)
        }

        const goToEditTask = (task: Task) => {
            if (!projectId || !task?.id) return
            router.push(`/projects/${projectId}/tasks/${task.id}/edit`)
        }

        const handleDeleteTask = async (task: Task) => {
            if (!projectId || !task?.id) return

            const confirmed = window.confirm('Hapus task ini? Tindakan ini tidak bisa dibatalkan.')
            if (!confirmed) return

            const previousTasks = [...tasks.value]
            tasks.value = tasks.value.filter((item) => item.id !== task.id)

            try {
                await api.delete(`/users/project/${projectId}/tasks/${task.id}`)
            } catch (error) {
                console.error(error)
                tasks.value = previousTasks
            }
    }

    const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
    }

    return {
        tasks,
        loading,
        user,
        project,
        userInitial,
        completionPercent,
        currentDate,
        completedTasks,
        pendingTasks,
        progressPercentage,
        isLeader,
        fetchData,
        toggleTask,
        goToAddTask,
        goToEditTask,
        handleDeleteTask,
        handleLogout,
    }
}