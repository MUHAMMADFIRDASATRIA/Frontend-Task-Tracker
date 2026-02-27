<template>
  <div class="task-panel">
    <!-- Header -->
    <div class="task-panel-header">
      <div class="header-left">
        <span class="header-eyebrow">Hari ini</span>
        <h2 class="task-panel-title">Daftar Tugas</h2>
      </div>

      <button  v-if="isLeader" @click="$emit('add-task')" class="btn-add-task">
        <span class="btn-icon">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
        </span>
        Tambah
      </button>
    </div>

    <!-- Divider -->
    <div class="divider"></div>

    <!-- Loading -->
    <div v-if="loading" class="task-state">
      <div class="loader-dots">
        <span></span><span></span><span></span>
      </div>
      <p class="state-text">Memuat tugas…</p>
    </div>

    <!-- Empty -->
    <div v-else-if="tasks.length === 0" class="task-state">
      <div class="empty-icon">
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
          <rect x="14" y="14" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/>
        </svg>
      </div>
      <p class="state-text">Belum ada tugas</p>
      <p class="state-sub" v-if="isLeader">Tekan tombol tambah untuk mulai</p>
      <p class="state-sub" v-else>Belum ada tugas untuk kamu</p>
    </div>

    <!-- Task List -->
    <ul v-else class="task-list">
      <li
        v-for="task in sortedTasks"
        :key="task.id"
        :class="['task-item', task.finish ? 'task-item-done' : '']"
      >
        <!-- Main row: checkbox + title/badges + actions -->
        <div class="task-main-row">
          <!-- Custom checkbox -->
          <div
            :class="['custom-check', task.finish ? 'custom-check-active' : '']"
            @click="onToggle(task, { target: { checked: !task.finish } } as unknown as Event)"
          >
            <svg v-if="task.finish" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>

          <!-- Content -->
          <div class="task-content">
            <!-- Title row -->
            <div class="task-title-row">
              <span :class="['task-title', task.finish ? 'task-title-done' : '']">
                {{ task.title }}
              </span>
              <div class="task-badges">
                <!-- Priority badge (always rendered with fallback) -->
                <span :class="['task-badge', task.priority ? priorityClass(task.priority as string) : 'badge-none']">
                  {{ task.priority ? priorityLabel(task.priority as string) : '-' }}
                </span>
                <!-- Status badge -->
                <span :class="['task-badge', task.finish ? 'badge-done' : 'badge-pending']">
                  {{ task.finish ? 'Selesai' : 'Proses' }}
                </span>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div v-if="isLeader" class="task-actions" @click.stop>
            <button class="btn-action btn-edit" title="Edit" @click="emit('edit-task', task)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="btn-action btn-delete" title="Hapus" @click="emit('delete-task', task)">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                <path d="M10 11v6M14 11v6"/>
                <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
              </svg>
            </button>
          </div>
        </div>

        <!-- Description -->
        <p v-if="task.description" :class="['task-desc', task.finish ? 'task-desc-done' : '']">
          {{ task.description }}
        </p>
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface TaskItem {
  id: number
  title?: string
  description?: string
  priority?: string
  finish?: boolean
  [key: string]: unknown
}

const props = defineProps<{
  tasks: TaskItem[]
  loading: boolean
  isLeader: boolean
}>()

const priorityWeight = (p?: string) => {
  if (!p) return 3
  const map: Record<string, number> = { high: 0, medium: 1, low: 2 }
  return map[p.toLowerCase()] ?? 3
}

const sortedTasks = computed(() =>
  [...props.tasks].sort((a, b) => {
    // unfinished tasks first
    const finishComp = Number(Boolean(a.finish)) - Number(Boolean(b.finish))
    if (finishComp !== 0) return finishComp

    // both same finish state: sort by priority (high -> medium -> low -> none)
    const aWeight = priorityWeight(a.priority)
    const bWeight = priorityWeight(b.priority)
    return aWeight - bWeight
  }),
)

const emit = defineEmits<{
  (e: 'add-task'): void
  (e: 'toggle-task', task: TaskItem): void
  (e: 'edit-task', task: TaskItem): void
  (e: 'delete-task', task: TaskItem): void
}>()

const onToggle = (task: TaskItem, event: Event) => {
  const checked = (event.target as HTMLInputElement).checked
  emit('toggle-task', { ...task, finish: checked })
}

const priorityLabel = (priority?: string): string => {
  const map: Record<string, string> = {
    high: 'Tinggi',
    medium: 'Sedang',
    low: 'Rendah',
  }
  if (!priority) return '-'
  return map[priority?.toLowerCase()] ?? priority
}

const priorityClass = (priority?: string): string => {
  const map: Record<string, string> = {
    high: 'badge-high',
    medium: 'badge-medium',
    low: 'badge-low',
  }
  if (!priority) return 'badge-none'
  return map[priority?.toLowerCase()] ?? 'badge-pending'
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap');

/* ── Panel ── */
.task-panel {
  font-family: 'DM Sans', sans-serif;
  background: #080f1e;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 22px;
  padding: 24px;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  flex: 1;
  min-height: 0;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.5);
}

