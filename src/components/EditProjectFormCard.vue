<template>
  <transition name="slide-alert">
    <div v-if="alertMessage" class="alert-box" :class="alertSuccess ? 'alert-success' : 'alert-error'">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polyline v-if="alertSuccess" points="20 6 9 17 4 12"/>
        <template v-else>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </template>
      </svg>
      {{ alertMessage }}
    </div>
  </transition>

  <div class="form-card">
    <div class="form-card-head">
      <div class="form-card-icon">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/>
        </svg>
      </div>
      <div>
        <h3 class="form-card-title">Form Edit Proyek</h3>
        <p class="form-card-sub">Perbarui judul, tenggat, dan deskripsi proyek</p>
      </div>
    </div>

    <form @submit.prevent="$emit('submit')" class="project-form">
      <div class="field">
        <label class="field-label">Judul Proyek</label>
        <div class="field-wrap">
          <input v-model="form.title" type="text" class="field-input" placeholder="Masukkan judul" required />
        </div>
      </div>

      <div class="field">
        <label class="field-label">Tenggat Waktu</label>
        <div class="field-wrap">
          <input v-model="form.tenggat" type="datetime-local" class="field-input field-input-date" required />
        </div>
      </div>

      <div class="field">
        <div class="field-label-row">
          <label class="field-label">Deskripsi Proyek</label>
          <span class="char-count">{{ form.description.length }} / 500</span>
        </div>
        <div class="field-wrap">
          <textarea
            v-model="form.description"
            placeholder="Masukin Deskripsi"
            rows="4"
            maxlength="500"
            class="field-input field-textarea"
          ></textarea>
        </div>
      </div>

      <div class="form-actions">
        <RouterLink to="/projects" class="btn-back">Kembali</RouterLink>
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading" class="btn-inner">Simpan Perubahan</span>
          <span v-else class="btn-inner">Memproses…</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  form: {
    title: string
    tenggat: string
    description: string
  }
  loading: boolean
  alertMessage: string
  alertSuccess: boolean
}>()

defineEmits<{
  (e: 'submit'): void
}>()
</script>

<style scoped>
.alert-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 11px 14px;
  border-radius: 11px;
  font-size: 0.8rem;
  font-weight: 500;
  border-width: 1px;
  border-style: solid;
}

.alert-success { background: rgba(16,185,129,0.08); border-color: rgba(16,185,129,0.2); color: #34d399; }
.alert-error { background: rgba(244,63,94,0.08); border-color: rgba(244,63,94,0.2); color: #fb7185; }

.slide-alert-enter-active, .slide-alert-leave-active { transition: opacity 0.25s, transform 0.25s; }
.slide-alert-enter-from, .slide-alert-leave-to { opacity: 0; transform: translateY(-6px); }

.form-card {
  background: rgba(8, 15, 30, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.03) inset;
}

.form-card-head {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 20px 26px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
  background: rgba(255,255,255,0.02);
}

.form-card-icon {
  width: 36px;
  height: 36px;
  border-radius: 11px;
  background: linear-gradient(135deg, rgba(6,182,212,0.18), rgba(37,99,235,0.18));
  border: 1px solid rgba(6,182,212,0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
  flex-shrink: 0;
}

.form-card-title {
  font-size: 0.92rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0 0 2px;
}

.form-card-sub {
  font-size: 0.73rem;
  color: #334155;
  margin: 0;
}

.project-form {
  padding: 26px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field-label-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.field-label {
  font-size: 0.7rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
}

.char-count {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.67rem;
  color: #1e293b;
}

.field-wrap {
  position: relative;
}

.field-input {
  width: 100%;
  padding: 11px 14px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  color: #e2e8f0;
  font-family: 'Sora', sans-serif;
  font-size: 0.87rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input:focus {
  border-color: rgba(6,182,212,0.4);
  box-shadow: 0 0 0 3px rgba(6,182,212,0.08);
}

.field-textarea {
  resize: none;
  line-height: 1.6;
}

.field-input-date {
  color-scheme: dark;
}

.form-actions {
  margin-top: 4px;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.btn-back,
.btn-submit {
  height: 40px;
  border-radius: 11px;
  padding: 0 15px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.18s;
  cursor: pointer;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  color: #475569;
  border-color: rgba(255,255,255,0.07);
  background: rgba(255,255,255,0.02);
}

.btn-back:hover {
  color: #94a3b8;
}

.btn-submit {
  min-width: 150px;
  background: linear-gradient(135deg, #06b6d4, #2563eb);
  color: #fff;
  border: none;
}

.btn-submit:disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

.btn-inner {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>
