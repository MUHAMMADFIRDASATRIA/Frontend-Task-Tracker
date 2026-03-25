import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import api from '@/services/api'
import router from '@/router'
import { useToast } from '@/composables/useToast'

interface ApiResponse<T> {
  success: boolean
  data: T
}

interface User {
  id?: number
  name?: string
}

interface Project {
  id: number
  title: string
  description: string
  tenggat: string
  deadline: string
  progress: number
  taskCount: number
  role: 'leader' | 'member'
}

export interface Members {
  id: number
  user_id: number
  role: 'leader' | 'member'
  user?: { name?: string }
}

interface ApiError {
  response?: { status?: number }
}

export interface Task {
  id: number
  title?: string
  description?: string
  priority?: string | number
  finish?: boolean
  projectTitle?: string
  project_id?: number
}

const toArr = <T>(data: unknown): T[] => (Array.isArray(data) ? (data as T[]) : [])
const mapDeadline = (p: Project) => p.tenggat??''

// const normalizePriority = (task: Task) => {
//   if (typeof task.priority === 'number') {
//     const map: Record<number, string> = { 1: 'high', 2: 'medium', 3: 'low' }
//     task.priority = map[task.priority] ?? String(task.priority)
//   } else if (typeof task.priority === 'string') {
//     task.priority = task.priority.toLowerCase()
//   }
// }

const normalizePriority = (task: Task): Task => ({
  ...task,
  priority: typeof task.priority === 'number'
    ? ({ 1: 'high', 2: 'medium', 3: 'low' }[task.priority] ?? String(task.priority))
    : task.priority?.toString().toLowerCase() ?? task.priority,
})

