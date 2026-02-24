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
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
        </svg>
      </div>
      <div>
        <h3 class="form-card-title">Detail Proyek</h3>
        <p class="form-card-sub">Lengkapi informasi proyek Anda</p>
      </div>
    </div>

    <form @submit.prevent="$emit('submit')" class="project-form">
      <div class="field">
        <label class="field-label">Judul Proyek</label>
        <div class="field-wrap">
          <span class="field-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/>
            </svg>
          </span>
          <input v-model="form.title" type="text" class="field-input" placeholder="Contoh: Implementasi API v2.0" required />
        </div>
      </div>

      <div class="field">
        <label class="field-label">Tenggat Waktu</label>
        <div class="field-wrap">
          <span class="field-icon">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </span>
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
            rows="4"
            maxlength="500"
            class="field-input field-textarea"
            placeholder="Gambarkan tujuan dan cakupan pengerjaan proyek ini…"
          ></textarea>
        </div>
      </div>

      <div class="info-banner">
        <div class="info-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <div class="info-text">
          <p class="info-title">Status Otomatis</p>
          <p class="info-body">
            Status proyek diatur otomatis berdasarkan progress tugas:
            <span class="info-tag tag-pending">Pending</span>
            <span class="info-tag tag-progress">In Progress</span>
            <span class="info-tag tag-done">Completed</span>
          </p>
        </div>
      </div>

      <div class="form-actions">
        <RouterLink to="/projects" class="btn-back">Kembali</RouterLink>
        <button type="submit" class="btn-submit" :disabled="loading">
          <span v-if="!loading" class="btn-inner">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/>
              <line x1="8" y1="12" x2="16" y2="12"/>
            </svg>
            Buat Proyek
          </span>
          <span v-else class="btn-inner">
            <svg class="spin" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
              <path d="M12 3a9 9 0 1 0 9 9"/>
            </svg>
            Memproses…
          </span>
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
  font-family: 'DM Mono', monospace;
  font-size: 0.67rem;
  color: #1e293b;
}

.field-wrap {
  position: relative;
}

.field-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #334155;
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.2s;
}

.field-wrap:focus-within .field-icon {
  color: #22d3ee;
}

.field-input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  color: #e2e8f0;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 0.87rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input::placeholder { color: #1e293b; }

.field-input:focus {
  border-color: rgba(6,182,212,0.4);
  box-shadow: 0 0 0 3px rgba(6,182,212,0.08);
}

.field-textarea {
  padding: 11px 14px;
  resize: none;
  line-height: 1.6;
  font-family: 'Instrument Sans', sans-serif;
}

.field-input-date { color-scheme: dark; }

.info-banner {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  background: rgba(6,182,212,0.05);
  border: 1px solid rgba(6,182,212,0.15);
  border-radius: 12px;
  padding: 14px 16px;
}

.info-icon {
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: rgba(6,182,212,0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
  flex-shrink: 0;
  margin-top: 1px;
}

.info-text { display: flex; flex-direction: column; gap: 4px; }

.info-title {
  font-size: 0.75rem;
  font-weight: 700;
  color: #22d3ee;
  margin: 0;
}

.info-body {
  font-size: 0.75rem;
  color: #475569;
  line-height: 1.6;
  margin: 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 6px;
}

.info-tag {
  font-family: 'DM Mono', monospace;
  font-size: 0.67rem;
  font-weight: 500;
  padding: 2px 8px;
  border-radius: 6px;
}

.tag-pending { background: rgba(245,158,11,0.1); color: #fbbf24; border: 1px solid rgba(245,158,11,0.2); }
.tag-progress { background: rgba(59,130,246,0.1); color: #93c5fd; border: 1px solid rgba(59,130,246,0.2); }
.tag-done { background: rgba(16,185,129,0.1); color: #34d399; border: 1px solid rgba(16,185,129,0.2); }

.form-actions {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 10px;
  padding-top: 6px;
  border-top: 1px solid rgba(255,255,255,0.04);
  margin-top: 4px;
}

.btn-back {
  padding: 10px 18px;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 0.83rem;
  font-weight: 600;
  color: #334155;
  text-decoration: none;
  border-radius: 11px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  transition: all 0.15s;
}

.btn-back:hover {
  color: #94a3b8;
  border-color: rgba(255,255,255,0.1);
}

.btn-submit {
  padding: 10px 22px;
  border: none;
  border-radius: 11px;
  background: linear-gradient(135deg, #0891b2, #1d4ed8);
  color: #fff;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 0.87rem;
  font-weight: 700;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 5px 18px rgba(8,145,178,0.35);
}

.btn-submit::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  pointer-events: none;
}

.btn-submit:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 9px 24px rgba(8,145,178,0.45);
}

.btn-submit:disabled { opacity: 0.6; cursor: not-allowed; }

.btn-inner {
  display: flex;
  align-items: center;
  gap: 7px;
}

.spin { animation: spin 0.8s linear infinite; }

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
