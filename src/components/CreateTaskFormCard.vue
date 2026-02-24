<template>
  <div class="form-card">
    <div class="form-card-header">
      <div>
        <h3 class="form-card-title">Detail Task</h3>
        <p class="form-card-sub">Task ini akan ditambahkan ke proyek yang sedang aktif</p>
      </div>
      <div class="form-step">01 / 01</div>
    </div>

    <form @submit.prevent="$emit('submit')" class="form-body" novalidate>

      <!-- Judul -->
      <div class="field" :class="{ 'field-error': eror.title }">
        <label class="field-label" for="task_title">
          Judul Task
          <span class="required-mark">*</span>
        </label>
        <div class="input-wrap">
          <span class="input-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
              <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
            </svg>
          </span>
          <input
            id="task_title"
            :value="form.title"
            @input="$emit('update:form', { ...form, title: ($event.target as HTMLInputElement).value }); eror.title = ''"
            type="text"
            placeholder="Contoh: Identifikasi kolom tabel produk"
            class="field-input"
          />
        </div>
        <span v-if="eror.title" class="error-msg">{{ eror.title }}</span>
      </div>

      <!-- Catatan -->
      <div class="field">
        <label class="field-label" for="notes">
          Catatan
          <span class="optional-mark">(Opsional)</span>
        </label>
        <textarea
          id="notes"
          :value="form.description"
          @input="$emit('update:form', { ...form, description: ($event.target as HTMLTextAreaElement).value })"
          rows="4"
          placeholder="Instruksi atau catatan tambahan untuk task ini..."
          class="field-textarea"
        ></textarea>
        <span class="char-count">{{ form.description.length }} karakter</span>
      </div>

      <!-- Priority -->
      <div class="field">
        <label class="field-label">Prioritas Task</label>
        <div class="priority-group">
          <button
            v-for="p in priorities"
            :key="p.value"
            type="button"
            :class="['priority-btn', `priority-${p.value}`, form.priority === p.value ? 'priority-active' : '']"
            @click="$emit('update:form', { ...form, priority: p.value })"
          >
            <span class="priority-dot"></span>
            {{ p.label }}
          </button>
        </div>
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button type="button" @click="$emit('cancel')" class="btn-cancel">Batal</button>
        <button type="submit" class="btn-submit" :disabled="submitting">
          <span v-if="submitting" class="submit-spinner"></span>
          <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          {{ submitting ? 'Menyimpan...' : 'Tambah Task' }}
        </button>
      </div>

    </form>
  </div>
</template>

<script setup lang="ts">
interface FormState {
  title: string
  description: string
  priority: string
}

interface Priority {
  value: string
  label: string
}

defineProps<{
  form: FormState
  eror: { title: string }
  submitting: boolean
  priorities: Priority[]
}>()

defineEmits<{
  (e: 'submit'): void
  (e: 'cancel'): void
  (e: 'update:form', value: FormState): void
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.form-card {
  background: rgba(13, 20, 32, 0.8);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0,0,0,0.4);
}

.form-card-header {
  padding: 20px 28px;
  border-bottom: 1px solid rgba(255,255,255,0.055);
  background: rgba(255,255,255,0.02);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-card-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.form-card-sub {
  font-size: 0.75rem;
  color: #475569;
  margin: 2px 0 0;
}

.form-step {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.68rem;
  color: #334155;
  letter-spacing: 0.08em;
}

.form-body {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* ── Fields ── */
.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: #94a3b8;
  display: flex;
  align-items: center;
  gap: 5px;
}

.required-mark {
  color: #f87171;
  font-size: 0.85rem;
}

.optional-mark {
  font-weight: 400;
  color: #475569;
  font-size: 0.75rem;
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
  display: flex;
  pointer-events: none;
}

.field-input {
  width: 100%;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 11px;
  padding: 11px 14px 11px 38px;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  color: #e2e8f0;
  transition: all 0.18s ease;
  outline: none;
}

.field-input::placeholder { color: #334155; }

.field-input:focus {
  border-color: rgba(99,102,241,0.5);
  background: rgba(99,102,241,0.05);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.field-error .field-input {
  border-color: rgba(248,113,113,0.5);
  box-shadow: 0 0 0 3px rgba(248,113,113,0.07);
}

.field-textarea {
  width: 100%;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 11px;
  padding: 12px 14px;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  color: #e2e8f0;
  transition: all 0.18s ease;
  outline: none;
  resize: vertical;
  min-height: 100px;
  line-height: 1.6;
}

.field-textarea::placeholder { color: #334155; }

.field-textarea:focus {
  border-color: rgba(99,102,241,0.5);
  background: rgba(99,102,241,0.05);
  box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
}

.char-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  color: #334155;
  text-align: right;
}

.error-msg {
  font-size: 0.75rem;
  color: #f87171;
}

/* ── Priority ── */
.priority-group {
  display: flex;
  gap: 8px;
}

.priority-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  padding: 10px 12px;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  background: rgba(255,255,255,0.035);
  border: 1px solid rgba(255,255,255,0.07);
  color: #64748b;
}

.priority-btn:hover {
  background: rgba(255,255,255,0.06);
  color: #94a3b8;
}

.priority-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
}

.priority-low .priority-dot { background: #34d399; }
.priority-low.priority-active {
  background: rgba(52,211,153,0.1);
  border-color: rgba(52,211,153,0.3);
  color: #34d399;
  box-shadow: 0 0 14px rgba(52,211,153,0.1);
}

.priority-medium .priority-dot { background: #fbbf24; }
.priority-medium.priority-active {
  background: rgba(251,191,36,0.08);
  border-color: rgba(251,191,36,0.28);
  color: #fbbf24;
  box-shadow: 0 0 14px rgba(251,191,36,0.08);
}

.priority-high .priority-dot { background: #f87171; }
.priority-high.priority-active {
  background: rgba(248,113,113,0.08);
  border-color: rgba(248,113,113,0.28);
  color: #f87171;
  box-shadow: 0 0 14px rgba(248,113,113,0.08);
}

/* ── Form Actions ── */
.form-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 10px;
  padding-top: 8px;
  border-top: 1px solid rgba(255,255,255,0.045);
}

.btn-cancel {
  padding: 10px 20px;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: #475569;
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.18s ease;
}

.btn-cancel:hover {
  background: rgba(255,255,255,0.04);
  color: #94a3b8;
  border-color: rgba(255,255,255,0.07);
}

.btn-submit {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 24px;
  border-radius: 11px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 4px 18px rgba(99,102,241,0.35);
  position: relative;
  overflow: hidden;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(99,102,241,0.5);
}

.btn-submit:active:not(:disabled) { transform: translateY(0); }

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.submit-spinner {
  width: 14px; height: 14px;
  border-radius: 50%;
  border: 2px solid rgba(255,255,255,0.25);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
