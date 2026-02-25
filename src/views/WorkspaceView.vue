<template>
  <div class="app-root">

    <!-- ░░ AMBIENT ░░ -->
    <div class="ambient" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="noise"></div>
    </div>

    <div class="layout">

      <AppSidebar
        :workspaces="workspaces"
        :activeWorkspace="activeWorkspace"
        :view="view"
        @setPersonal="setPersonal"
        @openWorkspace="openWorkspace"
        @openModal="openModal"
      />

      <!-- ══════════════════════════════════════════
           MAIN
      ══════════════════════════════════════════ -->
      <main class="main">

        <AppHeader
          :user="user"
          :userInitial="'AP'"
          :currentDate="new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })"
        />

        <!-- CONTENT AREA -->
        <div class="content-scroll">
          <div class="content-inner">

            <!-- ── PERSONAL (empty state) ────────────────── -->
            <div v-if="view === 'personal'" class="personal-view">
              <div class="personal-hero">
                <div class="personal-hero-bg"></div>
                <div class="personal-hero-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <h2 class="personal-title">Selamat Datang di <span class="title-accent">TaskCollab</span></h2>
                <p class="personal-desc">Pilih workspace di sidebar untuk mulai berkolaborasi, atau buat workspace baru untuk tim kamu.</p>
                <button class="btn-create-ws" @click="openModal('create-ws')">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  Buat Workspace Baru
                </button>
              </div>

              <!-- Workspace cards grid -->
              <div v-if="workspaces.length" class="ws-grid-section">
                <div class="section-label">
                  <span class="section-dot"></span>
                  <span>Workspace Tersedia</span>
                </div>
                <div class="ws-grid">
                  <div
                    v-for="(ws, i) in workspaces"
                    :key="ws.id"
                    class="ws-card"
                    :style="{ '--delay': i * 0.07 + 's' }"
                    @click="openWorkspace(ws)"
                  >
                    <div class="ws-card-icon">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <div class="ws-card-info">
                      <span class="ws-card-name">{{ ws.name }}</span>
                      <span class="ws-card-meta">{{ taskCountFor(ws.id) }} tugas</span>
                    </div>
                    <svg class="ws-card-arrow" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                  </div>
                </div>
              </div>
            </div>

            <!-- ── WORKSPACE DETAIL ──────────────────────── -->
            <div v-else class="workspace-view">

              <!-- Page header -->
              <div class="page-header">
                <div class="page-header-left">
                  <div class="page-eyebrow">
                    <span class="eyebrow-dot"></span>
                    <span>Workspace Tim</span>
                  </div>
                  <h1 class="page-title">
                    <span class="title-accent">{{ activeWorkspace?.name }}</span>
                  </h1>
                  <p class="page-desc">Kelola dan selesaikan tugas bersama tim secara real-time.</p>
                </div>

                <button class="btn-add-task" @click="openModal('add-task')">
                  <span class="btn-add-icon">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </span>
                  Tambah Task
                </button>
              </div>

              <!-- Stats row -->
              <div class="stats-row">
                <div class="stat-pill">
                  <span class="stat-pill-val" style="color:#94a3b8">{{ currentTasks.length }}</span>
                  <span class="stat-pill-label">Total</span>
                </div>
                <div class="stat-sep"></div>
                <div class="stat-pill">
                  <span class="stat-pill-val" style="color:#34d399">{{ doneTasks }}</span>
                  <span class="stat-pill-label">Selesai</span>
                </div>
                <div class="stat-sep"></div>
                <div class="stat-pill">
                  <span class="stat-pill-val" style="color:#22d3ee">{{ pendingTasks }}</span>
                  <span class="stat-pill-label">Berjalan</span>
                </div>
                <!-- Progress -->
                <div class="stat-progress-wrap" v-if="currentTasks.length">
                  <div class="stat-progress-track">
                    <div class="stat-progress-fill" :style="{ width: progressPct + '%' }"></div>
                  </div>
                  <span class="stat-progress-pct">{{ progressPct }}%</span>
                </div>
              </div>

              <!-- Filter tabs -->
              <div class="filter-tabs">
                <button
                  v-for="f in filters"
                  :key="f.id"
                  :class="['filter-tab', activeFilter === f.id ? 'filter-active' : '']"
                  @click="activeFilter = f.id"
                >{{ f.label }}</button>
              </div>

              <!-- Task list -->
              <div class="task-list" v-if="filteredTasks.length">
                <div
                  v-for="(task, index) in filteredTasks"
                  :key="task.id"
                  :class="['task-row', task.completed ? 'task-row-done' : '']"
                  :style="{ '--delay': index * 0.04 + 's' }"
                  @click="toggleTask(task)"
                >
                  <!-- Checkbox -->
                  <div :class="['task-check', task.completed ? 'task-check-done' : '']">
                    <svg v-if="task.completed" width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                  </div>

                  <!-- Content -->
                  <div class="task-content">
                    <span :class="['task-title', task.completed ? 'task-title-done' : '']">{{ task.title }}</span>
                    <span class="task-meta">
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                      {{ formatDate(task.createdAt) }}
                    </span>
                  </div>

                  <!-- Status chip -->
                  <span :class="['task-chip', task.completed ? 'chip-done' : 'chip-pending']">
                    <span class="chip-dot"></span>
                    {{ task.completed ? 'Selesai' : 'Berjalan' }}
                  </span>

                  <!-- Delete -->
                  <button class="task-delete" @click.stop="deleteTask(task.id)" title="Hapus">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      <path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Empty state -->
              <div v-else class="task-empty">
                <div class="task-empty-icon">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                </div>
                <p class="task-empty-title">{{ activeFilter === 'all' ? 'Belum ada tugas' : 'Tidak ada tugas di sini' }}</p>
                <p class="task-empty-sub">{{ activeFilter === 'all' ? 'Tekan tombol Tambah Task untuk mulai' : 'Coba filter lain' }}</p>
              </div>

            </div>
          </div>
        </div>
      </main>
    </div>

    <!-- ══════════════════════════════════════════
         MODAL — Create Workspace / Add Task / Invite
    ══════════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
        <div class="modal-box">

          <!-- Header -->
          <div class="modal-head">
            <div class="modal-head-left">
              <div class="modal-head-icon" :class="`mhi-${modalType}`">
                <svg v-if="modalType === 'create-ws'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <svg v-else-if="modalType === 'add-task'" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <svg v-else width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              </div>
              <div>
                <h4 class="modal-title">{{ modalTitle }}</h4>
                <p class="modal-subtitle">{{ modalSubtitle }}</p>
              </div>
            </div>
            <button class="modal-close" @click="isModalOpen = false">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body">
            <!-- Invite modal -->
            <template v-if="modalType === 'invite'">
              <div class="mf-field">
                <label class="mf-label">Alamat Email</label>
                <div class="mf-input-wrap">
                  <svg class="mf-input-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                  <input v-model="modalInput" type="email" class="mf-input" placeholder="colleague@email.com" @keyup.enter="handleModalSubmit"/>
                </div>
              </div>
              <div class="invite-link-box">
                <span class="invite-link-label">Link Undangan</span>
                <div class="invite-link-row">
                  <span class="invite-link-text">https://taskcol.app/inv/{{ activeWorkspace?.id ?? 'x' }}/aB3kZ9</span>
                  <button class="invite-copy-btn" @click="copiedLink = true" :title="copiedLink ? 'Tersalin!' : 'Salin link'">
                    <svg v-if="!copiedLink" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                    <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </button>
                </div>
              </div>
            </template>

            <!-- Create workspace / add task -->
            <template v-else>
              <div class="mf-field">
                <label class="mf-label">
                  {{ modalType === 'create-ws' ? 'Nama Workspace' : 'Judul Task' }}
                  <span class="req">*</span>
                </label>
                <div class="mf-input-wrap">
                  <svg class="mf-input-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                    <line v-if="modalType === 'create-ws'" x1="17" y1="10" x2="3" y2="10"/><line v-if="modalType === 'create-ws'" x1="21" y1="6" x2="3" y2="6"/><line v-if="modalType === 'create-ws'" x1="21" y1="14" x2="3" y2="14"/><line v-if="modalType === 'create-ws'" x1="17" y1="18" x2="3" y2="18"/>
                    <path v-if="modalType === 'add-task'" d="M9 11l3 3L22 4"/><path v-if="modalType === 'add-task'" d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                  </svg>
                  <input
                    v-model="modalInput"
                    type="text"
                    class="mf-input"
                    :placeholder="modalType === 'create-ws' ? 'Contoh: Tim Design Q2' : 'Apa yang perlu dikerjakan?'"
                    @keyup.enter="handleModalSubmit"
                    autofocus
                  />
                </div>
                <span v-if="modalError" class="mf-error">{{ modalError }}</span>
              </div>

              <div v-if="modalType === 'add-task'" class="mf-field">
                <label class="mf-label">Prioritas</label>
                <div class="prio-btns">
                  <button v-for="p in priorities" :key="p.value" type="button"
                    :class="['prio-btn', `prio-${p.value}`, modalPriority === p.value ? 'prio-active' : '']"
                    @click="modalPriority = p.value">
                    <span class="prio-dot"></span>{{ p.label }}
                  </button>
                </div>
              </div>
            </template>
          </div>

          <!-- Footer -->
          <div class="modal-foot">
            <button class="btn-cancel" @click="isModalOpen = false">Batal</button>
            <button class="btn-submit" @click="handleModalSubmit" :disabled="modalType !== 'invite' && !modalInput.trim()">
              <svg v-if="modalType !== 'invite'" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round">
                <line v-if="modalType === 'add-task'" x1="12" y1="5" x2="12" y2="19"/><line v-if="modalType === 'add-task'" x1="5" y1="12" x2="19" y2="12"/>
                <polyline v-else points="20 6 9 17 4 12"/>
              </svg>
              {{ submitLabel }}
            </button>
          </div>

        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'

