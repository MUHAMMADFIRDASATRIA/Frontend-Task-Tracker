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
        <!-- Page Header -->
        <ProjectPageHeader
          title="Proyek Saya"
          subtitle="Kelola dan pantau semua proyek Anda"
        >
          <button class="btn-join-outline" @click="openInvitationModal">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            Undangan<span v-if="pendingInvitations.length"> ({{ pendingInvitations.length }})</span>
          </button>
          <button class="btn-join-outline" @click="showJoinModal = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Gabung Proyek
          </button>
          <RouterLink class="btn-primary" to="/projects/create">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
            Proyek Baru
          </RouterLink>
        </ProjectPageHeader>

        <!-- Toolbar -->
        <ProjectToolbar
          v-model:search="search"
          v-model:filter-status="filterStatus"
          :filter-tabs="filterTabs"
          :count="filteredProjects.length"
        />

        <!-- Loading State -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat proyek...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="filteredProjects.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" opacity="0.3">
            <path
              d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
              stroke="currentColor"
              stroke-width="1.5"
            />
          </svg>
          <p>Belum ada proyek ditemukan</p>
          <button class="btn-primary" @click="showCreateModal = true">Buat Proyek Pertama</button>
        </div>

        <!-- Project Grid -->
        <div v-else class="project-grid">
          <ProjectCard
            v-for="project in filteredProjects"
            :key="project.id"
            :project="project"
            @click="goToProject(project.id)"
            @edit="handleEditProject"
            @delete="(project) => confirmDeleteProject(project, fetchItems)"
            @manage-members="openMemberModal(project)"
          />
        </div>
      </div>
    </main>

    <!-- Create Project Modal -->
    <CreateProjectModal
      :show="showCreateModal"
      :creating="creating"
      @close="showCreateModal = false"
      @submit="handleCreateProject"
    />

    <!-- Join Project Modal -->
    <Joinprojectmodal
      :show="showJoinModal"
      :joining="joining"
      :error="joinError"
      v-model="joinCode"
      @close="showJoinModal = false"
      @submit="submitJoin"
    />

    <!-- Invitation List Modal -->
    <InvitationListModal
      :show="showInvitationModal"
      :loading="loadingInvitations"
      :invitations="pendingInvitations"
      :processing-id="inviteProcessingId"
      @close="closeInvitationModal"
      @accept="(id) => acceptInvitation(id, fetchItems)"
      @decline="declineInvitation"
    />

    <!-- Manage Members Modal -->
    <Managemembersmodal
      :show="showMemberModal"
      :project-title="selectedProject?.title"
      :members="memberList"
      :loading-members="loadingMembers"
      :inviting="inviting"
      :is-leader="selectedProject?.role === 'leader'"
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
      @kick="handleKick"
      @update:invite-user-id="inviteUserId = $event"
    />

    <!-- Confirm Delete Modal -->
    <Transition name="modal">
      <div v-if="showDeleteConfirm" class="confirm-backdrop" @click.self="cancelDelete">
        <div class="confirm-box">
          <div class="confirm-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
              <path d="M12 9v4M12 17h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </div>
          <h3 class="confirm-title">Hapus Proyek?</h3>
          <p class="confirm-desc">
            Proyek <strong>"{{ itemToDelete?.title }}"</strong> beserta semua task-nya akan dihapus secara permanen dan tidak dapat dikembalikan.
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
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import ProjectPageHeader from '@/components/ProjectPageHeader.vue'
import ProjectToolbar from '@/components/ProjectToolbar.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import CreateProjectModal from '@/components/CreateProjectModal.vue'
import Joinprojectmodal from '@/components/Joinprojectmodal.vue'
import InvitationListModal from '@/components/InvitationListModal.vue'
import Managemembersmodal from '@/components/Managemembersmodal.vue'
import { useList } from '@/composables/useList'
import { useCreateProject } from '@/composables/useCreate'
import { useDelete } from '@/composables/useDelete'
import { useInvite } from '@/composables/useInvite'

