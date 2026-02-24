<template>
  <header class="top-header">
    <div class="header-greeting">
      <p class="greeting-sub">Selamat datang kembali</p>
      <h1 class="greeting-main">{{ user?.name || 'Pengguna' }} <span class="wave">👋</span></h1>
    </div>

    <div class="header-right">
      <div class="date-badge">{{ currentDate }}</div>
      <div class="header-avatar">
        <img
          v-if="profilePhotoUrl && !avatarError"
          :src="profilePhotoUrl"
          alt="Foto Profil"
          class="header-avatar-image"
          @error="avatarError = true"
        />
        <span v-else>{{ userInitial }}</span>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import api from '@/services/api'

interface HeaderUser {
  name?: string
  profile_photo?: string
}

const props = defineProps<{
  user: HeaderUser
  userInitial: string
  currentDate: string
}>()

const avatarError = ref(false)

const profilePhotoUrl = computed(() => {
  const value = props.user?.profile_photo
  if (!value) return null
  if (/^https?:\/\//i.test(value)) return value

  const apiBase = String(api.defaults.baseURL ?? '').replace(/\/api\/?$/, '')
  const cleanPath = value.startsWith('/') ? value : `/${value}`
  return apiBase ? `${apiBase}${cleanPath}` : cleanPath
})

watch(profilePhotoUrl, () => {
  avatarError.value = false
})
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
  overflow: hidden;
}

.header-avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

</style>
