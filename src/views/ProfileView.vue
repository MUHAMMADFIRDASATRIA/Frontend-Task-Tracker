<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '@/services/api'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import ProfileSummaryCard from '@/components/ProfileSummaryCard.vue'
import ProfileEditFormCard from '@/components/ProfileEditFormCard.vue'
import ProfileDangerZone from '@/components/ProfileDangerZone.vue'


const router = useRouter()

const user = ref<any>({})
const loading = ref(true)
const saving = ref(false)
const deleting = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

// Form fields
const form = ref({ name: '', email: '', oldpassword: '', password: '' })

// Photo
const photoPreview = ref<string | null>(null)
const photoFile = ref<File | null>(null)

const userInitial = computed(() =>
  user.value?.name ? user.value.name.charAt(0).toUpperCase() : 'U',
)

const currentDate = computed(() =>
  new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' }),
)

const loadProfile = async () => {
  loading.value = true
  try {
    const res = await api.get('/profile')
    user.value = res.data.data
    form.value.name = user.value.name || ''
    form.value.email = user.value.email || ''
    if (user.value.profile_photo) {
      photoPreview.value = user.value.profile_photo
    }
  } catch (err: any) {
    if (err.response?.status !== 401) console.error('Gagal memuat profil:', err)
  } finally {
    loading.value = false
  }
}

const onPhotoChange = (file: File) => {
  photoFile.value = file
  photoPreview.value = URL.createObjectURL(file)
}

const removePhoto = () => {
  photoPreview.value = null
  photoFile.value = null
}

const updateForm = (value: { name: string; email: string; oldpassword: string; password: string }) => {
  form.value = value
}

const saveProfile = async () => {
  successMsg.value = ''
  errorMsg.value = ''
  saving.value = true
  try {
    const payload = new FormData()
    if (form.value.name) payload.append('name', form.value.name)
    if (form.value.email) payload.append('email', form.value.email)
    if (form.value.oldpassword) payload.append('oldpassword', form.value.oldpassword)
    if (form.value.password) payload.append('password', form.value.password)
    if (photoFile.value) payload.append('profile_photo', photoFile.value)

    const res = await api.put('/profile/edit', payload, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    user.value = res.data.data
    form.value.oldpassword = ''
    form.value.password = ''
    photoFile.value = null
    successMsg.value = 'Profil berhasil diperbarui!'
    setTimeout(() => (successMsg.value = ''), 3000)
  } catch (err: any) {
    errorMsg.value = err.response?.data?.message || 'Gagal menyimpan perubahan.'
    setTimeout(() => (errorMsg.value = ''), 4000)
  } finally {
    saving.value = false
  }
}

const deleteAccount = async () => {
  if (!confirm('Yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.')) return
  deleting.value = true
  try {
    await api.delete('/profile')
    localStorage.removeItem('token')
    router.push('/login')
  } catch (err) {
    console.error('Gagal menghapus akun:', err)
    deleting.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('token')
  router.push('/login')
}

onMounted(loadProfile)
</script>

<template>
  <div class="app-shell">
    <AppSidebar :user="user" :user-initial="userInitial" @logout="handleLogout" />

    <main class="main-content">
      <AppHeader
        :user="user"
        :user-initial="userInitial"
        :current-date="currentDate"
      />

      <div class="content-body">

        <!-- Toast messages -->
        <Transition name="toast">
          <div v-if="successMsg" class="toast toast-success">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M20 6L9 17l-5-5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            {{ successMsg }}
          </div>
        </Transition>
        <Transition name="toast">
          <div v-if="errorMsg" class="toast toast-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
              <path d="M12 8v4M12 16h.01" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            {{ errorMsg }}
          </div>
        </Transition>

        <!-- Loading -->
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Memuat profil...</p>
        </div>

        <template v-else>
          <ProfileSummaryCard
            :user="user"
            :photo-preview="photoPreview"
            @photo-selected="onPhotoChange"
            @remove-photo="removePhoto"
          />

          <ProfileEditFormCard
            :form="form"
            :saving="saving"
            @update:form="updateForm"
            @submit="saveProfile"
          />

          <ProfileDangerZone :deleting="deleting" @delete-account="deleteAccount" />
        </template>

      </div>
    </main>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }

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
  min-height: 0;
  overflow-y: auto;
}

.content-body {
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  overflow: visible;
  flex: 1;
  min-height: fit-content;
}

/* ── Toast ── */
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 500;
}

.toast-success {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.25);
  color: #4ade80;
}

.toast-error {
  background: rgba(248, 113, 113, 0.12);
  border: 1px solid rgba(248, 113, 113, 0.25);
  color: #f87171;
}

.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateY(-6px); }

/* ── Loading ── */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  padding: 80px 0;
  color: #475569;
  font-size: 0.9rem;
}

.spinner {
  width: 36px;
  height: 36px;
  border: 3px solid rgba(34, 211, 238, 0.15);
  border-top-color: #22d3ee;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

</style>