/* subtle radial accent top-right */
.task-panel::before {
  content: '';
  position: absolute;
  width: 280px;
  height: 280px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(37, 99, 235, 0.12) 0%, transparent 70%);
  top: -80px;
  right: -80px;
  pointer-events: none;
}

/* ── Header ── */
.task-panel-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.header-eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #2563eb;
}

.task-panel-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: #f1f5f9;
  margin: 0;
  line-height: 1.2;
}

/* ── Add Button ── */
.btn-add-task {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 8px 16px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #1d4ed8, #0891b2);
  color: #fff;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease;
  box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
  white-space: nowrap;
}

.btn-add-task:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(37, 99, 235, 0.45);
}

.btn-add-task:active {
  transform: translateY(0);
}

.btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,255,255,0.18);
  border-radius: 6px;
  width: 20px;
  height: 20px;
}

/* ── Divider ── */
.divider {
  height: 1px;
  background: linear-gradient(90deg, rgba(255,255,255,0.08) 0%, transparent 100%);
  margin: 18px 0;
}

/* ── States ── */
.task-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  min-height: 0;
  padding: 36px 16px;
  gap: 10px;
}

.state-text {
  font-size: 0.88rem;
  font-weight: 500;
  color: #64748b;
  margin: 0;
}

.state-sub {
  font-size: 0.78rem;
  color: #334155;
  margin: 0;
}

.empty-icon {
  color: #1e293b;
  margin-bottom: 4px;
}

/* loader dots */
.loader-dots {
  display: flex;
  gap: 6px;
}

.loader-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #2563eb;
  animation: bounce 1.2s infinite ease-in-out;
}

.loader-dots span:nth-child(2) { animation-delay: 0.2s; }
.loader-dots span:nth-child(3) { animation-delay: 0.4s; }

@keyframes bounce {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.4; }
  40% { transform: scale(1); opacity: 1; }
}

/* ── Task List ── */
.task-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding-right: 4px;
}

.task-list::-webkit-scrollbar {
  width: 5px;
}

.task-list::-webkit-scrollbar-track {
  background: transparent;
}

.task-list::-webkit-scrollbar-thumb {
  background: rgba(148, 163, 184, 0.35);
  border-radius: 999px;
}

.task-list::-webkit-scrollbar-thumb:hover {
  background: rgba(148, 163, 184, 0.55);
}

/* ── Task Item ── */
.task-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 13px 14px;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.055);
  cursor: default;
  transition: background 0.18s ease, border-color 0.18s ease, transform 0.15s ease;
  user-select: none;
}

.task-item:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.1);
  transform: translateX(2px);
}

.task-item-done {
  background: rgba(16, 185, 129, 0.04);
  border-color: rgba(16, 185, 129, 0.12);
}

/* ── Custom Checkbox ── */
.custom-check {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 6px;
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.15s ease, border-color 0.15s ease, transform 0.12s ease, box-shadow 0.15s ease;
}

.custom-check:hover {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.12);
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.custom-check:active {
  transform: scale(0.88);
}

.custom-check-active {
  background: #10b981;
  border-color: #10b981;
  color: #fff;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
}

.custom-check-active:hover {
  background: #059669;
  border-color: #059669;
}

/* ── Task Title ── */
.task-title {
  font-size: 0.88rem;
  font-weight: 500;
  color: #cbd5e1;
  transition: color 0.18s ease;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}

.task-title-done {
  color: #334155;
  text-decoration: line-through;
  text-decoration-color: #475569;
}

/* ── Badge ── */
.task-badge {
  flex-shrink: 0;
  font-family: 'DM Mono', monospace;
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  padding: 3px 8px;
  border-radius: 6px;
}

.badge-pending {
  background: rgba(37, 99, 235, 0.12);
  color: #60a5fa;
  border: 1px solid rgba(37, 99, 235, 0.2);
}

.badge-done {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.2);
}

/* ── Priority Badges ── */
.badge-high {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.badge-medium {
  background: rgba(245, 158, 11, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.2);
}

.badge-low {
  background: rgba(100, 116, 139, 0.1);
  color: #94a3b8;
  border: 1px solid rgba(100, 116, 139, 0.2);
}

/* ── No-priority badge ── */
.badge-none {
  background: rgba(255,255,255,0.02);
  color: #475569;
  border: 1px solid rgba(255,255,255,0.03);
}

/* ── Task Main Row ── */
.task-main-row {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

/* ── Task Content ── */
.task-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.task-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.task-badges {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
}

/* ── Task Description ── */
.task-desc {
  font-size: 0.78rem;
  color: #64748b;
  margin: 0;
  padding-left: 32px;
  line-height: 1.5;
  white-space: normal;
  word-break: break-word;
}

.task-desc-done {
  color: #334155;
}

/* ── Action Buttons ── */
.task-actions {
  display: flex;
  align-items: center;
  gap: 5px;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.18s ease;
}

.task-item:hover .task-actions {
  opacity: 1;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease, transform 0.15s ease;
}

.btn-edit {
  background: rgba(37, 99, 235, 0.12);
  color: #60a5fa;
}

.btn-edit:hover {
  background: rgba(37, 99, 235, 0.25);
  transform: scale(1.1);
}

.btn-delete {
  background: rgba(239, 68, 68, 0.1);
  color: #f87171;
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.22);
  transform: scale(1.1);
}
</style>