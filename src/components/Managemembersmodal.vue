<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="modal-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Kelola Anggota</h3>
              <p class="modal-sub">{{ projectTitle }}</p>
            </div>
          </div>
          <button class="modal-close" @click="$emit('close')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <div class="modal-form">
          <!-- Tabs -->
          <div class="member-tabs">
            <button class="member-tab" :class="{ active: activeTab === 'invite' }" @click="activeTab = 'invite'">
              Invite by User ID
            </button>
            <button class="member-tab" :class="{ active: activeTab === 'code' }" @click="activeTab = 'code'">
              Kode Undangan
            </button>
          </div>

          <!-- Tab: Invite by User ID -->
          <div v-if="activeTab === 'invite'" class="tab-content">
            <div class="form-group">
              <label>User ID <span class="req">*</span></label>
              <div class="input-row">
                <input v-model="localInviteUserId" type="text" placeholder="Masukkan User ID anggota" />
                <button class="btn-inline" :disabled="inviting || !localInviteUserId.trim()" @click="handleInvite">
                  <svg v-if="!inviting" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  <svg v-else class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M12 3a9 9 0 1 0 9 9"/>
                  </svg>
                  Kirim
                </button>
              </div>
              <p class="field-hint">User ID dapat ditemukan di halaman profil pengguna.</p>
            </div>
            <div v-if="inviteMessage" class="feedback-msg" :class="inviteSuccess ? 'feedback-ok' : 'feedback-err'">
              {{ inviteMessage }}
            </div>
          </div>

          <!-- Tab: Kode Undangan -->
          <div v-if="activeTab === 'code'" class="tab-content">
            <div v-if="generatedCode" class="code-display">
              <span class="code-display-label">Kode Undangan Aktif</span>
              <div class="code-display-row">
                <span class="code-display-text">{{ generatedCode }}</span>
                <button class="btn-copy" :class="{ copied: codeCopied }" @click="$emit('copy-code')">
                  <svg v-if="!codeCopied" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
                  </svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  {{ codeCopied ? 'Tersalin!' : 'Salin' }}
                </button>
              </div>
              <span class="code-display-expires">Berlaku 7 hari sejak dibuat</span>
            </div>

            <div v-else class="code-empty">
              <div class="code-empty-icon">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </div>
              <p>Belum ada kode undangan aktif</p>
            </div>

            <button class="btn-generate" :disabled="generatingCode" @click="$emit('generate-code')">
              <svg v-if="!generatingCode" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
              </svg>
              <svg v-else class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 3a9 9 0 1 0 9 9"/>
              </svg>
              {{ generatingCode ? 'Membuat...' : generatedCode ? 'Generate Ulang' : 'Generate Kode' }}
            </button>
          </div>

          <!-- Member List -->
          <div class="member-section">
            <p class="member-section-title">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              Anggota Saat Ini ({{ members.length }})
            </p>

            <div v-if="loadingMembers" class="member-loading">
              <div class="spinner"></div>
            </div>

            <div v-else class="member-list">
              <div v-for="member in members" :key="member.id" class="member-row">
                <div class="member-avatar">{{ getInitial(member.user?.name) }}</div>
                <div class="member-info">
                  <span class="member-name">{{ member.user?.name || 'Pengguna' }}</span>
                  <span class="member-uid">ID: {{ member.user_id }}</span>
                </div>
                <span class="member-role" :class="member.role === 'leader' ? 'role-leader' : 'role-member'">
                  {{ member.role === 'leader' ? 'Leader' : 'Member' }}
                </span>
                <button v-if="member.role !== 'leader'" class="btn-kick" title="Keluarkan" @click="$emit('kick', member.user_id)">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface ProjectMember {
  id: number
  user_id: number
  role: 'leader' | 'member'
  user?: { name?: string }
}

const props = defineProps<{
  show: boolean
  projectTitle?: string
  members: ProjectMember[]
  loadingMembers: boolean
  inviting: boolean
  inviteMessage: string
  inviteSuccess: boolean
  generatedCode: string
  generatingCode: boolean
  codeCopied: boolean
  inviteUserId: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'invite'): void
  (e: 'generate-code'): void
  (e: 'copy-code'): void
  (e: 'kick', userId: number): void
  (e: 'update:inviteUserId', value: string): void
}>()

const activeTab = ref<'invite' | 'code'>('invite')
const localInviteUserId = ref(props.inviteUserId)

watch(() => props.inviteUserId, (val) => (localInviteUserId.value = val))
watch(localInviteUserId, (val) => emit('update:inviteUserId', val))
watch(() => props.show, (val) => {
  if (val) activeTab.value = 'invite'
})

const handleInvite = () => {
  if (!localInviteUserId.value.trim()) return
  emit('invite')
}

