<template>
  <header class="top-header">
    <div class="header-greeting">
      <p class="greeting-sub">Selamat datang kembali</p>
      <h1 class="greeting-main">{{ user?.name || 'Pengguna' }} <span class="wave">👋</span></h1>
    </div>

    <div class="header-right">
      <div class="date-badge">{{ currentDate }}</div>
      <div class="header-avatar">{{ userInitial }}</div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineProps<{
  user: any
  userInitial: string
  currentDate: string
}>()
</script>

<style scoped>
.top-header {
  padding: 24px 36px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0d1420;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  position: sticky;
  top: 0;
  z-index: 10;
}

.greeting-sub {
  font-size: 0.75rem;
  color: #475569;
  margin-bottom: 4px;
}

.greeting-main {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f1f5f9;
}

.wave {
  font-style: normal;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.date-badge {
  font-size: 0.75rem;
  color: #64748b;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.06);
  padding: 7px 14px;
  border-radius: 20px;
  font-family: 'JetBrains Mono', monospace;
}

.header-avatar {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
}

</style>
