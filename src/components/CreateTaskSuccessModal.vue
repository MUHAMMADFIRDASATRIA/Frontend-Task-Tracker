<template>
  <Transition name="modal">
    <div v-if="show" class="modal-overlay" @click.self="$emit('close')">
      <div class="modal-box">
        <div class="modal-icon-wrap">
          <div class="modal-icon-ring"></div>
          <div class="modal-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
        </div>
        <h3 class="modal-title">Task Ditambahkan!</h3>
        <p class="modal-desc">Task baru telah berhasil dibuat dan dikaitkan dengan proyek.</p>
        <button @click="$emit('close')" class="modal-close-btn">
          Tutup &amp; Kembali
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
defineProps<{ show: boolean }>()
defineEmits<{ (e: 'close'): void }>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@800&family=Figtree:wght@400;700&display=swap');

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(4, 7, 18, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  padding: 20px;
}

.modal-box {
  background: linear-gradient(160deg, #0f1629, #080d1c);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 24px;
  padding: 40px 36px;
  max-width: 360px;
  width: 100%;
  text-align: center;
  box-shadow: 0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.modal-icon-wrap {
  position: relative;
  width: 70px; height: 70px;
  margin-bottom: 4px;
}

.modal-icon-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 1px solid rgba(16,185,129,0.25);
  animation: ring-pulse 2s infinite;
}

@keyframes ring-pulse {
  0%   { transform: scale(1); opacity: 1; }
  100% { transform: scale(1.5); opacity: 0; }
}

.modal-icon {
  position: absolute;
  inset: 8px;
  border-radius: 50%;
  background: linear-gradient(135deg, #059669, #34d399);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  box-shadow: 0 6px 24px rgba(16,185,129,0.4);
}

.modal-title {
  font-family: 'Syne', sans-serif;
  font-size: 1.15rem;
  font-weight: 800;
  color: #f1f5f9;
  letter-spacing: -0.02em;
  margin: 0;
}

.modal-desc {
  font-size: 0.8rem;
  color: #64748b;
  line-height: 1.5;
  max-width: 260px;
  margin: 0;
}

.modal-close-btn {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  color: #fff;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  border: none;
  cursor: pointer;
  margin-top: 8px;
  transition: all 0.2s ease;
  box-shadow: 0 4px 14px rgba(99,102,241,0.35);
}

.modal-close-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 7px 20px rgba(99,102,241,0.5);
}

/* ── Transition ── */
.modal-enter-active { animation: modal-in 0.28s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { animation: modal-out 0.18s ease forwards; }

@keyframes modal-in {
  from { opacity: 0; transform: scale(0.88); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes modal-out {
  from { opacity: 1; transform: scale(1); }
  to   { opacity: 0; transform: scale(0.92); }
}
</style>
