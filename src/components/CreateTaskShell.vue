<template>
  <div class="app-shell">

    <AppSidebar :user="user" :user-initial="userInitial" @logout="$emit('logout')" />

    <main class="main-content">

      <AppHeader
        :user="user"
        :user-initial="userInitial"
        :current-date="currentDate"
      />

      <div class="content-body">
        <div class="content-inner">
          <slot />
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'

defineProps<{
  user: any
  userInitial: string
  currentDate: string
}>()

defineEmits<{ (e: 'logout'): void }>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #080c14;
  font-family: 'Sora', sans-serif;
  color: #e2e8f0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.content-body {
  padding: 32px 36px;
  overflow-y: auto;
  flex: 1;
}

.content-inner {
  max-width: 760px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

@media (max-width: 900px) {
  .content-body {
    padding: 20px;
  }
}
</style>
