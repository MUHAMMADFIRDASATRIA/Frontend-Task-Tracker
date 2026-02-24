<template>
  <div class="login-root">
    <div class="bg-mesh">
      <div class="mesh-orb orb-1"></div>
      <div class="mesh-orb orb-2"></div>
      <div class="mesh-orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="login-wrap">
      <div class="login-card">
        <div class="brand">
          <div class="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span class="brand-name">Workspace</span>
        </div>

        <div class="login-head">
          <h1 class="login-title">Buat akun baru</h1>
          <p class="login-sub">Daftar untuk mulai mengelola tugas Anda</p>
        </div>

        <form @submit.prevent="handleRegister" class="login-form">
          <div class="field-group">
            <label class="field-label">Nama Lengkap</label>
            <div class="field-wrap">
              <span class="field-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M20 21a8 8 0 0 0-16 0"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <input v-model="name" type="text" class="field-input" placeholder="Nama lengkap" required />
            </div>
          </div>

          <div class="field-group">
            <label class="field-label">Email</label>
            <div class="field-wrap">
              <span class="field-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input v-model="email" type="email" class="field-input" placeholder="nama@email.com" required />
            </div>
          </div>

          <div class="field-group">
            <div class="field-label-row">
              <label class="field-label">Password</label>
              <button type="button" class="field-forgot" @click="showPassword = !showPassword">
                {{ showPassword ? 'Sembunyikan' : 'Tampilkan' }}
              </button>
            </div>
            <div class="field-wrap">
              <span class="field-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                  <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                </svg>
              </span>
              <input
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                class="field-input"
                placeholder="••••••••"
                required
              />
            </div>
            <p class="password-hint">Gunakan minimal 8 karakter dengan kombinasi huruf dan angka.</p>
          </div>

          <div v-if="message" class="error-box" :class="success ? 'success-box' : ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ message }}
          </div>

          <button type="submit" class="btn-login" :class="{ 'btn-loading': loading }" :disabled="loading">
            <span v-if="!loading" class="btn-text">
              Daftar
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </span>
            <span v-else class="btn-spinner">
              <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
                <path d="M12 3a9 9 0 1 0 9 9"/>
              </svg>
              Memproses…
            </span>
          </button>
        </form>
      </div>

      <p class="login-note">Sudah punya akun? <RouterLink to="/" class="note-link">Masuk sekarang</RouterLink></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRegister } from '@/composables/useRegister'

const {
  name,
  email,
  password,
  showPassword,
  loading,
  message,
  success,
  handleRegister,
} = useRegister()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

.login-root {
  font-family: 'Instrument Sans', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #04080f;
  position: relative;
  overflow: hidden;
}

.bg-mesh {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.mesh-orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
}

.orb-1 {
  width: 460px; height: 460px;
  background: radial-gradient(circle, rgba(6, 182, 212, 0.1) 0%, transparent 70%);
  top: -120px; right: -80px;
}

.orb-2 {
  width: 380px; height: 380px;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%);
  bottom: -100px; left: -60px;
}

.orb-3 {
  width: 200px; height: 200px;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.07) 0%, transparent 70%);
  top: 40%; left: 55%;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 60% 60% at 50% 50%, black 0%, transparent 100%);
}

.login-wrap {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  width: 100%;
  max-width: 420px;
  padding: 24px 16px;
}

.login-card {
  width: 100%;
  background: rgba(8, 15, 30, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 24px;
  padding: 36px 34px 32px;
  box-shadow:
    0 0 0 1px rgba(255,255,255,0.03) inset,
    0 32px 64px rgba(0,0,0,0.5),
    0 0 80px rgba(6, 182, 212, 0.04);
}

.brand {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 28px;
}

.brand-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(6,182,212,0.2), rgba(37,99,235,0.2));
  border: 1px solid rgba(6,182,212,0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #22d3ee;
}

.brand-name {
  font-size: 0.92rem;
  font-weight: 700;
  color: #e2e8f0;
  letter-spacing: -0.01em;
}

.login-head {
  margin-bottom: 28px;
}

.login-title {
  font-size: 1.55rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.03em;
  margin: 0 0 6px;
  line-height: 1.1;
}

.login-sub {
  font-size: 0.83rem;
  color: #94a3b8;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.field-group {
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
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #a3b5cb;
}

.field-forgot {
  font-size: 0.75rem;
  color: #22d3ee;
  text-decoration: none;
  opacity: 0.8;
  transition: opacity 0.15s;
  border: none;
  background: transparent;
  padding: 0;
  cursor: pointer;
}

.field-forgot:hover { opacity: 1; }

.field-wrap {
  position: relative;
}

.field-icon {
  position: absolute;
  left: 13px;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
  display: flex;
  align-items: center;
  pointer-events: none;
  transition: color 0.2s;
}

.field-input {
  width: 100%;
  padding: 11px 14px 11px 38px;
  background: rgba(15, 23, 42, 0.8);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  color: #e2e8f0;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 0.88rem;
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.field-input::placeholder { color: #64748b; }

.field-input:focus {
  border-color: rgba(6,182,212,0.4);
  box-shadow: 0 0 0 3px rgba(6,182,212,0.08);
}

.field-input:focus + .field-icon,
.field-wrap:focus-within .field-icon {
  color: #22d3ee;
}

.password-hint {
  margin: 0;
  font-size: 0.72rem;
  color: #64748b;
}

.error-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.2);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 0.8rem;
  color: #fb7185;
}

.success-box {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.3);
  color: #34d399;
}

.btn-login {
  position: relative;
  width: 100%;
  padding: 13px 20px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #0891b2, #1d4ed8);
  color: #fff;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 0.9rem;
  font-weight: 700;
  cursor: pointer;
  overflow: hidden;
  transition: transform 0.18s ease, box-shadow 0.18s ease, opacity 0.18s;
  box-shadow: 0 6px 20px rgba(8, 145, 178, 0.35);
  margin-top: 4px;
}

.btn-login::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(255,255,255,0.1), transparent);
  pointer-events: none;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 28px rgba(8, 145, 178, 0.45);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-text,
.btn-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.login-note {
  font-size: 0.8rem;
  color: #94a3b8;
  text-align: center;
  margin: 0;
}

.note-link {
  color: #22d3ee;
  text-decoration: none;
  font-weight: 600;
  transition: opacity 0.15s;
}

.note-link:hover { opacity: 0.8; }
</style>