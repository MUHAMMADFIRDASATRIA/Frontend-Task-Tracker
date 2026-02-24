import { computed, ref } from 'vue'
import api from '@/services/api'

interface User {
  name?: string
  [key: string]: unknown
}

interface Project {
  id: number
  title: string
}

interface Task {
  id: number
  finish?: boolean
  projectTitle?: string
  [key: string]: unknown
}

interface ApiError {
  response?: {
    status?: number
  }
}

export function useDashboard() {
  const user = ref<User>({})
  const tasks = ref<Task[]>([])
  const totalProjects = ref(0)
  const totalTasks = ref(0)
  const completedTasks = ref(0)
  const pendingTasks = ref(0)
  const loading = ref(true)

  const userInitial = computed(() =>
    user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'A',
  )

  const completionPercent = computed(() =>
    totalTasks.value > 0 ? Math.round((completedTasks.value / totalTasks.value) * 100) : 0,
  )

  const currentDate = computed(() => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    })
  })

  const loadDashboard = async () => {
    loading.value = true

    try {
      const profileRes = await api.get('/profile')
      user.value = (profileRes.data?.data as User) ?? {}

      const projectRes = await api.get('/users/project')
      const projects: Project[] = Array.isArray(projectRes.data?.data) ? projectRes.data.data : []
      totalProjects.value = projects.length

      const allTasks: Task[] = []

      for (const project of projects) {
        const taskRes = await api.get(`/users/project/${project.id}/tasks`)
        const projectTasks: Task[] = Array.isArray(taskRes.data?.data) ? taskRes.data.data : []

        projectTasks.forEach((task) => {
          task.projectTitle = project.title
        })

        allTasks.push(...projectTasks)
      }

      totalTasks.value = allTasks.length
      completedTasks.value = allTasks.filter((task) => task.finish).length
      pendingTasks.value = totalTasks.value - completedTasks.value
      tasks.value = allTasks.slice(0, 10)
    } catch (error: unknown) {
      if ((error as ApiError).response?.status !== 401) {
        console.error('Gagal memuat dashboard:', error)
      }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    tasks,
    totalProjects,
    totalTasks,
    completedTasks,
    pendingTasks,
    loading,
    userInitial,
    completionPercent,
    currentDate,
    loadDashboard,
  }
}