/* ── Types ─────────────────────────────────────────────── */
interface Workspace { id: number; name: string; ownerId: string; members: string[]; inviteCode?: string }
interface Task { id: number; title: string; workspaceId: number; completed: boolean; createdBy: string; createdAt: string; priority: string }

/* ── State ─────────────────────────────────────────────── */
const user = ref({ uid: 'local-user' })

const view = ref<'personal' | 'workspace-detail'>('personal')
const workspaces = ref<Workspace[]>([
  { id: 1, name: 'Website Redesign', ownerId: 'local-user', members: [] },
  { id: 2, name: 'Mobile App v2',    ownerId: 'local-user', members: [] },
])
const activeWorkspace = ref<Workspace | null>(null)
const allTasks = ref<Task[]>([
  { id: 1, title: 'Riset kompetitor',            workspaceId: 1, completed: true,  createdBy: 'local-user', createdAt: new Date(Date.now() - 86400000 * 2).toISOString(), priority: 'high' },
  { id: 2, title: 'Buat wireframe landing page', workspaceId: 1, completed: true,  createdBy: 'local-user', createdAt: new Date(Date.now() - 86400000).toISOString(),     priority: 'high' },
  { id: 3, title: 'Design sistem warna',         workspaceId: 1, completed: false, createdBy: 'local-user', createdAt: new Date().toISOString(),                           priority: 'medium' },
  { id: 4, title: 'Implementasi komponen UI',    workspaceId: 1, completed: false, createdBy: 'local-user', createdAt: new Date().toISOString(),                           priority: 'medium' },
  { id: 5, title: 'Setup project structure',     workspaceId: 2, completed: true,  createdBy: 'local-user', createdAt: new Date(Date.now() - 86400000 * 3).toISOString(), priority: 'low' },
])

