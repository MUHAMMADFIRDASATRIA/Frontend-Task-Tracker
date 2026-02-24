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

        <!-- Toast messages -->
        <Transition name="toast">
          <div v-if="successMsg" class="toast toast-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ successMsg }}
          </div>
        </Transition>
        <Transition name="toast">
          <div v-if="errorMsg" class="toast toast-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ errorMsg }}
          </div>
        </Transition>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat profil...</p>
        </div>

        <template v-else>
          <ProfileSummaryCard
            :user="user"
            :photo-preview="photoPreview"
            @photo-selected="onPhotoChange"
            @remove-photo="removePhoto"
          />

          <ProfileEditFormCard
            :form="form"
            :saving="saving"
            @update:form="updateForm"
            @submit="saveProfile"
          />

          <ProfileDangerZone :deleting="deleting" @delete-account="deleteAccount" />
        </template>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import ProfileSummaryCard from '@/components/ProfileSummaryCard.vue'
import ProfileEditFormCard from '@/components/ProfileEditFormCard.vue'
import ProfileDangerZone from '@/components/ProfileDangerZone.vue'
import { useEditProfile } from '@/composables/useEditProfile'

const {
  user,
  userInitial,
  currentDate,
  loading,
  form,
  photoPreview,
  saving,
  deleting,
  successMsg,
  errorMsg,
  loadProfile,
  onPhotoChange,
  removePhoto,
  updateForm,
  saveProfile,
  handleLogout,
  deleteAccount,
} = useEditProfile()

onMounted(loadProfile)
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

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
  min-height: 0;
  overflow-y: auto;
}

.content-body {
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: visible;
  flex: 1;
  min-height: fit-content;
}

/* ── Toast ── */
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
}

.toast-success {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #4ade80;
}

.toast-error {
  background: rgba(248, 113, 113, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.25);
  color: #f87171;
}

.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Loading ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 0;
  color: #475569;
  font-size: 0.9rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(34, 211, 238, 0.15);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

</style>
