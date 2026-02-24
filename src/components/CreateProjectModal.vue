<template>
  <Transition name="modal">
    <div v-if="show" class="modal-backdrop" @click.self="$emit('close')">
      <div class="modal-box">
        <div class="modal-header">
          <h3>Proyek Baru</h3>
          <button class="modal-close" @click="$emit('close')">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="modal-form">
          <div class="form-group">
            <label>Nama Proyek <span class="required">*</span></label>
            <input
              v-model="form.title"
              type="text"
              placeholder="Masukkan nama proyek"
              required
            />
          </div>

          <div class="form-group">
            <label>Deskripsi</label>
            <textarea
              v-model="form.description"
              placeholder="Deskripsi proyek (opsional)"
              rows="3"
            ></textarea>
          </div>

          <div class="form-group">
            <label>Deadline</label>
            <input v-model="form.deadline" type="date" />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-ghost" @click="$emit('close')">Batal</button>
            <button type="submit" class="btn-primary" :disabled="creating">
              {{ creating ? 'Menyimpan...' : 'Buat Proyek' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  show: boolean
  creating: boolean
}>()

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'submit', data: { title: string; description: string; deadline: string }): void
}>()

const form = ref({ title: '', description: '', deadline: '' })

const handleSubmit = () => {
  if (!form.value.title.trim()) return
  emit('submit', { ...form.value })
  form.value = { title: '', description: '', deadline: '' }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-box {
  background: #0d1420;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  width: 480px;
  max-width: calc(100vw - 48px);
  padding: 28px;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f1f5f9;
}

.modal-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.modal-close:hover {
  color: #f87171;
  border-color: rgba(248, 113, 113, 0.3);
}

.modal-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
}

.required {
  color: #f87171;
}

.form-group input,
.form-group textarea {
  padding: 10px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  color: #e2e8f0;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus {
  border-color: rgba(99, 102, 241, 0.5);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: #475569;
}

.form-group input[type='date']::-webkit-calendar-picker-indicator {
  filter: invert(0.5);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 8px;
}

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

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.btn-ghost {
  padding: 9px 18px;
  background: transparent;
  color: #64748b;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
  font-family: 'Sora', sans-serif;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-ghost:hover {
  color: #94a3b8;
  border-color: rgba(255, 255, 255, 0.12);
}

/* Modal transition */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-box,
.modal-leave-active .modal-box {
  transition: transform 0.2s;
}

.modal-enter-from .modal-box,
.modal-leave-to .modal-box {
  transform: scale(0.96);
}
</style>
