import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'

interface ApiError {
  response?: {
    status?: number
  }
}

interface User {
  id?: number
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

export interface ProjectMember {
  id: number
  user_id: number
  role: 'leader' | 'member'
  user?: { name?: string }
}

export interface ProjectWithRole extends Project {
  role?: 'leader' | 'member'
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
  const projects = ref<ProjectWithRole[]>([])
  const loading = ref(true)
  const search = ref('')
  const filterStatus = ref('all')
  const creating = ref(false)

  // ── Create Modal ──────────────────────────
  const showCreateModal = ref(false)

  // ── Join Modal ────────────────────────────
  const showJoinModal = ref(false)
  const joinCode = ref('')
  const joining = ref(false)
  const joinError = ref('')

  // ── Member Modal ──────────────────────────
  const showMemberModal = ref(false)
  const selectedProject = ref<ProjectWithRole | null>(null)
  const memberTab = ref<'invite' | 'code'>('invite')
  const memberList = ref<ProjectMember[]>([])
  const loadingMembers = ref(false)
  const inviteUserId = ref('')
  const inviting = ref(false)
  const inviteMessage = ref('')
  const inviteSuccess = ref(false)
  const generatedCode = ref('')
  const generatingCode = ref(false)
  const codeCopied = ref(false)

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

  // ── Load Data ─────────────────────────────
  const loadData = async () => {
    loading.value = true
    try {
      const results = await Promise.allSettled([
        api.get('/profile'),
        api.get('/users/project'),
      ])

      const profileRes = results[0].status === 'fulfilled' ? (results[0] as PromiseFulfilledResult<any>).value : null
      const projectRes = results[1].status === 'fulfilled' ? (results[1] as PromiseFulfilledResult<any>).value : null

      if (profileRes) {
        user.value = (profileRes.data?.data as User) ?? {}
      } else {
        user.value = {}
        console.error('Gagal memuat profile:', (results[0] as PromiseRejectedResult).reason)
      }

      const raw: Array<Record<string, unknown>> = projectRes && Array.isArray(projectRes.data?.data)
        ? projectRes.data.data
        : []

      if (!projectRes) {
        console.error('Gagal memuat daftar proyek:', (results[1] as PromiseRejectedResult).reason)
      }

      const enriched: ProjectWithRole[] = await Promise.all(
        raw.map(async (p) => {
          try {
            const [taskRes, memberRes] = await Promise.all([
              api.get(`/users/project/${p.id}/tasks`),
              api.get(`/users/project/${p.id}/members`),
            ])

            const tasks: Task[] = Array.isArray(taskRes.data?.data) ? taskRes.data.data : []
            const done = tasks.filter((t) => t.finish).length
            const members: ProjectMember[] = Array.isArray(memberRes.data?.data)
              ? memberRes.data.data
              : []

            const myMember = members.find((m) => Number(m.user_id) === Number(user.value.id))

            // Tambah ini sementara untuk debug
            console.log('=== DEBUG ROLE ===')
            console.log('user.value:', user.value)
            console.log('user.value.id:', user.value.id)
            console.log('members:', members)
            console.log('myMember:', myMember)
            return {
              ...p,
              deadline: String((p as { tenggat?: unknown }).tenggat ?? ''),
              progress: tasks.length > 0 ? Math.round((done / tasks.length) * 100) : 0,
              taskCount: tasks.length,
              role: myMember?.role ?? 'member',
            } as ProjectWithRole
          } catch {
            return {
              ...(p as ProjectWithRole),
              deadline: String((p as { tenggat?: unknown }).tenggat ?? ''),
              progress: Number((p as { progress?: number }).progress ?? 0),
              taskCount: 0,
              role: 'member' as const,
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

  // ── Create Project ────────────────────────
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

  // ── Join Project ──────────────────────────
  const submitJoin = async () => {
    if (joinCode.value.length < 8) return
    joining.value = true
    joinError.value = ''
    try {
      await api.post('/users/project/join', { code: joinCode.value })
      showJoinModal.value = false
      joinCode.value = ''
      await loadData()
    } catch {
      joinError.value = 'Kode tidak valid atau sudah kadaluarsa.'
    } finally {
      joining.value = false
    }
  }

  // ── Member Modal ──────────────────────────
  const openMemberModal = async (project: ProjectWithRole) => {
    selectedProject.value = project
    memberTab.value = 'invite'
    inviteUserId.value = ''
    inviteMessage.value = ''
    generatedCode.value = ''
    codeCopied.value = false
    showMemberModal.value = true
    await fetchMembers(project.id)
  }

  const closeMemberModal = () => {
    showMemberModal.value = false
    selectedProject.value = null
    memberList.value = []
  }

  const fetchMembers = async (projectId: number) => {
    loadingMembers.value = true
    try {
      const res = await api.get(`/users/project/${projectId}/members`)
      memberList.value = Array.isArray(res.data?.data) ? res.data.data : []
    } catch {
      memberList.value = []
    } finally {
      loadingMembers.value = false
    }
  }

  const submitInvite = async () => {
    if (!inviteUserId.value.trim() || !selectedProject.value) return
    inviting.value = true
    inviteMessage.value = ''
    try {
      await api.post(`/users/project/${selectedProject.value.id}/invite`, {
        user_id: inviteUserId.value,
      })
      inviteMessage.value = 'Undangan berhasil dikirim!'
      inviteSuccess.value = true
      inviteUserId.value = ''
    } catch {
      inviteMessage.value = 'Gagal mengirim undangan. Periksa User ID.'
      inviteSuccess.value = false
    } finally {
      inviting.value = false
    }
  }

  const submitGenerateCode = async () => {
    if (!selectedProject.value) return
    generatingCode.value = true
    try {
      const res = await api.post(`/users/project/${selectedProject.value.id}/generate-code`)
      generatedCode.value = res.data?.data?.code ?? ''
      codeCopied.value = false
    } catch {
      //
    } finally {
      generatingCode.value = false
    }
  }

  const copyCode = async () => {
    if (!generatedCode.value) return
    await navigator.clipboard.writeText(generatedCode.value)
    codeCopied.value = true
    setTimeout(() => (codeCopied.value = false), 2000)
  }

  const handleKick = async (userId: number) => {
    if (!selectedProject.value) return
    const confirmed = window.confirm('Keluarkan anggota ini dari proyek?')
    if (!confirmed) return
    try {
      await api.delete(`/users/project/${selectedProject.value.id}/members/${userId}`)
      memberList.value = memberList.value.filter((m) => m.user_id !== userId)
    } catch {
      //
    }
  }

  // ── Project Actions ───────────────────────
  const goToProject = (id: number) => router.push(`/projects/${id}`)
  const handleEditProject = (id: number) => router.push(`/projects/${id}/edit`)

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
    creating,
    showCreateModal,
    showJoinModal,
    joinCode,
    joining,
    joinError,
    showMemberModal,
    selectedProject,
    memberTab,
    memberList,
    loadingMembers,
    inviteUserId,
    inviting,
    inviteMessage,
    inviteSuccess,
    generatedCode,
    generatingCode,
    codeCopied,
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
    copyCode,
    handleKick,
    submitJoin,
    openMemberModal,
    closeMemberModal,
    submitInvite,
    submitGenerateCode,
  }
}