<template>
  <div class="page-header">
    <div class="page-title-wrap">
      <div class="page-eyebrow">
        <span class="eyebrow-dot"></span>
        <span>Form Baru</span>
      </div>
      <h1 class="page-title">Tambah <span class="title-accent">Task</span></h1>
      <p class="page-desc">Pecah pekerjaan besar menjadi langkah-langkah kecil yang dapat dikelola.</p>
    </div>
    <button @click="$emit('back')" class="btn-back">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
      Kembali
    </button>
  </div>
</template>

<script setup lang="ts">
defineEmits<{ (e: 'back'): void }>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=JetBrains+Mono:wght@400;500&display=swap');

.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.page-title-wrap {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.page-eyebrow {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6366f1;
}

.eyebrow-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #6366f1;
  box-shadow: 0 0 7px #6366f1;
  animation: blink 2.5s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}

.page-title {
  font-family: 'Sora', sans-serif;
  font-size: 1.75rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.02em;
  line-height: 1;
  margin: 0;
}

.title-accent {
  background: linear-gradient(135deg, #818cf8, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-desc {
  font-size: 0.82rem;
  color: #64748b;
  max-width: 380px;
  margin: 0;
}

.btn-back {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 16px;
  border-radius: 10px;
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.07);
  color: #94a3b8;
  font-family: 'Sora', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.18s ease;
  white-space: nowrap;
  flex-shrink: 0;
}

.btn-back:hover {
  background: rgba(255,255,255,0.07);
  color: #e2e8f0;
  border-color: rgba(255,255,255,0.12);
}
</style>
