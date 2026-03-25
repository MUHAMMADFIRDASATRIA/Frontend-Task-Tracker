<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          class="toast"
          :class="`toast--${toast.type}`"
          @click="removeToast(toast.id)"
        >
          <!-- Glow accent bar -->
          <div class="toast-bar"></div>

          <!-- Icon circle -->
          <div class="toast-icon-wrap">
            <svg v-if="toast.type === 'success'" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <svg v-else-if="toast.type === 'error'" width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"/>
            </svg>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </div>

          <!-- Text -->
          <div class="toast-body">
            <span class="toast-label">
              {{ toast.type === 'success' ? 'Berhasil' : toast.type === 'error' ? 'Gagal' : 'Info' }}
            </span>
            <span class="toast-message">{{ toast.message }}</span>
          </div>

          <!-- Close button -->
          <button class="toast-close" @click.stop="removeToast(toast.id)">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '@/composables/useToast'
const { toasts, removeToast } = useToast()
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 12px;
  pointer-events: none;
}

.toast {
  position: relative;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px 14px 14px;
  border-radius: 14px;
  min-width: 300px;
  max-width: 400px;
  cursor: pointer;
  pointer-events: all;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.06);
  backdrop-filter: blur(16px);
}

/* Success */
.toast--success {
  background: linear-gradient(135deg, #0d1f12 0%, #0f2918 100%);
  box-shadow: 0 0 0 1px rgba(34, 197, 94, 0.15), 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 32px rgba(34, 197, 94, 0.08);
}
.toast--success .toast-bar { background: linear-gradient(180deg, #4ade80, #16a34a); }
.toast--success .toast-icon-wrap { background: rgba(34, 197, 94, 0.15); color: #4ade80; }
.toast--success .toast-label { color: #4ade80; }

/* Error */
.toast--error {
  background: linear-gradient(135deg, #1a0a0a 0%, #200d0d 100%);
  box-shadow: 0 0 0 1px rgba(239, 68, 68, 0.15), 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 32px rgba(239, 68, 68, 0.08);
}
.toast--error .toast-bar { background: linear-gradient(180deg, #f87171, #dc2626); }
.toast--error .toast-icon-wrap { background: rgba(239, 68, 68, 0.15); color: #f87171; }
.toast--error .toast-label { color: #f87171; }

/* Info */
.toast--info {
  background: linear-gradient(135deg, #0a0f1a 0%, #0c1529 100%);
  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.15), 0 12px 40px rgba(0, 0, 0, 0.5), 0 0 32px rgba(59, 130, 246, 0.08);
}
.toast--info .toast-bar { background: linear-gradient(180deg, #60a5fa, #2563eb); }
.toast--info .toast-icon-wrap { background: rgba(59, 130, 246, 0.15); color: #60a5fa; }
.toast--info .toast-label { color: #60a5fa; }

/* Accent bar kiri */
.toast-bar {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  border-radius: 14px 0 0 14px;
}

/* Icon circle */
.toast-icon-wrap {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 6px;
}

/* Text */
.toast-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toast-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.toast-message {
  font-size: 0.875rem;
  font-weight: 500;
  color: #cbd5e1;
  line-height: 1.4;
}

/* Close button */
.toast-close {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.06);
  border: none;
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s, color 0.15s;
}
.toast-close:hover {
  background: rgba(255, 255, 255, 0.12);
  color: #94a3b8;
}

/* Transitions */
.toast-enter-active {
  transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.toast-leave-active {
  transition: all 0.2s ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(80px) scale(0.9);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(80px) scale(0.9);
}
</style>
