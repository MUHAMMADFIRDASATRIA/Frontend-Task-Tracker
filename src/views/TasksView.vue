<template>
  <div class="app-shell">
    <AppSidebar v-if="user" :user="user" :user-initial="userInitial" @logout="handleLogout" />

    <main class="main-content">
      <AppHeader
        v-if="user"
        :user="user"
        :user-initial="userInitial"
        :current-date="currentDate"
      />

      <div class="content-body">
        <div class="content-inner">
          <section class="page-intro">
            <div class="intro-text">
              <p class="intro-eyebrow">Task Workspace</p>
              <h2 class="intro-title">{{ project?.title ?? 'Memuat proyek...' }}</h2>
              <p class="intro-desc">{{ project?.description || 'Tidak ada deskripsi.' }}</p>
            </div>
            <div v-if="project?.deadline" class="intro-deadline">
              <span class="deadline-label">Deadline</span>
              <span class="deadline-value">{{ project.deadline }}</span>
              <span v-if="deadlineWarning" class="deadline-warn">{{ deadlineWarning }}</span>
            </div>
          </section>

          <TasksStats
            :completed="completedTasks"
            :pending="pendingTasks"
            :progress="completionPercent"
            @manage-members="handleOpenMembers"
          />

          <TasksListPanel
            :tasks="tasks"
            :loading="loading"
            :is-leader="isLeader"
            @add-task="goToAddTask"
            @toggle-task="finishToggle"
            @edit-task="goToEditTask"
            @delete-task="(task) => confirmDelete(task as any)"
          />
        </div>
      </div>
    </main>

    <Managemembersmodal
      :show="showMemberModal"
      :project-title="selectedProject?.title"
      :members="memberList"
      :is-leader="isLeader"
      :loading-members="loadingMembers"
      :inviting="inviting"
      :invite-message="inviteMessage"
      :invite-success="inviteSuccess"
      :generated-code="generatedCode"
      :generating-code="generatingCode"
      :code-copied="codeCopied"
      :invite-user-id="inviteUserId"
      @close="closeMemberModal"
      @invite="() => submitInvite(selectedProject?.id)"
      @generate-code="() => submitGenerateCode(selectedProject?.id)"
      @copy-code="copyCode"
      @kick="(userId) => handleKick(userId, selectedProject!.id, () => fetchMembers(selectedProject!.id))"
      @update:invite-user-id="inviteUserId = $event"
    />

    <!-- Confirm Delete Task Modal -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="confirm-backdrop" @click.self="cancelDelete">
        <div class="confirm-box">
          <div class="confirm-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="confirm-title">Hapus Task?</h3>
          <p class="confirm-desc">
            <template v-if="itemToDelete?.type === 'project'">
              Proyek <strong>"{{ itemToDelete?.title }}"</strong> beserta semua task-nya akan dihapus secara permanen.
            </template>
            <template v-else>
              Task <strong>"{{ itemToDelete?.title }}"</strong> akan dihapus secara permanen dan tidak dapat dikembalikan.
            </template>
          </p>
          <div class="confirm-actions">
            <button class="btn-ghost" @click="cancelDelete" :disabled="deleteLoading">Batal</button>
            <button class="btn-danger" @click="handleConfirmDelete" :disabled="deleteLoading">
              {{ deleteLoading ? 'Menghapus...' : 'Ya, Hapus' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue"
import { useRoute } from "vue-router"
import AppSidebar from "@/components/AppSidebar.vue"
import AppHeader from "@/components/AppHeader.vue"
import TasksStats from "@/components/TasksStats.vue"
import TasksListPanel from "@/components/TasksListPanel.vue"
import Managemembersmodal from "@/components/Managemembersmodal.vue"
// import { useTasks } from "@/composables/useTasks"
// import { useProject } from "@/composables/useProject"
import { useList } from "@/composables/useList"
import { useInvite } from "@/composables/useInvite"
import { useDelete } from "@/composables/useDelete"

// const {
//   // showMemberModal,
//   // selectedProject,
//   // memberList,
//   // loadingMembers,   
//   // inviteUserId,
//   // inviting,
//   // inviteMessage,
//   // inviteSuccess,
//   // generatedCode,
//   // generatingCode,
//   // codeCopied,
//   //openMemberModal,
//   //closeMemberModal,
//   //submitInvite,
//   //submitGenerateCode,
//   //copyCode,
//   //handleKick,
// } = useProject()

// const {
//   //user,
//   //project,    
//   //userInitial,
//   //currentDate,
//   // completedTasks,
//   //pendingTasks,
//   //progressPercentage,
//   //isLeader,
//   // toggleTask,
//   // goToAddTask,
//   // goToEditTask,
//   //handleDeleteTask,
//   // handleLogout,
// } = useTasks()

const {
  user,
  userInitial,
  tasks,
  currentDate,
  loading,
  completionPercent,
  completedTasks,
  pendingTasks,
  isLeader,
  project,
  showMemberModal,
  selectedProject,
  memberList,
  loadingMembers,
  fetchItems,
  fetchMembers,
  goToAddTask,
  goToEditTask,
  finishToggle,
  openMemberModal,
  closeMemberModal,
  handleLogout,
} = useList()

const {
  inviteUserId,
  inviting,
  inviteMessage,
  inviteSuccess,
  generatedCode,
  generatingCode,
  codeCopied,
  submitInvite,
  submitGenerateCode,
  handleKick,
  copyCode,
} = useInvite()

const route = useRoute()

const {
  error,
  loading: deleteLoading,
  showDeleteConfirm,
  itemToDelete,
  confirmDeleteTask,
  cancelDelete,
  handleConfirmDelete,
} = useDelete()

function confirmDelete(task: { id: number; title: string; [key: string]: unknown }) {
  confirmDeleteTask(task, fetchItems)
}

const deadlineWarning = computed(() => {
  if (!project.value?.deadline) return null
  const now = new Date()
  now.setHours(0, 0, 0, 0)
  const dl = new Date(project.value.deadline)
  dl.setHours(0, 0, 0, 0)
  const diff = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
  if (diff < 0) return '⚠ Deadline telah lewat!'
  if (diff === 0) return '⚠ Deadline hari ini!'
  if (diff <= 7) return `⚠ ${diff} hari lagi!`
  return null
})

function handleOpenMembers() {
  if (project.value) {
    openMemberModal(project.value)
  }
}

onMounted(fetchItems)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* Confirm Delete Modal */
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.confirm-box {
  background: #0f172a;
  border-radius: 16px;
  padding: 32px 28px;
  width: 100%;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5), 0 4px 24px rgba(30, 58, 138, 0.3);
  border-top: 4px solid #3b82f6;
}

.confirm-icon {
  width: 64px;
  height: 64px;
  background: #1e3a8a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.confirm-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 10px;
}

.confirm-desc {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 24px;
  line-height: 1.6;
}

.confirm-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
}

