<template>
  <div class="stats-wrapper">

    <!-- Stats Grid -->
    <div class="stats-grid">

      <!-- Card: Selesai -->
      <div class="stat-card card-green">
        <div class="card-bg-glow glow-green"></div>
        <div class="card-content">
          <div class="card-top">
            <div class="icon-pill icon-green">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            <span class="card-label">Selesai</span>
          </div>

          <div class="card-value-row">
            <span class="card-number">{{ completed }}</span>
            <span class="card-unit">tugas</span>
          </div>

          <div class="bar-track">
            <div class="bar-fill bar-green" :style="{ width: clamp(progress) + '%' }"></div>
          </div>
          <span class="bar-label">{{ progress }}% dari total</span>
        </div>
        <div class="corner-accent accent-green"></div>
      </div>

      <!-- Card: Tertunda -->
      <div class="stat-card card-amber">
        <div class="card-bg-glow glow-amber"></div>
        <div class="card-content">
          <div class="card-top">
            <div class="icon-pill icon-amber">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <span class="card-label">Tertunda</span>
          </div>

          <div class="card-value-row">
            <span class="card-number">{{ pending }}</span>
            <span class="card-unit">tugas</span>
          </div>

          <div class="bar-track">
            <div class="bar-fill bar-amber" :style="{ width: clamp(pendingPercent) + '%' }"></div>
          </div>
          <span class="bar-label">{{ Math.round(pendingPercent) }}% dari total</span>
        </div>
        <div class="corner-accent accent-amber"></div>
      </div>

      <!-- Card: Progress + Tombol Anggota -->
      <div class="stat-card card-cyan">
        <div class="card-bg-glow glow-cyan"></div>
        <div class="card-content">
          <div class="card-top">
            <div class="icon-pill icon-cyan">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
            </div>
            <span class="card-label">Progress</span>
            <button class="btn-members" @click.stop="$emit('manage-members')">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Anggota
            </button>
          </div>

          <div class="progress-center">
            <div class="ring-wrap">
              <svg width="76" height="76" viewBox="0 0 76 76" class="ring-svg">
                <circle class="ring-track" cx="38" cy="38" r="30"/>
                <circle
                  class="ring-fill-circle"
                  cx="38" cy="38" r="30"
                  :style="{ strokeDashoffset: ringOffset }"
                />
              </svg>
              <div class="ring-inner-text">
                <span class="ring-number">{{ progress }}</span>
                <span class="ring-pct">%</span>
              </div>
            </div>
          </div>
        </div>
        <div class="corner-accent accent-cyan"></div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  completed: number
  pending: number
  progress: number
}>()

defineEmits<{
  (e: 'manage-members'): void
}>()

const clamp = (val: number) => Math.min(Math.max(val, 0), 100)

const pendingPercent = computed(() => {
  const total = props.completed + props.pending
  if (total === 0) return 0
  return (props.pending / total) * 100
})

