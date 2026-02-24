<template>
  <div class="login-root">
    <!-- Ambient background -->
    <div class="bg-mesh">
      <div class="mesh-orb orb-1"></div>
      <div class="mesh-orb orb-2"></div>
      <div class="mesh-orb orb-3"></div>
      <div class="grid-overlay"></div>
    </div>

    <div class="login-wrap">
      <!-- Card -->
      <div class="login-card">

        <!-- Brand Mark -->
        <div class="brand">
          <div class="brand-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
          </div>
          <span class="brand-name">Workspace</span>
        </div>

        <!-- Title -->
        <div class="login-head">
          <h1 class="login-title">Selamat datang</h1>
          <p class="login-sub">Masuk ke akun Anda untuk melanjutkan</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleLogin" class="login-form">
          <!-- Email -->
          <div class="field-group">
            <label class="field-label">Email</label>
            <div class="field-wrap">
              <span class="field-icon">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </span>
              <input
                v-model="email"
                type="email"
                class="field-input"
                placeholder="nama@email.com"
                required
              />
            </div>
          </div>

          <!-- Password -->
          <div class="field-group">
            <div class="field-label-row">
              <label class="field-label">Password</label>
              <a href="#" class="field-forgot">Lupa password?</a>
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
                type="password"
                class="field-input"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <!-- Error -->
          <div v-if="errorMessage" class="error-box">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            {{ errorMessage }}
          </div>

          <!-- Submit -->
          <button type="submit" class="btn-login" :class="{ 'btn-loading': loading }" :disabled="loading">
            <span v-if="!loading" class="btn-text">
              Masuk
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
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

        <!-- Divider -->
        <div class="card-divider">
          <span>atau lanjutkan dengan</span>
        </div>

        <!-- Social -->
        <div class="social-row">
          <button class="social-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button class="social-btn">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="#60a5fa">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            GitHub
          </button>
        </div>

      </div>

      <!-- Bottom note -->
      <p class="login-note">Belum punya akun? <a href="/register" class="note-link">Daftar gratis</a></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useLogin } from '@/composables/useLogin'

const {
  email,
  password,
  loading,
  errorMessage,
  handleLogin,
} = useLogin()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; }

/* ── Root ── */
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

/* ── Background mesh ── */
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

/* ── Wrap ── */
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

/* ── Card ── */
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

/* ── Brand ── */
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

/* ── Head ── */
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

/* ── Form ── */
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

/* ── Error ── */
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

/* ── Button ── */
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

.btn-text {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn-spinner {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

/* ── Divider ── */
.card-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 22px 0 16px;
  color: #64748b;
  font-size: 0.75rem;
}

.card-divider::before,
.card-divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: rgba(255,255,255,0.05);
}

.card-divider span { white-space: nowrap; color: #64748b; }

/* ── Social ── */
.social-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 11px 16px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  color: #94a3b8;
  font-family: 'Instrument Sans', sans-serif;
  font-size: 0.83rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.18s, border-color 0.18s, color 0.18s;
}

.social-btn:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.12);
  color: #e2e8f0;
}

/* ── Note ── */
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