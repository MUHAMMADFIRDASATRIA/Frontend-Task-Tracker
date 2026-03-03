<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-box">
        <div class="modal-header">
          <div class="modal-header-left">
            <div class="modal-icon">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
            </div>
            <div>
              <h3 class="modal-title">Gabung Proyek</h3>
              <p class="modal-sub">Masukkan kode undangan dari leader</p>
            </div>
          </div>
          <button class="modal-close" @click="$emit('close')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Success State -->
        <div v-if="joinSuccess" class="success-body">
          <div class="success-icon-wrap">
            <div class="success-ring"></div>
            <svg class="success-check" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <h3 class="success-title">Berhasil Bergabung!</h3>
          <p class="success-desc">
            <template v-if="joinedProjectName">Kamu sekarang menjadi anggota proyek <strong>{{ joinedProjectName }}</strong>.</template>
            <template v-else>Kamu berhasil bergabung dengan proyek.</template>
          </p>
          <div class="success-actions">
            <button class="btn-green" @click="$emit('close')">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Lihat Proyek
            </button>
          </div>
        </div>

        <!-- Form State -->
        <div v-else class="modal-form">
          <div class="join-illustration">
            <div class="code-dots">
              <span v-for="n in 8" :key="n" class="code-dot" :style="{ animationDelay: (n * 0.1) + 's' }"></span>
            </div>
            <p class="join-hint">Kode terdiri dari 8 karakter huruf dan angka</p>
          </div>

          <div class="form-group">
            <label>Kode Undangan <span class="req">*</span></label>
            <input
              v-model="localCode"
              type="text"
              placeholder="Contoh: AB12CD34"
              maxlength="8"
              class="code-input"
              @input="localCode = localCode.toUpperCase()"
            />
          </div>

          <div v-if="error" class="alert-error">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ error }}
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-ghost" @click="$emit('close')">Batal</button>
            <button class="btn-green" :disabled="joining || localCode.length < 8" @click="handleJoin">
              <svg v-if="!joining" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                <polyline points="10 17 15 12 10 7"/>
                <line x1="15" y1="12" x2="3" y2="12"/>
              </svg>
              <svg v-else class="spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 3a9 9 0 1 0 9 9"/>
              </svg>
              {{ joining ? 'Bergabung...' : 'Gabung' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = defineProps<{
  show: boolean
  joining: boolean
  error: string
  modelValue: string
  joinSuccess?: boolean
  joinedProjectName?: string
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit'): void
  (e: 'update:modelValue', value: string): void
}>()

const localCode = ref(props.modelValue)

watch(() => props.modelValue, (val) => (localCode.value = val))
watch(localCode, (val) => emit('update:modelValue', val))
watch(() => props.show, (val) => { if (!val) localCode.value = '' })

const handleJoin = () => {
  if (localCode.value.length < 8) return
  emit('submit')
}
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
  max-width: 420px;
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
  border: 1px solid rgba(16, 185, 129, 0.2);
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
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

.join-illustration {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 10px 0;
}

.code-dots { display: flex; gap: 5px; }

.code-dot {
  width: 26px;
  height: 34px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 7px;
  animation: pulse-dot 1.6s ease-in-out infinite;
}

@keyframes pulse-dot {
  0%, 100% { opacity: 0.25; }
  50% { opacity: 1; border-color: rgba(6, 182, 212, 0.4); }
}

.join-hint {
  font-size: 0.7rem;
  color: #334155;
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

.form-group input {
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

.form-group input:focus {
  border-color: rgba(99, 102, 241, 0.4);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.07);
}

.form-group input::placeholder { color: #334155; }

.code-input {
  text-align: center !important;
  font-family: 'JetBrains Mono', monospace !important;
  font-size: 1.25rem !important;
  font-weight: 700 !important;
  letter-spacing: 0.18em;
  padding: 13px !important;
}

.alert-error {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 10px 13px;
  background: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 9px;
  font-size: 0.77rem;
  color: #fb7185;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.btn-green {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 18px;
  background: linear-gradient(135deg, #059669, #0891b2);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 600;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.15s;
}

.btn-green:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-green:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.btn-ghost {
  padding: 9px 16px;
  background: transparent;
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.15s;
}

.btn-ghost:hover { color: #94a3b8; border-color: rgba(255, 255, 255, 0.12); }

.modal-enter-active, .modal-leave-active { transition: opacity 0.2s; }
.modal-enter-from, .modal-leave-to { opacity: 0; }
.modal-enter-active .modal-box, .modal-leave-active .modal-box { transition: transform 0.2s; }
.modal-enter-from .modal-box, .modal-leave-to .modal-box { transform: scale(0.96) translateY(6px); }

@keyframes spin { to { transform: rotate(360deg); } }
.spin { animation: spin 0.8s linear infinite; }

/* ── Success State ── */
.success-body {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 36px 24px 28px;
  gap: 14px;
  text-align: center;
}

.success-icon-wrap {
  position: relative;
  width: 72px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 4px;
}

.success-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 2px solid rgba(16, 185, 129, 0.25);
  background: rgba(16, 185, 129, 0.08);
  animation: ring-pop 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.success-check {
  color: #34d399;
  position: relative;
  z-index: 1;
  animation: check-draw 0.35s ease 0.1s both;
}

@keyframes ring-pop {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}

@keyframes check-draw {
  from { opacity: 0; transform: scale(0.6); }
  to   { opacity: 1; transform: scale(1); }
}

.success-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.success-desc {
  font-size: 0.8rem;
  color: #64748b;
  margin: 0;
  line-height: 1.55;
  max-width: 300px;
}

.success-desc strong {
  color: #94a3b8;
  font-weight: 600;
}

.success-actions {
  display: flex;
  gap: 10px;
  margin-top: 8px;
}
</style>