.btn-ghost {
  padding: 10px 22px;
  border: 1.5px solid #334155;
  background: transparent;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  color: #94a3b8;
  transition: background 0.2s;
}

.btn-ghost:hover:not(:disabled) {
  background: #1e293b;
}

.btn-danger {
  padding: 10px 22px;
  background: #1e3a8a;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-danger:hover:not(:disabled) {
  background: #1e40af;
}

.btn-danger:disabled,
.btn-ghost:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #080c14;
  font-family: 'Sora', sans-serif;
  color: #e2e8f0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.content-body {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}

.content-inner {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-intro {
  padding: 16px 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(99, 102, 241, 0.08));
  border: 1px solid rgba(148, 163, 184, 0.14);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.intro-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.intro-eyebrow {
  margin: 0 0 4px;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #38bdf8;
  font-weight: 600;
}

.intro-title {
  margin: 0;
  font-size: 1.15rem;
  color: #f1f5f9;
  font-weight: 700;
}

.intro-desc {
  margin: 6px 0 0;
  font-size: 0.82rem;
  color: #94a3b8;
}

.intro-deadline {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
  flex-shrink: 0;
}

.deadline-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #64748b;
  font-weight: 600;
}

.deadline-value {
  font-size: 0.85rem;
  font-weight: 700;
  color: #f59e0b;
  background: rgba(245, 158, 11, 0.1);
  border: 1px solid rgba(245, 158, 11, 0.25);
  padding: 4px 10px;
  border-radius: 8px;
}

.deadline-warn {
  font-size: 0.75rem;
  font-weight: 700;
  color: #f87171;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 3px 10px;
  border-radius: 8px;
  animation: pulse-border 2s ease-in-out infinite;
}

@keyframes pulse-border {
  0%, 100% { border-color: rgba(239, 68, 68, 0.3); }
  50%       { border-color: rgba(239, 68, 68, 0.7); }
}

@media (max-width: 900px) {
  .content-body { padding: 16px; }
  .page-intro { padding: 14px; }
}
</style>