import { ref } from 'vue'
import api from '@/services/api'

interface ApiResponse<T> {
  success: boolean
  data: T
}

export interface Invite {
  id: number
  project_id: number
  project_title: string
  invited_by_name: string
  created_at: string
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

export interface members {
  id: number
  user_id: number
  role: 'leader' | 'member'
  user?: { name?: string }
}

export function useInvite() {
    const invites = ref<Invite[]>([])
    const loading = ref(false)

    const joinCode = ref('')
    const joining = ref(false)
    const joinError = ref('')
    const joinSuccess = ref(false)
    const joinedProjectName = ref('')

    const showJoinModal = ref(false)
    const showInvitationModal = ref(false)

    const pendingInvitations = ref<Invite[]>([])
    const loadingInvitations = ref(false)
    const inviteProcessingId = ref<number | null>(null)
    const selectedProject = ref<Project | null>(null)
    const memberTab = ref<'invite' | 'code'>('invite')
    const memberList = ref<members[]>([])
    const loadingMembers = ref(false)
    const inviteUserId = ref('')
    const inviting = ref(false)
    const inviteMessage = ref('')
    const inviteSuccess = ref(false)

    const generatedCode = ref('')
    const generatingCode = ref(false)
    const codeCopied = ref(false)

    const loadData = async () => {
        loading.value = true
        try {
            const response = await api.get<ApiResponse<Invite[]>>('/invitations/show')
            invites.value = response.data.data
        } catch (error) {
            console.error('Error fetching invites:', error)
        } finally {
            loading.value = false
        }
    }

    const fetchInvitations = async () => {
        loadingInvitations.value = true
        try {
            const response = await api.get<ApiResponse<Invite[]>>('/invitations/show')
            pendingInvitations.value = response.data.data
        } catch (error) {
            console.error('Error fetching invitations:', error)
        } finally {
            loadingInvitations.value = false
        }
    }

    const submitInvite = async (projectId?: number) => {
        const pid = projectId ?? selectedProject.value?.id
        if (!inviteUserId.value.trim() || !pid) return
        inviting.value = true
        inviteMessage.value = ''
        inviteSuccess.value = false
        try {
            await api.post(`/project/${pid}/invite`, {
                user_id: inviteUserId.value,
            })
            inviteSuccess.value = true
            inviteMessage.value = 'Undangan berhasil dikirim.'
            inviteUserId.value = ''
        } catch (error: any) {
            inviteSuccess.value = false
            inviteMessage.value = error?.response?.data?.message ?? 'Gagal mengirim undangan.'
        } finally {
            inviting.value = false
        }
    }

    const submitGenerateCode = async (projectId?: number) => {
        const pid = projectId ?? selectedProject.value?.id
        if (!pid) return
        generatingCode.value = true
        codeCopied.value = false
        try {
            const response = await api.post(`/project/${pid}/generate-code`)
            generatedCode.value = response.data?.data?.code ?? ''
        } catch (error) {
            console.error('Error generating code:', error)
        } finally {
            generatingCode.value = false
        }
    }

    const copyCode = () => {
        if (!generatedCode.value) return
        navigator.clipboard.writeText(generatedCode.value)
        codeCopied.value = true
        setTimeout(() => {
            codeCopied.value = false
        }, 2000)
    }

    const handleKick = async (userId: number, projectId: number, onSuccess?: () => void) => {
        const confirmed = window.confirm('Keluarkan anggota ini dari proyek?')
        if (!confirmed) return
        try {
            await api.delete(`/members/${userId}`, { params: { project_id: projectId } })
            if (onSuccess) onSuccess()
        } catch (error) {
            console.error('Error kicking member:', error)
        }
    }

    const submitJoin = async () => {
        if (!joinCode.value.trim()) return
        joining.value = true
        joinError.value = ''
        joinSuccess.value = false

        try {
            const res = await api.post('/project/me/join', { code: joinCode.value })
            joinSuccess.value = true
            joinedProjectName.value = res.data?.data?.project_title ?? ''
            await loadData()
        } catch (error: any) {
            joinError.value = error?.response?.data?.message ?? 'Failed to join project. Please check the code and try again.'
        } finally {
            joining.value = false
        }
    }

    const openInvitationModal = async () => {
        showInvitationModal.value = true
        await fetchInvitations()
    }

    const closeInvitationModal = () => {
        showInvitationModal.value = false
    }

    const acceptInvitation = async (id: number, onSuccess?: () => void) => {
        inviteProcessingId.value = id
        try {
            await api.post(`/project/${id}/accept`)
            pendingInvitations.value = pendingInvitations.value.filter((i) => i.id !== id)
            onSuccess?.()
        } catch (err: any) {
            console.error('Gagal menerima undangan:', err?.response?.data?.message)
        } finally {
            inviteProcessingId.value = null
        }
    }

    const declineInvitation = async (id: number) => {
        inviteProcessingId.value = id
        try {
            await api.post(`/project/${id}/decline`)
            pendingInvitations.value = pendingInvitations.value.filter((i) => i.id !== id)
        } catch (err: any) {
            console.error('Gagal menolak undangan:', err?.response?.data?.message)
        } finally {
            inviteProcessingId.value = null
        }
    }

    return {
        invites,
        loading,
        joinCode,
        joining,
        joinError,
        joinSuccess,
        joinedProjectName,
        showJoinModal,
        showInvitationModal,
        pendingInvitations,
        loadingInvitations,
        inviteProcessingId,
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
        loadData,
        fetchInvitations,
        openInvitationModal,
        closeInvitationModal,
        acceptInvitation,
        declineInvitation,
        submitInvite,
        submitGenerateCode,
        handleKick,
        copyCode,
        submitJoin,
    }
}