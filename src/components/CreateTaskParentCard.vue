<template>
  <div class="parent-card">
    <div class="parent-icon">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>
      </svg>
    </div>
    <div class="parent-info">
      <span class="parent-eyebrow">Task Utama</span>
      <h4 class="parent-title">{{ parentTaskTitle }}</h4>
      <p class="parent-desc">Subtask ini akan dikaitkan langsung dengan progres pekerjaan di atas.</p>
    </div>
    <div class="parent-badge">
      <span class="badge-dot"></span>
      Aktif
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  parentTaskTitle: string
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700&family=JetBrains+Mono:wght@400;500&display=swap');

.parent-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 18px 20px;
  background: rgba(99,102,241,0.06);
  border: 1px solid rgba(99,102,241,0.2);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
}

.parent-card::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: linear-gradient(180deg, #818cf8, #60a5fa);
  border-radius: 3px 0 0 3px;
}

.parent-icon {
  width: 40px; height: 40px;
  border-radius: 10px;
  background: rgba(99,102,241,0.1);
  border: 1px solid rgba(99,102,241,0.2);
  display: flex; align-items: center; justify-content: center;
  color: #818cf8;
  flex-shrink: 0;
}

.parent-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.parent-eyebrow {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.58rem;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  color: #818cf8;
}

.parent-title {
  font-family: 'Sora', sans-serif;
  font-size: 0.95rem;
  font-weight: 700;
  color: #f1f5f9;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  margin: 0;
}

.parent-desc {
  font-size: 0.75rem;
  color: #64748b;
  line-height: 1.4;
  margin: 0;
}

.parent-badge {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 4px 10px;
  border-radius: 6px;
  background: rgba(16,185,129,0.08);
  border: 1px solid rgba(16,185,129,0.18);
  color: #34d399;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.62rem;
  font-weight: 500;
  flex-shrink: 0;
}

.badge-dot {
  width: 5px; height: 5px;
  border-radius: 50%;
  background: #34d399;
  box-shadow: 0 0 6px #34d399;
  animation: blink 2s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50%       { opacity: 0.4; }
}
</style>
