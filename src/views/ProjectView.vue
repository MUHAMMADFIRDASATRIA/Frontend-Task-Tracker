<template>
  <div class="app-shell">
    <AppSidebar :user="user" :user-initial="userInitial" @logout="handleLogout" />

    <main class="main-content">
      <AppHeader
        :user="user"
        :user-initial="userInitial"
        :current-date="currentDate"
      />

      <div class="content-body">
        <!-- Page Header -->
        <div class="page-header-row">
          <ProjectPageHeader
            title="Proyek Saya"
            subtitle="Kelola dan pantau semua proyek Anda"
          />
          <button class="btn-join-outline" @click="showJoinModal = true">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Gabung Proyek
          </button>
        </div>

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
            @delete="handleDeleteProject"
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

    <!-- Manage Members Modal -->
    <Managemembersmodal
      :show="showMemberModal"
      :project-title="selectedProject?.title"
      :members="memberList"
      :loading-members="loadingMembers"
      :inviting="inviting"
      :invite-message="inviteMessage"
      :invite-success="inviteSuccess"
      :generated-code="generatedCode"
      :generating-code="generatingCode"
      :code-copied="codeCopied"
      :invite-user-id="inviteUserId"
      @close="closeMemberModal"
      @invite="submitInvite"
      @generate-code="submitGenerateCode"
      @copy-code="copyCode"
      @kick="handleKick"
      @update:invite-user-id="inviteUserId = $event"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import ProjectPageHeader from '@/components/ProjectPageHeader.vue'
import ProjectToolbar from '@/components/ProjectToolbar.vue'
import ProjectCard from '@/components/ProjectCard.vue'
import CreateProjectModal from '@/components/CreateProjectModal.vue'
import Joinprojectmodal from '@/components/Joinprojectmodal.vue'
import Managemembersmodal from '@/components/Managemembersmodal.vue'
import { useProject } from '@/composables/useProject'
import type { ProjectWithRole } from '@/types/project'

const {
  user,
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

  showJoinModal,
  joinCode,
  joining,
  joinError,
  submitJoin,

  showMemberModal,
  selectedProject,
  memberList,
  loadingMembers,
  inviteUserId,
  inviting,
  inviteMessage,
  inviteSuccess,
  generatedCode,
  generatingCode,
  codeCopied,
  openMemberModal,
  closeMemberModal,
  submitInvite,
  submitGenerateCode,
  copyCode,
  handleKick,
} = useProject()

onMounted(loadData)
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
</style>