export function useList() {
  const route = useRoute()
  const { addToast } = useToast()

  const user = ref<User | null>({})
  const projects = ref<Project[]>([])
  const tasks = ref<Task[]>([])
  const userRole = ref<'leader' | 'member'>('member')

  const loading = ref(false)
  const error = ref<string | null>(null)

  const showMemberModal = ref(false)
  const showInvitationModal = ref(false)
  const selectedProject = ref<Project | null>(null)
  const memberTab = ref<'invite' | 'code'>('invite')
  const project = ref<Project | null>(null)
  const memberList = ref<Members[]>([])
  const loadingMembers = ref(false)

  const search = ref('')
  const filterStatus = ref<'all' | 'progress' | 'completed'>('all')

  const filterTabs = [
    { label: 'Semua', value: 'all' },
    { label: 'Berjalan', value: 'progress' },
    { label: 'Selesai', value: 'completed' },
  ]

  // Route names that this composable dispatches fetch logic for
  const ROUTE_PROJECTS = 'projects'
  const ROUTE_TASKS = 'tasks'

  const filteredProjects = computed(() => {
    return projects.value
      .filter((p) => {
        if (filterStatus.value === 'completed') return p.progress === 100
        if (filterStatus.value === 'progress') return p.progress < 100
        return true
      })
      .filter((p) =>
        p.title.toLowerCase().includes(search.value.toLowerCase()),
      )
  })

  const currentDate = computed(() =>
        new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })
  )
  
  const fetchProjects = async (): Promise<Project[]> => {
    try {
      const response = await api.get<ApiResponse<Project[]>>('/project/show')
      const mappedProjects = toArr<Project>(response.data?.data).map(p => ({
        ...p,
        deadline: mapDeadline(p),
      }))
      projects.value = mappedProjects
      return mappedProjects
    } catch {
      error.value = 'Failed to fetch projects'
      return []
    }
  }

  const fetchUser = async () => {
    try {
      const response = await api.get<ApiResponse<User>>('/profile/show')
      user.value = response.data?.data ?? null
    } catch {
      user.value = null
    }
  }

  const userInitial = computed(() => {
    if (!user.value || !user.value.name) return ''
    return user.value.name.charAt(0).toUpperCase()
  })

  const fetchTasks = async () => {
    try {
      const projectId = route.params.id

      if (!projectId) {
        const response = await api.get<ApiResponse<Task[]>>('/tasks/show')
        tasks.value = toArr<Task>(response.data?.data)
        return
      }

      const [taskRes, memberRes] = await Promise.all([
        api.get<ApiResponse<Task[]>>(`/tasks/show?project_id=${projectId}`),
        api.get<ApiResponse<Members[]>>(`/members/${projectId}`),
      ])

      tasks.value = toArr<Task>(taskRes.data?.data)

      const memberData = toArr<Members>(memberRes.data?.data)
      const myMember = memberData.find((m) => Number(m.user_id) === Number(user.value?.id))
      userRole.value = myMember?.role === 'leader' ? 'leader' : 'member'

      try {
        const projectRes = await api.get<ApiResponse<Project>>(`/project/${projectId}`)
        project.value = (projectRes.data?.data as Project) ?? null
      } catch (err) {  
        if (import.meta.env.DEV) console.warn('[fetchTasks]', err)
      }
    } catch (err: unknown) {
      const status = (err as ApiError).response?.status

      if (status === 403 || status === 404) {
        error.value = 'Kamu tidak memiliki akses ke proyek ini.'
        addToast(error.value, 'error')
        router.replace('/projects')
        return
      }

      error.value = 'Failed to fetch tasks'
    }
  }
  
  const isLeader = computed(() => userRole.value === 'leader')

  const completedTasks = computed(() => tasks.value.filter(t => t.finish).length)
  const pendingTasks = computed(() => tasks.value.filter(t => !t.finish).length)

  const completionPercent = computed(() =>
    tasks.value.length > 0 ? Math.round((completedTasks.value / tasks.value.length) * 100) : 0
  )

  const progressPercentage = completionPercent
  const progressTugas = completionPercent
  const progressPending = computed(() =>
    tasks.value.length > 0 ? Math.round((pendingTasks.value / tasks.value.length) * 100) : 0
  )

  const goToAddTask = () => router.push(`/projects/${route.params.id}/tasks/create`)
  const goToEditTask = (task: Task) => router.push(`/projects/${route.params.id}/tasks/${task.id}/edit`)

  const finishToggle = async (task: Task) => {
    const found = tasks.value.find(t => t.id === task.id)
    if (found) {
      found.finish = Boolean(task.finish)
      try {
        await api.patch(`/tasks/${task.id}/finish`, {
          finish: found.finish,
        })
      } catch {
        // rollback jika gagal update
        found.finish = !found.finish
      }
    }
  }

  const fetchMembers = async (projectId: number) => {
    loadingMembers.value = true
    try {
      const response = await api.get<ApiResponse<Members[]>>(`/members/${projectId}`)
      memberList.value = toArr<Members>(response.data?.data)
    } catch {
      memberList.value = []
    } finally {
      loadingMembers.value = false
    }
  }

  const openMemberModal = async (proj: Project) => {
    selectedProject.value = proj
    showMemberModal.value = true
    memberTab.value = 'invite'
    await fetchMembers(proj.id)
  }

  const closeMemberModal = () => {
    showMemberModal.value = false
    selectedProject.value = null
    memberList.value = []
  }

  const openInvitationModal = () => {
    showInvitationModal.value = true
    memberTab.value = 'invite'
  }

  const closeInvitationModal = () => {
    showInvitationModal.value = false
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  const goToProject = (id: number) => router.push(`/projects/${id}`)
  const handleEditProject = (id: number) => router.push(`/projects/${id}/edit`)

  const totalProjects = computed(() => projects.value.length)
  const totalTasks = computed(() => tasks.value.length)

  

  const loadDashboard = async () => {
    loading.value = true
    error.value = null
    try {
      await fetchUser()
      const rawProjects = await fetchProjects()
      // const projectRes = await api.get<ApiResponse<Project[]>>('/project/show')
      // const rawProjects = toArr<Project>(projectRes.data?.data)
      // projects.value = rawProjects.map(p => ({ ...p, deadline: mapDeadline(p) }))

      // const allTasks = (
      //   await Promise.all(
      //     rawProjects.map(async (proj) => {
      //       try {
      //         const taskRes = await api.get<ApiResponse<Task[]>>(`/tasks/show?project_id=${proj.id}`)
      //         const projectTasks = toArr<Task>(taskRes.data?.data)
      //         projectTasks.forEach(task => { task.projectTitle = proj.title; normalizePriority(task) })
      //         return projectTasks
      //       } catch { return [] }
      //     })
      //   )
      // ).flat()
      const taskRes = await api.get<ApiResponse<Task[]>>('/tasks/show')
      const allTasks = toArr<Task>(taskRes.data?.data).map(task => {
        const proj = rawProjects.find(p => p.id === task.project_id)
        return normalizePriority({
          ...task,
          projectTitle: proj?.title ?? 'Unknown Project'
        })
      })

      const dashboardTasksLimit = 10
      tasks.value = allTasks.slice(0, dashboardTasksLimit)
    } catch (err: unknown) {
      if ((err as ApiError).response?.status !== 401) error.value = 'Gagal memuat dashboard'
    } finally {
      loading.value = false
    }
  }
  

  const fetchItems = async () => {
    loading.value = true
    error.value = null

    try {
      await fetchUser()

      if (route.name === ROUTE_PROJECTS) {
        await fetchProjects()
      } else if (route.name === ROUTE_TASKS) {
        await fetchTasks()
      }
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    userInitial,
    projects,
    tasks,
    currentDate,
    filteredProjects,
    search,
    filterStatus,
    filterTabs,
    loading,
    error,
    completionPercent,
    completedTasks,
    pendingTasks,
    isLeader,
    project,
    showMemberModal,
    selectedProject,
    memberTab,
    memberList,
    loadingMembers,
    fetchItems,
    fetchMembers,
    goToAddTask,
    goToEditTask,
    finishToggle,
    openMemberModal,
    closeMemberModal,
    openInvitationModal,
    closeInvitationModal,
    handleLogout,
    goToProject,
    handleEditProject,
    // dashboard
    totalProjects,
    totalTasks,
    progressPercentage,
    progressTugas,
    progressPending,
    loadDashboard,
  }
}