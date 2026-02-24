<script setup lang="ts">
interface ProfileForm {
  name: string
  email: string
  oldpassword: string
  password: string
}

const props = defineProps<{
  form: ProfileForm
  saving: boolean
}>()

const emit = defineEmits<{
  (e: 'update:form', value: ProfileForm): void
  (e: 'submit'): void
}>()

const updateField = (key: keyof ProfileForm, value: string) => {
  emit('update:form', { ...props.form, [key]: value })
}
</script>

<template>
  <div class="section-card">
    <div class="section-header">
      <div class="section-icon cyan">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <div>
        <h3 class="section-title">Perbarui Profil</h3>
        <p class="section-sub">Edit informasi akun Anda</p>
      </div>
    </div>

    <form @submit.prevent="emit('submit')" class="form-body">
      <div class="form-grid">
        <div class="form-group">
          <label class="form-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
            Nama Lengkap
          </label>
          <input
            :value="form.name"
            @input="updateField('name', ($event.target as HTMLInputElement).value)"
            type="text"
            placeholder="Contoh: Budi Santoso"
            class="form-input"
            required
          />
        </div>
        <div class="form-group">
          <label class="form-label">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" stroke-width="2"/>
              <polyline points="22,6 12,13 2,6" stroke="currentColor" stroke-width="2"/>
            </svg>
            Email
          </label>
          <input
            :value="form.email"
            @input="updateField('email', ($event.target as HTMLInputElement).value)"
            type="email"
            placeholder="nama@email.com"
            class="form-input"
            required
          />
        </div>
      </div>

      <div class="divider"></div>

      <div class="security-section">
        <div class="security-label">
          <div class="section-icon amber">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" stroke-width="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
          </div>
          <span class="security-title">Pengaturan Keamanan</span>
        </div>

        <div class="form-grid">
          <div class="form-group">
            <label class="form-label">Password Lama</label>
            <input
              :value="form.oldpassword"
              @input="updateField('oldpassword', ($event.target as HTMLInputElement).value)"
              type="password"
              placeholder="Masukkan password saat ini"
              class="form-input"
            />
          </div>
          <div class="form-group">
            <label class="form-label">Password Baru</label>
            <input
              :value="form.password"
              @input="updateField('password', ($event.target as HTMLInputElement).value)"
              type="password"
              placeholder="Minimal 8 karakter"
              class="form-input"
            />
          </div>
        </div>

        <div class="info-note">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" class="note-icon">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
            <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          </svg>
          <p>Isi kolom password hanya jika ingin mengubah password. Biarkan kosong jika tidak ingin mengubah.</p>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn-save" :disabled="saving">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" stroke="currentColor" stroke-width="2"/>
            <polyline points="17,21 17,13 7,13 7,21" stroke="currentColor" stroke-width="2"/>
            <polyline points="7,3 7,8 15,8" stroke="currentColor" stroke-width="2"/>
          </svg>
          {{ saving ? 'Menyimpan...' : 'Simpan Perubahan' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.section-card {
  background: #0d1420;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  overflow: hidden;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  background: rgba(255, 255, 255, 0.02);
}

.section-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.section-icon.cyan {
  background: rgba(34, 211, 238, 0.12);
  color: #22d3ee;
}

.section-icon.amber {
  background: rgba(245, 158, 11, 0.12);
  color: #fbbf24;
}

.section-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #e2e8f0;
}

.section-sub {
  font-size: 0.75rem;
  color: #475569;
  margin-top: 2px;
}

.form-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

@media (min-width: 640px) {
  .form-grid { grid-template-columns: 1fr 1fr; }
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.form-input {
  padding: 10px 14px;
  background: #080c14;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 10px;
  color: #e2e8f0;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.form-input:focus {
  border-color: rgba(34, 211, 238, 0.4);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.06);
}

.form-input::placeholder { color: #475569; }

.divider {
  height: 1px;
  background: rgba(51, 65, 85, 0.4);
}

.security-section {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.security-label {
  display: flex;
  align-items: center;
  gap: 10px;
}

.security-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #cbd5e1;
}

.info-note {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 12px 14px;
  background: rgba(245, 158, 11, 0.07);
  border: 1px solid rgba(245, 158, 11, 0.18);
  border-radius: 10px;
  font-size: 0.78rem;
  color: rgba(251, 191, 36, 0.8);
  line-height: 1.5;
}

.note-icon {
  color: #fbbf24;
  flex-shrink: 0;
  margin-top: 1px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
}

.btn-save {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 22px;
  background: linear-gradient(135deg, #0891b2, #2563eb);
  color: white;
  border: none;
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s, transform 0.1s;
  box-shadow: 0 4px 14px rgba(34, 211, 238, 0.2);
}

.btn-save:hover { opacity: 0.88; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
</style>