// Circumference of r=30: 2 * π * 30 ≈ 188.5
const CIRCUMFERENCE = 188.5
const ringOffset = computed(() => {
  const pct = clamp(props.progress) / 100
  return CIRCUMFERENCE - pct * CIRCUMFERENCE
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500;600&family=Sora:wght@400;500;600;700&display=swap');

.stats-wrapper {
  font-family: 'Sora', sans-serif;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 14px;
}

/* ── Card ── */
.stat-card {
  position: relative;
  border-radius: 22px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: #0b111f;
  overflow: hidden;
  isolation: isolate;
  transition: transform 0.22s ease, box-shadow 0.22s ease, border-color 0.22s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.45);
}

.card-green:hover { border-color: rgba(16, 185, 129, 0.3); }
.card-amber:hover { border-color: rgba(245, 158, 11, 0.3); }
.card-cyan:hover  { border-color: rgba(6, 182, 212, 0.3); }

/* ── Glow ── */
.card-bg-glow {
  position: absolute;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  filter: blur(55px);
  top: -55px;
  right: -55px;
  z-index: 0;
  pointer-events: none;
  opacity: 0.3;
  transition: opacity 0.3s;
}

.stat-card:hover .card-bg-glow { opacity: 0.55; }

.glow-green { background: rgba(16, 185, 129, 1); }
.glow-amber { background: rgba(245, 158, 11, 1); }
.glow-cyan  { background: rgba(6, 182, 212, 1); }

/* ── Corner accent ── */
.corner-accent {
  position: absolute;
  bottom: -24px;
  left: -24px;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  opacity: 0.06;
  z-index: 0;
  pointer-events: none;
}

.accent-green { background: #10b981; }
.accent-amber { background: #f59e0b; }
.accent-cyan  { background: #06b6d4; }

/* ── Content ── */
.card-content {
  position: relative;
  z-index: 1;
  padding: 20px 20px 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ── Top row ── */
.card-top {
  display: flex;
  align-items: center;
  gap: 9px;
}

/* ── Icon ── */
.icon-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 9px;
  flex-shrink: 0;
  border: 1px solid transparent;
}

.icon-green { background: rgba(16,185,129,0.14); color: #34d399; border-color: rgba(16,185,129,0.22); }
.icon-amber { background: rgba(245,158,11,0.14);  color: #fbbf24; border-color: rgba(245,158,11,0.22); }
.icon-cyan  { background: rgba(6,182,212,0.14);   color: #22d3ee; border-color: rgba(6,182,212,0.22); }

/* ── Label ── */
.card-label {
  font-size: 0.67rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #475569;
  flex: 1;
}

/* ── Value ── */
.card-value-row {
  display: flex;
  align-items: baseline;
  gap: 7px;
}

.card-number {
  font-family: 'DM Mono', monospace;
  font-size: 2.5rem;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1;
  letter-spacing: -0.04em;
}

.card-unit {
  font-size: 0.73rem;
  color: #334155;
  font-weight: 500;
}

/* ── Bar ── */
.bar-track {
  height: 5px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: 999px;
  transition: width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  min-width: 0;
}

.bar-green { background: linear-gradient(90deg, #059669, #34d399); box-shadow: 0 0 8px rgba(52,211,153,0.4); }
.bar-amber { background: linear-gradient(90deg, #d97706, #fbbf24); box-shadow: 0 0 8px rgba(251,191,36,0.4); }

.bar-label {
  font-size: 0.65rem;
  color: #334155;
  margin-top: -5px;
}

/* ── Ring ── */
.progress-center {
  display: flex;
  justify-content: center;
  padding: 2px 0 4px;
}

.ring-wrap {
  position: relative;
  width: 76px;
  height: 76px;
}

.ring-svg {
  transform: rotate(-90deg);
}

.ring-track {
  fill: none;
  stroke: rgba(255, 255, 255, 0.07);
  stroke-width: 5;
}

.ring-fill-circle {
  fill: none;
  stroke: #22d3ee;
  stroke-width: 5;
  stroke-linecap: round;
  stroke-dasharray: 188.5;
  transition: stroke-dashoffset 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  filter: drop-shadow(0 0 5px rgba(34, 211, 238, 0.55));
}

.ring-inner-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1px;
}

.ring-number {
  font-family: 'DM Mono', monospace;
  font-size: 1.2rem;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1;
}

.ring-pct {
  font-family: 'DM Mono', monospace;
  font-size: 0.6rem;
  color: #475569;
  align-self: flex-end;
  padding-bottom: 2px;
}

/* ── Tombol Anggota ── */
.btn-members {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  border-radius: 8px;
  border: 1px solid rgba(6, 182, 212, 0.28);
  background: rgba(6, 182, 212, 0.07);
  color: #22d3ee;
  font-family: 'Sora', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.18s, border-color 0.18s, transform 0.15s;
  margin-left: auto;
}

.btn-members:hover {
  background: rgba(6, 182, 212, 0.15);
  border-color: rgba(6, 182, 212, 0.5);
  transform: translateY(-1px);
}

.btn-members:active { transform: translateY(0); }

/* ── Responsive ── */
@media (max-width: 768px) {
  .stats-grid { grid-template-columns: 1fr; }
}
</style>