// const {
//   showCreateModal,          // → ref(false) lokal
//   creating,                 // → useCreateProject (loading)
//   // userInitial,            // → useList
//   // currentDate,            // → useList
//   loadData,                 // → useInvite (loadData)
//   handleCreateProject,      // → useCreateProject (handleSubmit)
//   goToProject,              // → lokal (router.push)
//   handleEditProject,        // → lokal (router.push)
//   handleDeleteProject,      // → useDelete (deleteProject) + lokal wrapper
//   // handleLogout,           // → useList
//
//   showJoinModal,            // → ref(false) lokal
//   joinCode,                 // → useInvite
//   joining,                  // → useInvite
//   joinError,                // → useInvite
//   submitJoin,               // → useInvite
//
//   showInvitationModal,      // → ref(false) lokal
//   pendingInvitations,       // → useInvite
//   loadingInvitations,       // → useInvite
//   inviteProcessingId,       // → useInvite
//   // openInvitationModal,    // → lokal
//   // closeInvitationModal,   // → lokal
//   acceptInvitation,         // → lokal
//   declineInvitation,        // → lokal
//
//   // showMemberModal,        // → useList
//   // selectedProject,        // → useList
//   // memberList,             // → useList
//   // loadingMembers,         // → useList
//   inviteUserId,             // → useInvite
//   inviting,                 // → useInvite
//   inviteMessage,            // → useInvite
//   inviteSuccess,            // → useInvite
//   generatedCode,            // → useInvite
//   generatingCode,           // → useInvite
//   codeCopied,               // → useInvite
//   // openMemberModal,        // → useList
//   // closeMemberModal,       // → useList
//   submitInvite,             // → useInvite
//   submitGenerateCode,       // → useInvite
//   copyCode,                 // → useInvite
//   handleKick,               // → useInvite
//   // openInvitationModal,   // → useList
//   // closeInvitationModal,  // → useList
// } = useProject()

const router = useRouter()

//pindahkan nanti
const {
  showCreateModal,
  loading: creating,
  handleSubmit: handleCreateProject,
} = useCreateProject()

const {
  loading: deleteLoading,
  showDeleteConfirm,
  itemToDelete,
  confirmDeleteProject,
  cancelDelete,
  handleConfirmDelete,
} = useDelete()

const {
  showJoinModal,
  showInvitationModal,
  joinCode,
  joining,
  joinError,
  submitJoin,
  pendingInvitations,
  loadingInvitations,
  inviteProcessingId,
  openInvitationModal,
  closeInvitationModal,
  acceptInvitation,
  declineInvitation,
  inviteUserId,
  inviting,
  inviteMessage,
  inviteSuccess,
  generatedCode,
  generatingCode,
  codeCopied,
  submitInvite,
  submitGenerateCode,
  copyCode,
  handleKick: kickMember,
} = useInvite()

const {
  user,
  userInitial,
  currentDate,
  loading,
  search,
  filterStatus,
  filterTabs,
  filteredProjects,
  fetchItems,
  showMemberModal,
  selectedProject,
  memberList,
  loadingMembers,
  openMemberModal,
  closeMemberModal,
  fetchMembers,
  goToProject,
  handleEditProject,
  handleLogout,
} = useList()

const handleKick = (userId: number) => {
  if (!selectedProject.value) return
  kickMember(userId, selectedProject.value.id, () => fetchMembers(selectedProject.value!.id))
}

onMounted(() => {
  fetchItems()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
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
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  flex: 1;
}

/* ── Page Header Row ── */
.page-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.btn-join-outline {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 16px;
  background: transparent;
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-top: 0;
  align-self: center;
}

.btn-join-outline:hover {
  color: #e2e8f0;
  border-color: rgba(255, 255, 255, 0.18);
  background: rgba(255, 255, 255, 0.04);
}

/* ── States ── */
.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 16px;
  padding: 80px 0;
  color: #475569;
  font-size: 0.9rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(99, 102, 241, 0.2);
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ── Project Grid ── */
.project-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
}

/* ── Button ── */
.btn-primary {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
}

.btn-primary:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* ── Confirm Delete Modal ── */
.confirm-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
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

.btn-ghost:hover:not(:disabled) { background: #1e293b; }

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

.btn-danger:hover:not(:disabled) { background: #1e40af; }

.btn-danger:disabled,
.btn-ghost:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-enter-active,
.modal-leave-active { transition: opacity 0.2s ease; }

.modal-enter-from,
.modal-leave-to { opacity: 0; }
</style>