const getInitial = (name?: string) => (name ? name.charAt(0).toUpperCase() : '?')
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  padding: 24px;
}

.modal-box {
  background: #0d1424;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  width: 100%;
  max-width: 540px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 22px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.modal-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  border: 1px solid rgba(6, 182, 212, 0.2);
  background: rgba(6, 182, 212, 0.1);
  color: #22d3ee;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 2px;
}

.modal-sub {
  font-size: 0.7rem;
  color: #475569;
  margin: 0;
}

.modal-close {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: #475569;
  cursor: pointer;
  transition: all 0.15s;
}

.modal-close:hover {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.modal-form {
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.member-tabs {
  display: flex;
  gap: 4px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 4px;
}

.member-tab {
  flex: 1;
  padding: 7px;
  border: none;
  border-radius: 7px;
  background: transparent;
  color: #475569;
  font-size: 0.77rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
}

.member-tab.active {
  background: rgba(99, 102, 241, 0.14);
  color: #818cf8;
}

.tab-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-group label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #64748b;
}

.req { color: #f87171; }

.input-row {
  display: flex;
  gap: 8px;
}

.input-row input {
  flex: 1;
  padding: 10px 13px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  color: #e2e8f0;
  font-family: 'Sora', sans-serif;
  font-size: 0.84rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.input-row input:focus {
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.07);
}

.input-row input::placeholder { color: #334155; }

.field-hint {
  font-size: 0.7rem;
  color: #334155;
  line-height: 1.5;
}

.btn-inline {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 14px;
  background: rgba(99, 102, 241, 0.12);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 9px;
  font-size: 0.78rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.15s;
}

.btn-inline:hover { background: rgba(99, 102, 241, 0.22); }
.btn-inline:disabled { opacity: 0.4; cursor: not-allowed; }

.feedback-msg {
  padding: 9px 13px;
  border-radius: 9px;
  font-size: 0.77rem;
  font-weight: 500;
}

.feedback-ok { background: rgba(16, 185, 129, 0.08); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.2); }
.feedback-err { background: rgba(244, 63, 94, 0.08); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.2); }

.code-display {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 18px;
  background: rgba(6, 182, 212, 0.04);
  border: 1px solid rgba(6, 182, 212, 0.12);
  border-radius: 12px;
}

.code-display-label {
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0891b2;
}

.code-display-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.code-display-text {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.5rem;
  font-weight: 700;
  color: #22d3ee;
  letter-spacing: 0.14em;
}

.code-display-expires {
  font-size: 0.68rem;
  color: #334155;
}

.btn-copy {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 5px 11px;
  background: rgba(6, 182, 212, 0.1);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.2);
  border-radius: 7px;
  font-size: 0.72rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-copy.copied {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.2);
}

.code-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px dashed rgba(255, 255, 255, 0.07);
  border-radius: 12px;
  color: #334155;
  font-size: 0.77rem;
}

.code-empty-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.03);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #1e293b;
}

.btn-generate {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 10px;
  background: rgba(6, 182, 212, 0.07);
  color: #22d3ee;
  border: 1px solid rgba(6, 182, 212, 0.14);
  border-radius: 10px;
  font-size: 0.8rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-generate:hover { background: rgba(6, 182, 212, 0.13); }
.btn-generate:disabled { opacity: 0.4; cursor: not-allowed; }

.member-section {
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  padding-top: 14px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.member-section-title {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #475569;
  margin: 0;
}

.member-loading {
  display: flex;
  justify-content: center;
  padding: 10px 0;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(99, 102, 241, 0.15);
  border-top-color: #818cf8;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.member-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 220px;
  overflow-y: auto;
}

.member-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 12px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 10px;
}

.member-avatar {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(139, 92, 246, 0.2));
  border: 1px solid rgba(99, 102, 241, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 700;
  color: #818cf8;
  flex-shrink: 0;
}

.member-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.member-name { font-size: 0.8rem; font-weight: 600; color: #e2e8f0; }
.member-uid { font-size: 0.66rem; color: #334155; font-family: 'JetBrains Mono', monospace; }

.member-role {
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 2px 7px;
  border-radius: 5px;
  flex-shrink: 0;
}

.role-leader { background: rgba(234, 179, 8, 0.1); color: #fbbf24; border: 1px solid rgba(234, 179, 8, 0.2); }
.role-member { background: rgba(99, 102, 241, 0.1); color: #818cf8; border: 1px solid rgba(99, 102, 241, 0.2); }

.btn-kick {
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 7px;
  color: #334155;
  cursor: pointer;
  transition: all 0.15s;
  flex-shrink: 0;
}

.btn-kick:hover {
  background: rgba(244, 63, 94, 0.1);
  color: #f87171;
  border-color: rgba(244, 63, 94, 0.2);
}

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.2s; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(0.96) translateY(6px); }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }
</style>