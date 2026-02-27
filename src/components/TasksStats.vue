<template>
  <div class="stats-wrapper">
    <!-- Button Anggota di atas kanan -->
    <div class="stats-header">
      <button class="btn-members" @click.stop="$emit('manage-members')">
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
          <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Anggota
      </button>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card stat-card-green">
        <div class="card-glow card-glow-green"></div>
        <div class="card-inner">
          <div class="icon-wrap icon-wrap-green">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <p class="stat-label">Selesai</p>
          <p class="stat-value">
            <span class="stat-number">{{ completed }}</span>
            <span class="stat-unit">tugas</span>
          </p>
          <div class="stat-bar">
            <div class="stat-bar-fill stat-bar-green" :style="{ width: progress + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-amber">
        <div class="card-glow card-glow-amber"></div>
        <div class="card-inner">
          <div class="icon-wrap icon-wrap-amber">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <p class="stat-label">Tertunda</p>
          <p class="stat-value">
            <span class="stat-number">{{ pending }}</span>
            <span class="stat-unit">tugas</span>
          </p>
          <div class="stat-bar">
            <div class="stat-bar-fill stat-bar-amber" :style="{ width: (pending / (completed + pending) * 100) + '%' }"></div>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card-cyan">
        <div class="card-glow card-glow-cyan"></div>
        <div class="card-inner">
          <div class="icon-wrap icon-wrap-cyan">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
          </div>
          <p class="stat-label">Progress</p>
          <p class="stat-value">
            <span class="stat-number">{{ progress }}</span>
            <span class="stat-unit">%</span>
          </p>
          <div class="progress-ring-wrap">
            <svg class="progress-ring" width="40" height="40" viewBox="0 0 40 40">
              <circle class="ring-track" cx="20" cy="20" r="16" />
              <circle
                class="ring-fill ring-fill-cyan"
                cx="20" cy="20" r="16"
                :style="{ strokeDashoffset: 100.5 - (progress / 100) * 100.5 }"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  completed: number
  pending: number
  progress: number
}>()

defineEmits<{
  (e: 'manage-members'): void
}>()
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Sora:wght@400;600;700&display=swap');

.stats-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  font-family: 'Sora', sans-serif;
}

/* ── Header row with button ── */
.stats-header {
  display: flex;
  justify-content: flex-end;
}

.btn-members {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.35);
  background: rgba(56, 189, 248, 0.08);
  color: #38bdf8;
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}

.btn-members:hover {
  background: rgba(56, 189, 248, 0.18);
  border-color: rgba(56, 189, 248, 0.6);
  transform: translateY(-1px);
}

.btn-members:active {
  transform: translateY(0);
}

/* ── Grid ── */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

/* ── Card Base ── */
.stat-card {
  position: relative;
  border-radius: 20px;
  padding: 1px;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.stat-card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 20px;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.03) 100%);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
}

.stat-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-inner {
  position: relative;
  z-index: 1;
  padding: 20px;
  border-radius: 19px;
  background: #0f172a;
  height: 100%;
  box-sizing: border-box;
}

/* ── Glow ── */
.card-glow {
  position: absolute;
  width: 120px;
  height: 120px;
  border-radius: 50%;
  filter: blur(40px);
  top: -20px;
  right: -20px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.6;
  transition: opacity 0.3s;
}
.stat-card:hover .card-glow { opacity: 0.9; }

.card-glow-green { background: rgba(16, 185, 129, 0.5); }
.card-glow-amber { background: rgba(245, 158, 11, 0.5); }
.card-glow-cyan  { background: rgba(6, 182, 212, 0.5); }

/* ── Icon ── */
.icon-wrap {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 10px;
  margin-bottom: 14px;
}

.icon-wrap-green { background: rgba(16, 185, 129, 0.18); color: #34d399; }
.icon-wrap-amber { background: rgba(245, 158, 11, 0.18); color: #fbbf24; }
.icon-wrap-cyan  { background: rgba(6, 182, 212, 0.18);  color: #22d3ee; }

/* ── Label ── */
.stat-label {
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #64748b;
  margin: 0 0 6px;
}

/* ── Value ── */
.stat-value {
  display: flex;
  align-items: baseline;
  gap: 5px;
  margin: 0 0 14px;
}

.stat-number {
  font-family: 'DM Mono', monospace;
  font-size: 2rem;
  font-weight: 500;
  color: #f1f5f9;
  line-height: 1;
  letter-spacing: -0.03em;
}

.stat-unit {
  font-size: 0.78rem;
  color: #475569;
  font-weight: 400;
}

/* ── Progress bar ── */
.stat-bar {
  height: 4px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.07);
  overflow: hidden;
}

.stat-bar-fill {
  height: 100%;
  border-radius: 99px;
  transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.stat-bar-green { background: linear-gradient(90deg, #059669, #34d399); }
.stat-bar-amber { background: linear-gradient(90deg, #d97706, #fbbf24); }

/* ── Ring ── */
.progress-ring-wrap {
  position: absolute;
  bottom: 18px;
  right: 18px;
}

.progress-ring {
  transform: rotate(-90deg);
}

.ring-track {
  fill: none;
  stroke: rgba(255,255,255,0.07);
  stroke-width: 3;
}

.ring-fill {
  fill: none;
  stroke-width: 3;
  stroke-linecap: round;
  stroke-dasharray: 100.5;
  transition: stroke-dashoffset 0.7s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.ring-fill-cyan { stroke: #22d3ee; }

/* ── Responsive ── */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>