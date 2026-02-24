<template>
  <aside class="sidebar">
    <div class="sidebar-logo">
      <div class="logo-icon">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
      </div>
      <span class="logo-text">TaskTracker</span>
    </div>

    <nav class="sidebar-nav">
      <p class="nav-label">Menu</p>
      <RouterLink to="/dashboard" class="nav-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" />
          <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" />
          <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" />
          <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" stroke-width="2" />
        </svg>
        Dashboard
      </RouterLink>
      <RouterLink to="/projects" class="nav-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
        Project
      </RouterLink>
      <RouterLink to="/profile" class="nav-item">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="8" r="4" stroke="currentColor" stroke-width="2" />
          <path
            d="M4 20a8 8 0 0116 0"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        Profile
      </RouterLink>
    </nav>

    <div class="sidebar-footer">
      <div class="sidebar-user-row">
        <div class="user-avatar-small">{{ userInitial }}</div>
        <div class="user-info-small">
          <p class="user-name-small">{{ user?.name }}</p>
          <p class="user-role-small">Pengguna</p>
        </div>
      </div>

      <button class="logout-btn-side" @click="$emit('logout')">
        <span class="logout-icon-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 3h10a2 2 0 012 2v14a2 2 0 01-2 2H4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M10 12h10m0 0l-3-3m3 3l-3 3"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
        <span>Keluar</span>
      </button>
    </div>
  </aside>
</template>

<script setup lang="ts">
defineProps<{
  user: any
  userInitial: string
}>()

defineEmits<{
  (e: 'logout'): void
}>()
</script>

<style scoped>
.sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #0d1420;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  padding: 28px 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 24px 32px;
}

.logo-icon {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.logo-text {
  font-weight: 700;
  font-size: 1rem;
  background: linear-gradient(135deg, #60a5fa, #a78bfa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-label {
  font-size: 0.65rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #475569;
  padding: 0 24px;
  margin-bottom: 8px;
  font-weight: 600;
}

.sidebar-nav {
  flex: 1;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 14px;
  border-radius: 10px;
  color: #64748b;
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.2s;
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.04);
  color: #94a3b8;
}

.nav-item.router-link-active {
  background: rgba(59, 130, 246, 0.12);
  color: #60a5fa;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 14px 14px;
  margin: 0 12px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-user-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar-small {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.85rem;
  flex-shrink: 0;
}

.user-name-small {
  font-size: 0.8rem;
  font-weight: 600;
  color: #e2e8f0;
}

.user-role-small {
  font-size: 0.7rem;
  color: #475569;
  margin-top: 1px;
}

.logout-btn-side {
  width: 100%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  color: #fecaca;
  background: linear-gradient(135deg, rgba(185, 28, 28, 0.28), rgba(220, 38, 38, 0.2));
  border: 1px solid rgba(248, 113, 113, 0.35);
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Sora', sans-serif;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}

.logout-btn-side:hover {
  color: #fee2e2;
  border-color: rgba(252, 165, 165, 0.65);
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.35), rgba(239, 68, 68, 0.28));
  transform: translateY(-1px);
}

.logout-icon-wrap {
  width: 18px;
  height: 18px;
  border-radius: 6px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.18);
  color: #ffe4e6;
}
</style>
