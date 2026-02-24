<template>
  <div class="stat-card" :class="`card-${color}`">
    <div class="stat-top">
      <div class="stat-icon-wrap" :class="`icon-${color}`">
        <!-- folder -->
        <svg v-if="icon === 'folder'" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linejoin="round"
          />
        </svg>
        <!-- list -->
        <svg v-else-if="icon === 'list'" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <!-- check -->
        <svg v-else-if="icon === 'check'" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 6L9 17l-5-5"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <!-- clock -->
        <svg v-else-if="icon === 'clock'" width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
          <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
      <p class="stat-title">{{ title }}</p>
    </div>
    <h3 class="stat-value">{{ value }}</h3>
    <div class="stat-bar"><div class="stat-bar-fill" :class="`bar-${color}`"></div></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  value: number
  icon?: string
  color?: string
}>()
</script>

<style scoped>
.stat-card {
  background: #0d1420;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 18px;
  padding: 22px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
}
.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
.stat-top {
  display: flex;
  align-items: center;
  gap: 10px;
}
.stat-icon-wrap {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.icon-blue {
  background: rgba(59, 130, 246, 0.15);
  color: #60a5fa;
}
.icon-purple {
  background: rgba(139, 92, 246, 0.15);
  color: #a78bfa;
}
.icon-green {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
}
.icon-orange {
  background: rgba(249, 115, 22, 0.15);
  color: #fb923c;
}

.stat-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #f1f5f9;
  letter-spacing: -0.02em;
  font-family: 'JetBrains Mono', monospace;
}
.stat-bar {
  height: 3px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 999px;
  overflow: hidden;
}
.stat-bar-fill {
  height: 100%;
  width: 60%;
  border-radius: 999px;
}
.bar-blue {
  background: linear-gradient(90deg, #3b82f6, #60a5fa);
}
.bar-purple {
  background: linear-gradient(90deg, #8b5cf6, #a78bfa);
}
.bar-green {
  background: linear-gradient(90deg, #10b981, #34d399);
}
.bar-orange {
  background: linear-gradient(90deg, #f97316, #fb923c);
}
</style>
