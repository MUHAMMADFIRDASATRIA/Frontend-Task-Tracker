<template>
  <div class="table-card">
    <!-- Header -->
    <div class="table-header">
      <div class="header-left">
        <span class="header-eyebrow">Ringkasan</span>
        <h3 class="table-title">Tugas Terbaru</h3>
      </div>
      <div class="header-right">
        <div class="count-pill">
          <span class="count-dot"></span>
          <span class="count-num">{{ tasks.length }}</span>
          <span class="count-label">tugas</span>
        </div>
      </div>
    </div>

    <!-- Column Labels -->
    <div class="col-labels">
      <span class="col-label col-detail">Detail Tugas</span>
      <span class="col-label col-project">Proyek</span>
      <span class="col-label col-priority">Prioritas</span>
      <span class="col-label col-status">Status</span>
    </div>

    <!-- Body -->
    <div class="table-body">
      <!-- Loading -->
      <div v-if="loading" class="state-wrap">
        <div class="spinner-ring">
          <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="18" cy="18" r="15" stroke="rgba(255,255,255,0.06)" stroke-width="3"/>
            <path d="M18 3 A15 15 0 0 1 33 18" stroke="#3b82f6" stroke-width="3" stroke-linecap="round"/>
          </svg>
        </div>
        <p class="state-text">Memuat data…</p>
      </div>

      <!-- Empty -->
      <div v-else-if="tasks.length === 0" class="state-wrap">
        <div class="empty-glyph">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="9" y1="13" x2="15" y2="13"/>
            <line x1="9" y1="17" x2="12" y2="17"/>
          </svg>
        </div>
        <p class="state-text">Belum ada tugas</p>
        <p class="state-sub">Data akan muncul di sini</p>
      </div>

      <!-- Rows -->
      <div
        v-else
        v-for="(task, i) in sortedTasks"
        :key="task.id"
        class="task-row"
        :style="{ animationDelay: i * 45 + 'ms' }"
      >
        <!-- Detail -->
        <div class="cell cell-detail">
          <div class="status-indicator" :class="task.finish ? 'ind-green' : 'ind-blue'"></div>
          <div class="task-info">
            <span class="task-name" :class="{ 'task-name-done': task.finish }">{{ task.title }}</span>
          </div>
        </div>

        <!-- Project -->
        <div class="cell cell-project">
          <span class="project-chip">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            {{ task.projectTitle }}
          </span>
        </div>

        <!-- Priority -->
        <div class="cell cell-priority">
          <span class="priority-chip" :class="priorityClass(task.priority)">
            {{ priorityLabel(task.priority) }}
          </span>
        </div>

        <!-- Status -->
        <div class="cell cell-status">
          <span class="status-pill" :class="task.finish ? 'pill-done' : 'pill-pending'">
            <span class="pill-glow"></span>
            {{ task.finish ? 'Selesai' : 'Pending' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="!loading && tasks.length > 0" class="table-footer">
      <span>{{ tasks.filter(t => t.finish).length }} selesai</span>
      <span class="footer-sep">·</span>
      <span>{{ tasks.filter(t => !t.finish).length }} pending</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  tasks: any[]
  loading: boolean
}>()

const sortedTasks = computed(() =>
  // Show only tasks that are not finished
  [...props.tasks]
    .filter((t) => !t.finish)
    .sort((a, b) => {
      const priorityOrder: Record<string, number> = { high: 0, medium: 1, low: 2 }
      const aPriority = priorityOrder[a.priority?.toLowerCase() ?? ''] ?? 3
      const bPriority = priorityOrder[b.priority?.toLowerCase() ?? ''] ?? 3

      if (aPriority !== bPriority) {
        return aPriority - bPriority
      }

      // both are unfinished here; keep original order fallback
      return 0
    }),
)

const priorityLabel = (priority?: string) => {
  if (!priority) return '-'
  const map: Record<string, string> = { high: 'Tinggi', medium: 'Sedang', low: 'Rendah' }
  return map[priority.toLowerCase()] ?? priority
}

const priorityClass = (priority?: string) => {
  if (!priority) return 'chip-none'
  const map: Record<string, string> = { high: 'chip-high', medium: 'chip-medium', low: 'chip-low' }
  return map[priority.toLowerCase()] ?? 'chip-none'
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* ─── Card ─── */
.table-card {
  font-family: 'DM Sans', sans-serif;
  background: #080f1e;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 22px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  position: relative;
}

/* top-right ambient glow */
.table-card::after {
  content: '';
  position: absolute;
  width: 300px;
  height: 200px;
  top: -60px;
  right: -80px;
  background: radial-gradient(ellipse, rgba(59, 130, 246, 0.09) 0%, transparent 65%);
  pointer-events: none;
}

/* ─── Header ─── */
.table-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding: 22px 26px 18px;
}

.header-eyebrow {
  display: block;
  font-size: 0.67rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #2563eb;
  margin-bottom: 3px;
}

.table-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
}

