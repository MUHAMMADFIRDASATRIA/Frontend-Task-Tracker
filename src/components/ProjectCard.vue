<template>
  <div class="project-card" @click="$emit('click', project.id)">
    <div class="card-top">
      <div class="card-top-left">
        <div class="project-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path
              d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z"
              stroke="currentColor"
              stroke-width="1.8"
            />
          </svg>
        </div>
        <span class="role-badge" :class="project.role === 'leader' ? 'badge-leader' : 'badge-member'">
          <svg v-if="project.role === 'leader'" width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
          <svg v-else width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          </svg>
          {{ project.role === 'leader' ? 'Leader' : 'Member' }}
        </span>
      </div>
      <span :class="['status-badge', statusClass(project)]">{{ statusLabel(project) }}</span>
    </div>

    <h3 class="project-title">{{ project.title }}</h3>
    <p class="project-desc">{{ project.description || 'Tidak ada deskripsi' }}</p>

    <div class="progress-section">
      <div class="progress-header">
        <span class="progress-label">Progress</span>
        <span class="progress-value">{{ project.progress }}%</span>
      </div>
      <div class="progress-track">
        <div class="progress-fill" :style="{ width: project.progress + '%' }"></div>
      </div>
    </div>

    <div class="card-footer">
      <div class="meta-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" stroke-width="2" />
          <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        {{ formatDate(project.deadline) }}
      </div>
      <div class="meta-item">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2" />
          <path d="M12 7v5l3 3" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
        </svg>
        {{ project.taskCount ?? 0 }} tugas
      </div>
    </div>

    <!-- Actions: hanya tampil untuk leader -->
    <div v-if="project.role === 'leader'" class="card-actions">
      <button class="btn-action btn-members" @click.stop="$emit('manage-members', project)">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Anggota
      </button>
      <button class="btn-action btn-edit" @click.stop="$emit('edit', project.id)">Edit</button>
      <button class="btn-action btn-delete" @click.stop="$emit('delete', project.id)">Hapus</button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  id: number
  title: string
  description?: string
  progress: number
  deadline?: string
  taskCount?: number
  role?: 'leader' | 'member'
}

defineProps<{
  project: Project
}>()

defineEmits<{
  (e: 'click', id: number): void
  (e: 'edit', id: number): void
  (e: 'delete', id: number): void
  (e: 'manage-members', project: Project): void
}>()

const statusClass = (p: Project) => (p.progress === 100 ? 'badge-green' : 'badge-blue')
const statusLabel = (p: Project) => (p.progress === 100 ? 'Selesai' : 'Berjalan')

const formatDate = (date?: string) => {
  if (!date) return '—'
  return new Date(date).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}
</script>

<style scoped>
.project-card {
  background: #0d1420;
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 14px;
  padding: 20px;
  cursor: pointer;
  transition: border-color 0.2s, transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-card:hover {
  border-color: rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.card-top-left {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-icon {
  width: 36px;
  height: 36px;
  background: rgba(99, 102, 241, 0.12);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #818cf8;
}

.role-badge {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.63rem;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  padding: 3px 8px;
  border-radius: 6px;
}

.badge-leader {
  background: rgba(234, 179, 8, 0.1);
  color: #fbbf24;
  border: 1px solid rgba(234, 179, 8, 0.2);
}

.badge-member {
  background: rgba(99, 102, 241, 0.1);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.2);
}

.status-badge {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-blue {
  background: rgba(99, 102, 241, 0.12);
  color: #818cf8;
}

.badge-green {
  background: rgba(34, 197, 94, 0.12);
  color: #4ade80;
}

.project-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: #f1f5f9;
  line-height: 1.4;
}

.project-desc {
  font-size: 0.78rem;
  color: #475569;
  line-height: 1.5;
  flex: 1;
}

.progress-section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
}

.progress-label { color: #475569; }

.progress-value {
  color: #94a3b8;
  font-family: 'JetBrains Mono', monospace;
}

.progress-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.06);
  border-radius: 99px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 99px;
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
  transition: width 0.4s ease;
}

.card-footer {
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.04);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.72rem;
  color: #475569;
}

.card-actions {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.btn-action {
  flex: 1;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 9px;
  background: rgba(255, 255, 255, 0.02);
  color: #cbd5e1;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 8px 10px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
}

.btn-members {
  color: #22d3ee;
  border-color: rgba(6, 182, 212, 0.2);
}

.btn-members:hover {
  background: rgba(6, 182, 212, 0.08);
  border-color: rgba(6, 182, 212, 0.4);
}

.btn-edit:hover {
  border-color: rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
}

.btn-delete {
  border-color: rgba(248, 113, 113, 0.25);
  color: #fca5a5;
}

.btn-delete:hover {
  background: rgba(248, 113, 113, 0.08);
  border-color: rgba(248, 113, 113, 0.45);
  color: #fda4af;
}
</style>