<script setup lang="ts">
defineProps<{
  deleting: boolean
}>()

const emit = defineEmits<{
  (e: 'delete-account'): void
}>()
</script>

<template>
  <div class="danger-card">
    <div class="danger-icon">
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <polygon points="7.86,2 16.14,2 22,7.86 22,16.14 16.14,22 7.86,22 2,16.14 2,7.86" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    <div class="danger-text">
      <h3 class="danger-title">Hapus Akun</h3>
      <p class="danger-desc">Menghapus akun akan menghilangkan seluruh data tugas dan proyek secara permanen dan tidak dapat dikembalikan.</p>
    </div>
    <button class="btn-delete" :disabled="deleting" @click="emit('delete-account')">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
        <polyline points="3,6 5,6 21,6" stroke="currentColor" stroke-width="2"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" stroke="currentColor" stroke-width="2"/>
        <path d="M10 11v6M14 11v6" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" stroke="currentColor" stroke-width="2"/>
      </svg>
      {{ deleting ? 'Menghapus...' : 'Hapus Akun' }}
    </button>
  </div>
</template>

<style scoped>
.danger-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 22px 24px;
  background: #0d1420;
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 16px;
}

.danger-icon {
  width: 56px;
  height: 56px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f87171;
  flex-shrink: 0;
}

.danger-text { flex: 1; }

.danger-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f87171;
  margin-bottom: 6px;
}

.danger-desc {
  font-size: 0.78rem;
  color: #64748b;
  line-height: 1.6;
}

.btn-delete {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 10px;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-delete:hover {
  background: #ef4444;
  color: white;
  border-color: #ef4444;
}

.btn-delete:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
