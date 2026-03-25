import { ref } from 'vue';
import api from '@/services/api';
import { useToast } from '@/composables/useToast';

interface ApiError {
  response?: {
    status?: number
    data?: {
      message?: string
    }
  }
}

interface Project {
  id: number
  title: string
  [key: string]: unknown
}

interface Task {
        id: number
    title: string
    [key: string]: unknown
}

type DeleteTarget = {
    id: number
    title: string
    type: 'task' | 'project'
    [key: string]: unknown
}

export function useDelete() {
    const { addToast } = useToast()
    const loading = ref(false)
    const error = ref<string | null>(null)
    const success = ref(false)

    // ── Confirm modal state ───────────────────────────────────────────────────
    const showDeleteConfirm = ref(false)
    const itemToDelete = ref<DeleteTarget | null>(null)
    let _onConfirmedSuccess: (() => void) | undefined

    const confirmDeleteTask = (task: Task, onSuccess?: () => void) => {
        itemToDelete.value = { ...task, type: 'task' }
        showDeleteConfirm.value = true
        _onConfirmedSuccess = onSuccess
    }

    const confirmDeleteProject = (project: Project, onSuccess?: () => void) => {
        itemToDelete.value = { ...project, type: 'project' }
        showDeleteConfirm.value = true
        _onConfirmedSuccess = onSuccess
    }

    const cancelDelete = () => {
        showDeleteConfirm.value = false
        itemToDelete.value = null
        _onConfirmedSuccess = undefined
    }

    // ── Core delete actions ───────────────────────────────────────────────────
    const deleteProject = async (projectId: number): Promise<boolean> => {
        loading.value = true
        error.value = null
        success.value = false
        try {
            await api.delete(`/project/${projectId}`)
            success.value = true
            addToast('Proyek berhasil dihapus.', 'success')
            return true
        } catch (err) {
            const apiError = err as ApiError
            error.value = apiError.response?.data?.message || 'Gagal menghapus proyek.'
            addToast(error.value, 'error')
            return false
        } finally {
            loading.value = false
        }
    }

    const deleteTask = async (taskId: number): Promise<boolean> => {
        loading.value = true
        error.value = null
        success.value = false
        try {
            await api.delete(`/tasks/${taskId}`)
            success.value = true
            addToast('Tugas berhasil dihapus.', 'success')
            return true
        } catch (err) {
            const apiError = err as ApiError
            error.value = apiError.response?.data?.message || 'Gagal menghapus tugas.'
            addToast(error.value, 'error')
            return false
        } finally {
            loading.value = false
        }
    }

    // ── Confirm handler (dipanggil tombol "Ya, Hapus") ────────────────────────
    const handleConfirmDelete = async () => {
        if (!itemToDelete.value) return
        const target = itemToDelete.value
        let isDeleted = false

        if (itemToDelete.value.type === 'task') {
            isDeleted = await deleteTask(target.id)
        } else {
            isDeleted = await deleteProject(target.id)
        }

        if (isDeleted) {
            const cb = _onConfirmedSuccess
            cancelDelete()
            cb?.()
        }
    }

    // ── Legacy wrapper (ProjectView pakai ini) ────────────────────────────────
    const handleDeleteProject = (project: Project, onSuccess?: () => void) => {
        confirmDeleteProject(project, onSuccess)
    }

    return {
        loading,
        error,
        success,
        showDeleteConfirm,
        itemToDelete,
        confirmDeleteTask,
        confirmDeleteProject,
        cancelDelete,
        handleConfirmDelete,
        deleteProject,
        deleteTask,
        handleDeleteProject,
    }

}