const isModalOpen   = ref(false)
const modalType     = ref<'create-ws' | 'add-task' | 'invite'>('add-task')
const modalInput    = ref('')
const modalPriority = ref('medium')
const modalError    = ref('')
const copiedLink    = ref(false)
const activeFilter  = ref<'all' | 'pending' | 'done'>('all')

const filters = [
  { id: 'all',     label: 'Semua' },
  { id: 'pending', label: 'Berjalan' },
  { id: 'done',    label: 'Selesai' },
]

const priorities = [
  { value: 'low',    label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high',   label: 'High' },
]

/* ── Computed ──────────────────────────────────────────── */
const currentTasks = computed(() =>
  allTasks.value.filter(t => t.workspaceId === activeWorkspace.value?.id)
)

const filteredTasks = computed(() => {
  const base = currentTasks.value
  if (activeFilter.value === 'pending') return base.filter(t => !t.completed)
  if (activeFilter.value === 'done')    return base.filter(t =>  t.completed)
  return base
})

const doneTasks   = computed(() => currentTasks.value.filter(t =>  t.completed).length)
const pendingTasks = computed(() => currentTasks.value.filter(t => !t.completed).length)
const progressPct  = computed(() =>
  currentTasks.value.length
    ? Math.round(doneTasks.value / currentTasks.value.length * 100)
    : 0
)

const taskCountFor = (wsId: number) => allTasks.value.filter(t => t.workspaceId === wsId).length

const modalTitle = computed(() => {
  if (modalType.value === 'create-ws') return 'Buat Workspace Baru'
  if (modalType.value === 'add-task')  return 'Tambah Task'
  return 'Undang Anggota'
})

const modalSubtitle = computed(() => {
  if (modalType.value === 'create-ws') return 'Buat ruang kerja kolaboratif untuk tim kamu'
  if (modalType.value === 'add-task')  return `Tambahkan ke workspace "${activeWorkspace.value?.name}"`
  return 'Bagikan link atau kirim email undangan'
})

const submitLabel = computed(() => {
  if (modalType.value === 'create-ws') return 'Buat Workspace'
  if (modalType.value === 'add-task')  return 'Tambah Task'
  return 'Kirim Undangan'
})

/* ── Methods ───────────────────────────────────────────── */
const setPersonal = () => {
  view.value = 'personal'
  activeWorkspace.value = null
  activeFilter.value = 'all'
}

const openWorkspace = (ws: Workspace) => {
  view.value = 'workspace-detail'
  activeWorkspace.value = ws
  activeFilter.value = 'all'
}

const openModal = (type: typeof modalType.value) => {
  modalType.value  = type
  modalInput.value = ''
  modalError.value = ''
  modalPriority.value = 'medium'
  copiedLink.value = false
  isModalOpen.value = true
}

const handleModalSubmit = () => {
  if (modalType.value === 'invite') { isModalOpen.value = false; return }

  if (!modalInput.value.trim()) { modalError.value = 'Kolom ini wajib diisi.'; return }

  if (modalType.value === 'create-ws') {
    workspaces.value.push({
      id: Date.now(),
      name: modalInput.value.trim(),
      ownerId: user.value.uid,
      members: [],
      inviteCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
    })
  } else {
    allTasks.value.push({
      id: Date.now(),
      title: modalInput.value.trim(),
      workspaceId: activeWorkspace.value!.id,
      completed: false,
      createdBy: user.value.uid,
      createdAt: new Date().toISOString(),
      priority: modalPriority.value,
    })
  }
  isModalOpen.value = false
}

const toggleTask = (task: Task) => { task.completed = !task.completed }

const deleteTask  = (id: number) => {
  allTasks.value = allTasks.value.filter(t => t.id !== id)
}

const formatDate = (iso: string) => {
  const d = new Date(iso)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

/* ─── Reset ─────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
button { cursor: pointer; font-family: inherit; }
input  { font-family: inherit; }
a      { text-decoration: none; }

/* ─── Root ──────────────────────────────────────────── */
.app-root {
  font-family: 'Figtree', sans-serif;
  background: #060810;
  color: #e2e8f0;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* ─── Ambient ───────────────────────────────────────── */
.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.orb     { position: absolute; border-radius: 50%; filter: blur(90px); }
.orb-1   { width: 560px; height: 560px; background: radial-gradient(circle, rgba(6,182,212,0.07) 0%, transparent 70%); top: -160px; right: -120px; }
.orb-2   { width: 420px; height: 420px; background: radial-gradient(circle, rgba(59,130,246,0.055) 0%, transparent 70%); bottom: -140px; left: -100px; }
.orb-3   { width: 280px; height: 280px; background: radial-gradient(circle, rgba(16,185,129,0.035) 0%, transparent 70%); top: 50%; left: 45%; }
.noise   {
  position: absolute; inset: 0; opacity: 0.016;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

/* ─── Layout ────────────────────────────────────────── */
.layout { display: flex; height: 100vh; position: relative; z-index: 1; }

/* ══════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════ */
.sidebar {
  width: 220px; flex-shrink: 0;
  background: rgba(6, 9, 20, 0.93);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex; flex-direction: column; overflow: hidden;
}

.sidebar-logo {
  display: flex; align-items: center; gap: 10px;
  padding: 22px 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.logo-icon {
  width: 32px; height: 32px; border-radius: 9px;
  background: linear-gradient(135deg, #0891b2, #2563eb);
  display: flex; align-items: center; justify-content: center; color: #fff;
  box-shadow: 0 4px 12px rgba(8,145,178,0.32); flex-shrink: 0;
}
.logo-text {
  font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800;
  background: linear-gradient(135deg, #22d3ee, #60a5fa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  letter-spacing: -0.02em;
}

.sidebar-nav { flex: 1; padding: 14px 10px; display: flex; flex-direction: column; gap: 2px; overflow-y: auto; }
.sidebar-nav::-webkit-scrollbar { width: 0; }

.nav-item {
  display: flex; align-items: center; gap: 9px; width: 100%;
  padding: 9px 10px; border-radius: 9px;
  font-size: 0.8rem; font-weight: 500; color: #475569;
  background: none; border: none;
  transition: all 0.18s ease; text-align: left; position: relative;
}
.nav-item:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
.nav-active { background: rgba(6,182,212,0.08) !important; color: #22d3ee !important; border: 1px solid rgba(6,182,212,0.15); }
.nav-pip { position: absolute; right: 10px; width: 5px; height: 5px; border-radius: 50%; background: #22d3ee; box-shadow: 0 0 6px #22d3ee; }
.nav-ws-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

.nav-section-label {
  font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.12em; color: #2d3748;
  padding: 12px 10px 4px;
}

.nav-create {
  border: 1px dashed rgba(255,255,255,0.09) !important;
  color: #334155 !important; font-style: italic;
  margin-top: 4px;
}
.nav-create:hover { border-color: rgba(34,211,238,0.25) !important; color: #22d3ee !important; background: rgba(34,211,238,0.05) !important; }

.sidebar-footer { padding: 12px 10px; border-top: 1px solid rgba(255,255,255,0.04); }
.sidebar-user {
  display: flex; align-items: center; gap: 9px; padding: 8px 10px;
  border-radius: 9px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04);
  position: relative;
}
.user-avatar-sm {
  width: 28px; height: 28px; border-radius: 7px;
  background: linear-gradient(135deg, #0891b2, #2563eb);
  color: #fff; font-size: 0.65rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-meta { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.user-name-sm { font-size: 0.75rem; font-weight: 600; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-role { font-family: 'JetBrains Mono', monospace; font-size: 0.54rem; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
.user-online-dot { position: absolute; top: 8px; right: 8px; width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 5px #34d399; }

/* ══════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════ */
.main { flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden; }

/* Topbar */
.topbar {
  height: 62px; flex-shrink: 0;
  background: rgba(5, 8, 18, 0.88); backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 28px;
}
.topbar-left { display: flex; align-items: center; gap: 10px; }
.btn-back-inline {
  width: 30px; height: 30px; border-radius: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: #64748b;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s;
}
.btn-back-inline:hover { color: #22d3ee; border-color: rgba(34,211,238,0.25); }
.topbar-breadcrumb { display: flex; align-items: center; gap: 6px; color: #475569; }
.bc-parent { font-size: 0.78rem; color: #475569; cursor: pointer; transition: color 0.18s; }
.bc-parent:hover { color: #22d3ee; }
.bc-current { font-size: 0.82rem; font-weight: 600; color: #e2e8f0; }

.topbar-right { display: flex; align-items: center; gap: 12px; }
.topbar-members { display: flex; align-items: center; }
.member-ava {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--bg, #0891b2); color: #fff;
  font-size: 0.6rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #060810; transition: transform 0.18s;
}
.member-ava:hover { transform: translateY(-2px); }
.btn-invite-sm {
  display: flex; align-items: center; gap: 6px;
  padding: 6px 14px; border-radius: 9px;
  background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.18); color: #22d3ee;
  font-size: 0.75rem; font-weight: 600; transition: all 0.18s;
}
.btn-invite-sm:hover { background: rgba(34,211,238,0.15); border-color: rgba(34,211,238,0.3); }

/* Content */
.content-scroll { flex: 1; overflow-y: auto; }
.content-scroll::-webkit-scrollbar { width: 5px; }
.content-scroll::-webkit-scrollbar-track { background: transparent; }
.content-scroll::-webkit-scrollbar-thumb { background: rgba(34,211,238,0.15); border-radius: 999px; }

.content-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 48px 40px 80px;
  display: flex;
  flex-direction: column;
  gap: 48px;
}

@media (max-width: 900px) {
  .content-inner {
    padding: 32px 12px 60px;
    gap: 32px;
  }
}

@media (max-width: 600px) {
  .content-inner {
    padding: 18px 2vw 32px;
    gap: 18px;
  }
}

/* ══════════════════════════════════════════════════════
   PERSONAL VIEW
══════════════════════════════════════════════════════ */
.personal-view { display: flex; flex-direction: column; gap: 40px; animation: fadeUp 0.4s ease both; }

@keyframes fadeUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }

.personal-hero {
  border-radius: 24px;
  padding: 60px 48px;
  background: rgba(8, 12, 24, 0.7);
  border: 1px solid rgba(255,255,255,0.07);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05);
}

@media (max-width: 900px) {
  .personal-hero {
    padding: 36px 16px;
    gap: 16px;
  }
}

@media (max-width: 600px) {
  .personal-hero {
    padding: 18px 4vw;
    gap: 10px;
  }
}
.personal-hero-bg {
  position: absolute; inset: 0;
  background: radial-gradient(ellipse 60% 50% at 50% 0%, rgba(6,182,212,0.07) 0%, transparent 70%);
  pointer-events: none;
}
.personal-hero-icon {
  width: 72px; height: 72px; border-radius: 20px;
  background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.18);
  display: flex; align-items: center; justify-content: center; color: #22d3ee;
  box-shadow: 0 0 30px rgba(6,182,212,0.12);
}
.personal-title {
  font-family: 'Syne', sans-serif; font-size: 1.6rem; font-weight: 800;
  color: #f1f5f9; letter-spacing: -0.03em; line-height: 1.1;
}
.title-accent {
  background: linear-gradient(135deg, #22d3ee, #60a5fa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.personal-desc { font-size: 0.85rem; color: #64748b; max-width: 380px; line-height: 1.55; }
.btn-create-ws {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 11px 24px; border-radius: 12px;
  background: linear-gradient(135deg, #0891b2, #2563eb); border: none; color: #fff;
  font-size: 0.84rem; font-weight: 700;
  box-shadow: 0 4px 18px rgba(8,145,178,0.38), inset 0 1px 0 rgba(255,255,255,0.12);
  transition: all 0.2s; margin-top: 4px;
}
.btn-create-ws:hover { transform: translateY(-2px); box-shadow: 0 8px 26px rgba(8,145,178,0.52); }

.ws-grid-section { display: flex; flex-direction: column; gap: 14px; }
.section-label {
  display: flex; align-items: center; gap: 7px;
  font-family: 'JetBrains Mono', monospace; font-size: 0.62rem;
  text-transform: uppercase; letter-spacing: 0.12em; color: #475569;
}
.section-dot { width: 5px; height: 5px; border-radius: 50%; background: #22d3ee; box-shadow: 0 0 5px #22d3ee; }

.ws-grid { display: flex; flex-direction: column; gap: 6px; }
.ws-card {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; border-radius: 14px;
  background: rgba(8, 12, 24, 0.7); border: 1px solid rgba(255,255,255,0.055);
  cursor: pointer; transition: all 0.2s ease;
  animation: fadeUp 0.35s ease both; animation-delay: var(--delay, 0s);
}
.ws-card:hover {
  background: rgba(6,182,212,0.05); border-color: rgba(34,211,238,0.2);
  transform: translateX(4px);
  box-shadow: -2px 0 0 rgba(34,211,238,0.4), 0 4px 18px rgba(0,0,0,0.3);
}
.ws-card-icon {
  width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
  background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.15);
  display: flex; align-items: center; justify-content: center; color: #22d3ee;
}
.ws-card-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 2px; }
.ws-card-name { font-size: 0.88rem; font-weight: 600; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ws-card-meta { font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; color: #475569; }
.ws-card-arrow { color: #334155; transition: color 0.18s, transform 0.18s; }
.ws-card:hover .ws-card-arrow { color: #22d3ee; transform: translateX(3px); }

/* ══════════════════════════════════════════════════════
   WORKSPACE DETAIL
══════════════════════════════════════════════════════ */
.workspace-view { display: flex; flex-direction: column; gap: 22px; animation: fadeUp 0.4s ease both; }

/* Page header */
.page-header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }
.page-header-left { display: flex; flex-direction: column; gap: 5px; }
.page-eyebrow {
  display: flex; align-items: center; gap: 6px;
  font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; font-weight: 500;
  letter-spacing: 0.13em; text-transform: uppercase; color: #22d3ee;
}
.eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: #22d3ee; box-shadow: 0 0 6px #22d3ee; animation: blink 2.5s infinite; }
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
.page-title { font-family: 'Syne', sans-serif; font-size: 1.65rem; font-weight: 800; letter-spacing: -0.025em; line-height: 1.1; }
.page-desc { font-size: 0.8rem; color: #64748b; }

.btn-add-task {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 20px; border-radius: 12px; flex-shrink: 0;
  background: linear-gradient(135deg, #0891b2, #2563eb); border: none; color: #fff;
  font-size: 0.82rem; font-weight: 700;
  box-shadow: 0 4px 16px rgba(8,145,178,0.38), inset 0 1px 0 rgba(255,255,255,0.1);
  transition: all 0.2s; position: relative; overflow: hidden;
}
.btn-add-task::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, rgba(255,255,255,0.12), transparent); opacity: 0; transition: opacity 0.2s; }
.btn-add-task:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(8,145,178,0.52); }
.btn-add-task:hover::before { opacity: 1; }
.btn-add-icon { width: 18px; height: 18px; border-radius: 5px; background: rgba(255,255,255,0.18); display: flex; align-items: center; justify-content: center; }

/* Stats */
.stats-row {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 20px; border-radius: 14px;
  background: rgba(8, 12, 24, 0.7); border: 1px solid rgba(255,255,255,0.055);
}
.stat-pill { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-pill-val { font-family: 'Syne', sans-serif; font-size: 1.25rem; font-weight: 800; line-height: 1; }
.stat-pill-label { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: #334155; text-transform: uppercase; letter-spacing: 0.1em; }
.stat-sep { width: 1px; height: 28px; background: rgba(255,255,255,0.05); }
.stat-progress-wrap { flex: 1; display: flex; align-items: center; gap: 10px; margin-left: 8px; }
.stat-progress-track { flex: 1; height: 4px; background: rgba(255,255,255,0.05); border-radius: 999px; overflow: hidden; }
.stat-progress-fill { height: 100%; background: linear-gradient(90deg, #0891b2, #22d3ee); border-radius: 999px; transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1); box-shadow: 0 0 8px rgba(34,211,238,0.5); }
.stat-progress-pct { font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #475569; min-width: 34px; text-align: right; }

/* Filter tabs */
.filter-tabs { display: flex; gap: 3px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.055); border-radius: 10px; padding: 3px; width: fit-content; }
.filter-tab {
  padding: 6px 16px; border-radius: 7px; border: none; background: none;
  font-size: 0.76rem; font-weight: 600; color: #475569;
  transition: all 0.18s;
}
.filter-tab:hover { color: #94a3b8; }
.filter-active { background: rgba(34,211,238,0.1); color: #22d3ee !important; }

/* Task list */
.task-list { display: flex; flex-direction: column; gap: 6px; }
.task-row {
  display: flex; align-items: center; gap: 13px;
  padding: 13px 16px; border-radius: 13px;
  background: rgba(8, 12, 24, 0.72); border: 1px solid rgba(255,255,255,0.055);
  cursor: pointer; transition: all 0.2s ease;
  animation: rowIn 0.28s ease both; animation-delay: var(--delay, 0s);
}
@keyframes rowIn { from { opacity: 0; transform: translateX(-6px); } to { opacity: 1; transform: translateX(0); } }

.task-row:hover {
  background: rgba(6,182,212,0.05); border-color: rgba(34,211,238,0.18);
  transform: translateX(3px);
  box-shadow: -2px 0 0 rgba(34,211,238,0.35), 0 4px 16px rgba(0,0,0,0.3);
}
.task-row-done {
  background: rgba(52,211,153,0.03) !important;
  border-color: rgba(52,211,153,0.1) !important;
}
.task-row-done:hover { border-color: rgba(52,211,153,0.22) !important; box-shadow: -2px 0 0 rgba(52,211,153,0.35), 0 4px 16px rgba(0,0,0,0.3) !important; }

.task-check {
  width: 22px; height: 22px; border-radius: 7px; flex-shrink: 0;
  border: 1.5px solid rgba(255,255,255,0.12); background: transparent;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.2s ease; color: #fff;
}
.task-check:hover { border-color: #22d3ee; }
.task-check-done { background: linear-gradient(135deg, #059669, #34d399); border-color: transparent; box-shadow: 0 2px 8px rgba(52,211,153,0.35); }

.task-content { flex: 1; min-width: 0; display: flex; align-items: center; gap: 12px; }
.task-title { font-size: 0.86rem; font-weight: 500; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; flex: 1; min-width: 0; }
.task-title-done { color: #334155; text-decoration: line-through; text-decoration-color: #3d4060; }
.task-meta { display: flex; align-items: center; gap: 4px; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: #334155; white-space: nowrap; flex-shrink: 0; }

.task-chip {
  display: flex; align-items: center; gap: 5px; flex-shrink: 0;
  font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 500;
  letter-spacing: 0.06em; padding: 3px 9px; border-radius: 6px;
}
.chip-dot { width: 5px; height: 5px; border-radius: 50%; }
.chip-pending { background: rgba(34,211,238,0.08); color: #22d3ee; border: 1px solid rgba(34,211,238,0.2); }
.chip-pending .chip-dot { background: #22d3ee; box-shadow: 0 0 4px #22d3ee; animation: blink 2s infinite; }
.chip-done { background: rgba(52,211,153,0.08); color: #34d399; border: 1px solid rgba(52,211,153,0.18); }
.chip-done .chip-dot { background: #34d399; }

.task-delete {
  width: 28px; height: 28px; border-radius: 8px; border: none; flex-shrink: 0;
  background: transparent; color: #334155;
  display: flex; align-items: center; justify-content: center;
  opacity: 0; transition: all 0.18s;
}
.task-row:hover .task-delete { opacity: 1; }
.task-delete:hover { background: rgba(248,113,133,0.12); color: #f87171; border: 1px solid rgba(248,113,133,0.25); }

/* Task empty */
.task-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 10px; padding: 60px 20px;
  border-radius: 16px; border: 1px dashed rgba(255,255,255,0.06);
}
.task-empty-icon { color: #1e293b; animation: floatAnim 3s ease-in-out infinite; }
@keyframes floatAnim { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
.task-empty-title { font-size: 0.88rem; font-weight: 600; color: #475569; }
.task-empty-sub   { font-size: 0.76rem; color: #2d3748; }

/* ══════════════════════════════════════════════════════
   MODAL
══════════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(3, 5, 14, 0.78); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center; z-index: 100; padding: 20px;
}
.modal-box {
  background: linear-gradient(160deg, #0d1628, #070c1a);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 22px;
  width: 100%;
  max-width: 460px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05);
  overflow: hidden;
  margin: 0 12px;
}

@media (max-width: 600px) {
  .modal-box {
    max-width: 98vw;
    padding: 0;
  }
}

.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.055);
  background: rgba(255,255,255,0.02);
}
.modal-head-left { display: flex; align-items: center; gap: 13px; }
.modal-head-icon {
  width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.mhi-create-ws { background: rgba(6,182,212,0.1);  border: 1px solid rgba(6,182,212,0.2);  color: #22d3ee; }
.mhi-add-task  { background: rgba(52,211,153,0.08); border: 1px solid rgba(52,211,153,0.2); color: #34d399; }
.mhi-invite    { background: rgba(167,139,250,0.1); border: 1px solid rgba(167,139,250,0.2);color: #a78bfa; }
.modal-title    { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; color: #f1f5f9; letter-spacing: -0.02em; }
.modal-subtitle { font-size: 0.74rem; color: #475569; margin-top: 2px; }
.modal-close {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: #475569;
  display: flex; align-items: center; justify-content: center; transition: all 0.18s; flex-shrink: 0;
}
.modal-close:hover { color: #f87171; border-color: rgba(248,113,133,0.25); background: rgba(248,113,133,0.07); }

.modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }

.mf-field { display: flex; flex-direction: column; gap: 7px; }
.mf-label { font-size: 0.78rem; font-weight: 600; color: #94a3b8; display: flex; align-items: center; gap: 5px; }
.req { color: #f87171; }
.mf-input-wrap { position: relative; }
.mf-input-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); color: #475569; pointer-events: none; }
.mf-input {
  width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 11px; padding: 11px 14px 11px 36px;
  font-size: 0.84rem; color: #e2e8f0; outline: none; transition: all 0.18s;
}
.mf-input:focus { border-color: rgba(34,211,238,0.38); background: rgba(6,182,212,0.04); box-shadow: 0 0 0 3px rgba(34,211,238,0.08); }
.mf-input::placeholder { color: #2d3748; }
.mf-error { font-size: 0.74rem; color: #f87171; }

.prio-btns { display: flex; gap: 7px; }
.prio-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 6px;
  padding: 9px 8px; border-radius: 9px;
  font-size: 0.76rem; font-weight: 600; text-transform: capitalize;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #64748b;
  transition: all 0.18s;
}
.prio-low.prio-active    { background: rgba(52,211,153,0.09);  border-color: rgba(52,211,153,0.28);  color: #34d399; }
.prio-medium.prio-active { background: rgba(251,191,36,0.07);  border-color: rgba(251,191,36,0.26);  color: #fbbf24; }
.prio-high.prio-active   { background: rgba(248,113,133,0.08); border-color: rgba(248,113,133,0.26); color: #f87171; }
.prio-dot { width: 6px; height: 6px; border-radius: 50%; }
.prio-low    .prio-dot { background: #34d399; }
.prio-medium .prio-dot { background: #fbbf24; }
.prio-high   .prio-dot { background: #f87171; }

.invite-link-box {
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06); border-radius: 10px; padding: 13px;
  display: flex; flex-direction: column; gap: 8px;
}
.invite-link-label { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
.invite-link-row { display: flex; align-items: center; gap: 8px; }
.invite-link-text { flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 0.66rem; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.invite-copy-btn {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #64748b;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.18s;
}
.invite-copy-btn:hover { color: #22d3ee; border-color: rgba(34,211,238,0.25); }

.modal-foot {
  display: flex; align-items: center; justify-content: flex-end; gap: 8px;
  padding: 16px 24px; border-top: 1px solid rgba(255,255,255,0.045);
}
.btn-cancel {
  padding: 9px 18px; border-radius: 9px;
  background: transparent; border: 1px solid rgba(255,255,255,0.07); color: #475569;
  font-size: 0.8rem; font-weight: 600; transition: all 0.18s;
}
.btn-cancel:hover { color: #94a3b8; border-color: rgba(255,255,255,0.12); }
.btn-submit {
  display: flex; align-items: center; gap: 7px;
  padding: 9px 22px; border-radius: 10px;
  background: linear-gradient(135deg, #0891b2, #2563eb); border: none; color: #fff;
  font-size: 0.82rem; font-weight: 700;
  box-shadow: 0 4px 16px rgba(8,145,178,0.35); transition: all 0.2s;
}
.btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 7px 22px rgba(8,145,178,0.5); }
.btn-submit:disabled { opacity: 0.38; cursor: not-allowed; }

/* Modal Transition */
.modal-enter-active { animation: mIn  0.25s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { animation: mOut 0.18s ease forwards; }
@keyframes mIn  { from { opacity: 0; transform: scale(0.9);  } to { opacity: 1; transform: scale(1);    } }
@keyframes mOut { from { opacity: 1; transform: scale(1);    } to { opacity: 0; transform: scale(0.93); } }
</style>