<script setup lang="ts">
interface UserProfile {
  id?: number
  name?: string
  email?: string
}

defineProps<{
  user: UserProfile
  photoPreview: string | null
}>()

const emit = defineEmits<{
  (e: 'photo-selected', file: File): void
  (e: 'remove-photo'): void
}>()

const onPhotoChange = (e: Event) => {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  emit('photo-selected', file)
  input.value = ''
}
</script>

<template>
  <div class="profile-card">
    <div class="profile-banner"></div>
    <div class="profile-body">
      <div class="photo-section">
        <div class="photo-wrapper">
          <div class="photo-container">
            <img v-if="photoPreview" :src="photoPreview" alt="Foto Profil" class="photo-img" />
            <div v-else class="photo-placeholder">
              <svg width="44" height="44" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="1.8"/>
              </svg>
            </div>
          </div>
          <label for="photo-input" class="photo-edit-btn" title="Ubah foto">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" stroke="currentColor" stroke-width="2"/>
              <circle cx="12" cy="13" r="4" stroke="currentColor" stroke-width="2"/>
            </svg>
          </label>
          <input id="photo-input" type="file" accept="image/*" class="hidden-input" @change="onPhotoChange" />
        </div>
        <button v-if="photoPreview" class="remove-photo-btn" @click="emit('remove-photo')">
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
          </svg>
          Hapus Foto
        </button>
      </div>

      <div class="user-info">
        <div class="info-row">
          <span class="info-label">User ID</span>
          <span class="info-id">#{{ user.id ?? '---' }}</span>
        </div>
        <div class="info-grid">
          <div>
            <span class="info-label">Nama Lengkap</span>
            <span class="info-value">{{ user.name || '---' }}</span>
          </div>
          <div>
            <span class="info-label">Email</span>
            <span class="info-value">{{ user.email || '---' }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  background: #0d1420;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
}

.profile-banner {
  height: 100px;
  background: linear-gradient(135deg, rgba(34, 211, 238, 0.13) 0%, rgba(59, 130, 246, 0.13) 100%);
  border-radius: 16px 16px 0 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.profile-body {
  padding: 0 28px 28px;
  display: flex;
  align-items: flex-start;
  gap: 24px;
}

.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: -44px;
  flex-shrink: 0;
}

.photo-wrapper { position: relative; }

.photo-container {
  width: 100px;
  height: 100px;
  border-radius: 14px;
  background: linear-gradient(135deg, #22d3ee, #3b82f6);
  border: 4px solid #080c14;
  box-shadow: 0 0 28px rgba(34, 211, 238, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  color: rgba(255,255,255,0.85);
}

.photo-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.photo-placeholder {
  color: rgba(255,255,255,0.8);
}

.photo-edit-btn {
  position: absolute;
  bottom: -4px;
  right: -4px;
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, #0891b2, #2563eb);
  border-radius: 10px;
  border: 2px solid #0d1420;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: white;
  transition: opacity 0.2s;
}

.photo-edit-btn:hover { opacity: 0.85; }
.hidden-input { display: none; }

.remove-photo-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.72rem;
  color: #f87171;
  background: none;
  border: none;
  cursor: pointer;
  font-family: 'Sora', sans-serif;
  transition: color 0.2s;
}

.remove-photo-btn:hover { color: #fca5a5; }

.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
}

.info-row {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  display: block;
  font-size: 0.68rem;
  font-weight: 700;
  color: #475569;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  margin-bottom: 4px;
}

.info-id {
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.2rem;
  font-weight: 700;
  color: #22d3ee;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-value {
  font-size: 0.9rem;
  font-weight: 600;
  color: #e2e8f0;
}
</style>
