<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-box">
        <!-- Header -->
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="modal-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Undangan Masuk</h3>
              <p class="modal-sub">Undangan langsung dari leader proyek</p>
            </div>
          </div>
          <div class="header-right">
            <span v-if="invitations.length > 0" class="badge">{{ invitations.length }}</span>
            <button class="modal-close" @click="$emit('close')">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <!-- Loading -->
          <div v-if="loading" class="state-center">
            <svg class="spin" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
            <span>Memuat undangan...</span>
          </div>

          <!-- Empty -->
          <div v-else-if="invitations.length === 0" class="state-center">
            <div class="empty-icon">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </div>
            <p>Tidak ada undangan masuk</p>
          </div>

          <!-- List -->
          <div v-else class="invite-list">
            <div
              v-for="inv in invitations"
              :key="inv.id"
              class="invite-item"
              :class="{ 'processing': processingId === inv.id }"
            >
              <div class="invite-icon">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"/>
                </svg>
              </div>
              <div class="invite-info">
                <span class="project-name">{{ inv.project_title }}</span>
                <span class="invited-by">Diundang oleh <strong>{{ inv.invited_by_name }}</strong></span>
                <span class="invite-time">{{ formatDate(inv.created_at) }}</span>
              </div>
              <div class="invite-actions">
                <button
                  class="btn-decline"
                  :disabled="processingId === inv.id"
                  @click="$emit('decline', inv.id)"
                >
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                  Tolak
                </button>
                <button
                  class="btn-accept"
                  :disabled="processingId === inv.id"
                  @click="$emit('accept', inv.id)"
                >
                  <svg v-if="processingId !== inv.id" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  <svg v-else class="spin" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                    <path d="M12 3a9 9 0 1 0 9 9"/>
                  </svg>
                  {{ processingId === inv.id ? '...' : 'Terima' }}
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
export interface Invitation {
  id: number
  project_title: string
  project_id: number
  invited_by_name: string
  created_at: string
}

const props = defineProps<{
  show: boolean
  loading: boolean
  invitations: Invitation[]
  processingId: number | null
}>()

defineEmits<{
  (e: 'close'): void
  (e: 'accept', id: number): void
  (e: 'decline', id: number): void
}>()

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

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
  max-width: 460px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0, 0, 0, 0.5);
  font-family: 'Sora', sans-serif;
}

/* ── Header ── */
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
  border: 1px solid rgba(139, 92, 246, 0.25);
  background: rgba(139, 92, 246, 0.1);
  color: #a78bfa;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: #f1f5f9;
  margin-bottom: 2px;
}

.modal-sub {
  font-size: 0.7rem;
  color: #475569;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: white;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 2px 7px;
  border-radius: 20px;
  min-width: 20px;
  text-align: center;
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
.modal-close:hover { color: #f87171; border-color: rgba(248, 113, 113, 0.3); }

/* ── Body ── */
.modal-body {
  padding: 16px 20px;
  min-height: 120px;
  max-height: 420px;
  overflow-y: auto;
}

.state-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px 0;
  color: #475569;
  font-size: 0.82rem;
}

.empty-icon {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #334155;
}

/* ── Invite List ── */
.invite-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.invite-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 15px;
  background: rgba(255, 255, 255, 0.025);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 12px;
  transition: background 0.2s, border-color 0.2s;
}

.invite-item:hover {
  background: rgba(255, 255, 255, 0.04);
  border-color: rgba(255, 255, 255, 0.09);
}

.invite-item.processing {
  opacity: 0.6;
  pointer-events: none;
}

.invite-icon {
  width: 36px;
  height: 36px;
  border-radius: 9px;
  background: rgba(99, 102, 241, 0.1);
  border: 1px solid rgba(99, 102, 241, 0.2);
  color: #818cf8;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.invite-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
  flex: 1;
  min-width: 0;
}

.project-name {
  font-size: 0.84rem;
  font-weight: 600;
  color: #e2e8f0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.invited-by {
  font-size: 0.73rem;
  color: #475569;
}

.invited-by strong {
  color: #64748b;
  font-weight: 600;
}

.invite-time {
  font-size: 0.68rem;
  color: #334155;
}

/* ── Buttons ── */
.invite-actions {
  display: flex;
  gap: 7px;
  flex-shrink: 0;
}

.btn-accept, .btn-decline {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 12px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-accept {
  background: linear-gradient(135deg, #059669, #0891b2);
  color: white;
  border: none;
}
.btn-accept:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-accept:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.btn-decline {
  background: transparent;
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.07);
}
.btn-decline:hover { color: #f87171; border-color: rgba(248, 113, 113, 0.25); }
.btn-decline:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Animation ── */
.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.2s; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(0.96) translateY(6px); }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }
</style>