.count-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 99px;
  padding: 5px 12px;
}

.count-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #3b82f6;
  box-shadow: 0 0 6px rgba(59, 130, 246, 0.7);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.count-num {
  font-family: 'DM Mono', monospace;
  font-size: 0.82rem;
  font-weight: 500;
  color: #60a5fa;
}

.count-label {
  font-size: 0.72rem;
  color: #3b82f6;
  opacity: 0.7;
}

/* ─── Column Labels ─── */
.col-labels {
  display: grid;
  grid-template-columns: 1fr 180px 120px 130px;
  padding: 0 26px 10px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.col-label {
  font-size: 0.67rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: #334155;
}

/* ─── Body ─── */
.table-body {
  flex: 1;
  overflow-y: auto;
  min-height: 0;
}

.table-body::-webkit-scrollbar {
  width: 4px;
}
.table-body::-webkit-scrollbar-track { background: transparent; }
.table-body::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.08);
  border-radius: 99px;
}

/* ─── States ─── */
.state-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 56px 24px;
  gap: 10px;
}

.state-text {
  font-size: 0.88rem;
  font-weight: 500;
  color: #475569;
  margin: 0;
}

.state-sub {
  font-size: 0.78rem;
  color: #1e293b;
  margin: 0;
}

.empty-glyph {
  color: #1e293b;
  margin-bottom: 4px;
}

/* spinner */
.spinner-ring {
  width: 38px;
  height: 38px;
  animation: spin 1s linear infinite;
  margin-bottom: 4px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ─── Task Row ─── */
.task-row {
  display: grid;
  grid-template-columns: 1fr 180px 120px 130px;
  align-items: center;
  padding: 0 26px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
  transition: background 0.15s ease;
  animation: fadeUp 0.3s both;
  cursor: default;
}

.task-row:last-child {
  border-bottom: none;
}

.task-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ─── Cells ─── */
.cell {
  padding: 14px 0;
}

.cell-detail {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-right: 16px;
}

/* status bar on left edge */
.status-indicator {
  flex-shrink: 0;
  width: 3px;
  height: 28px;
  border-radius: 99px;
}

.ind-green { background: linear-gradient(180deg, #10b981, #059669); box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
.ind-blue  { background: linear-gradient(180deg, #60a5fa, #3b82f6); box-shadow: 0 0 8px rgba(59, 130, 246, 0.4); }

.task-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.task-name {
  font-size: 0.88rem;
  font-weight: 600;
  color: #cbd5e1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.15s;
}

.task-name-done {
  color: #334155;
  text-decoration: line-through;
  text-decoration-color: #1e293b;
}

/* ─── Project Chip ─── */
.project-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 0.78rem;
  font-weight: 500;
  color: #475569;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.07);
  padding: 4px 10px;
  border-radius: 8px;
  white-space: nowrap;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Priority chip */
.cell-priority { padding-left: 8px; }
.priority-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}
.chip-high { background: rgba(239, 68, 68, 0.08); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.15); }
.chip-medium { background: rgba(245, 158, 11, 0.08); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.15); }
.chip-low { background: rgba(100, 116, 139, 0.08); color: #94a3b8; border: 1px solid rgba(100, 116, 139, 0.12); }
.chip-none { background: rgba(255,255,255,0.02); color: #475569; border: 1px solid rgba(255,255,255,0.03); }

/* ─── Status Pill ─── */
.status-pill {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 5px 12px;
  border-radius: 99px;
  letter-spacing: 0.02em;
  overflow: hidden;
}

.pill-glow {
  position: absolute;
  inset: 0;
  opacity: 0.12;
  border-radius: inherit;
}

.pill-done {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.pill-done::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  display: inline-block;
}

.pill-pending {
  background: rgba(59, 130, 246, 0.1);
  color: #93c5fd;
  border: 1px solid rgba(59, 130, 246, 0.2);
}

.pill-pending::before {
  content: '';
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #60a5fa;
  display: inline-block;
  animation: pulse 2s ease-in-out infinite;
}

/* ─── Footer ─── */
.table-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 26px;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  font-family: 'DM Mono', monospace;
  font-size: 0.72rem;
  color: #f8fafc;
}

.footer-sep {
  color: rgba(248, 250, 252, 0.7);
}
</style>