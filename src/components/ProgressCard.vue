<template>
  <div class="progress-card">
    <div class="progress-header">
      <span class="progress-label">Progress Keseluruhan</span>
      <span class="progress-pct">{{ completionPercent }}%</span>
    </div>
    <div class="progress-track">
      <div class="progress-fill" :style="{ width: completionPercent + '%' }"></div>
    </div>
    <p class="progress-sub">{{ completedTasks }} dari {{ totalTasks }} tugas selesai</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  completionPercent: number
  completedTasks: number
  totalTasks: number
}>()
</script>

<style scoped>
.progress-card {
  background: #0d1420;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 16px;
  padding: 20px 24px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.progress-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #94a3b8;
}

.progress-pct {
  font-size: 1.1rem;
  font-weight: 700;
  color: #60a5fa;
  font-family: 'JetBrains Mono', monospace;
}

.progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 999px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  border-radius: 999px;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-sub {
  font-size: 0.75rem;
  color: #475569;
  margin-top: 8px;
}
</style>
