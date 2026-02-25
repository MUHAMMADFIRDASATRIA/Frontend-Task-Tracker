<script setup>
import { ref, computed } from 'vue'

// ─── State ───────────────────────────────────────────────
const view = ref('personal')
const activeWorkspace = ref(null)

const workspaces = ref([
  { id: 1, name: 'Project X: Redesign' },
  { id: 2, name: 'Brand Identity v2' },
  { id: 3, name: 'Q1 Marketing Campaign' },
])

const allTasks = ref([
  { id: 1, title: 'Competitor Analysis',  workspaceId: 1, completed: true,  createdAt: new Date(Date.now() - 86400000).toISOString(), priority: 'high'   },
  { id: 2, title: 'Visual Explorations',  workspaceId: 1, completed: false, createdAt: new Date().toISOString(),                     priority: 'medium' },
  { id: 3, title: 'Logo Refinement',      workspaceId: 2, completed: true,  createdAt: new Date().toISOString(),                     priority: 'high'   },
  { id: 4, title: 'Budget Approval',      workspaceId: 3, completed: false, createdAt: new Date().toISOString(),                     priority: 'high'   },
])

// ─── Modal ───────────────────────────────────────────────
const isModalOpen   = ref(false)
const modalType     = ref('add-task') // 'create-ws' | 'add-task'
const modalInput    = ref('')
const modalPriority = ref('medium')

const openModal = (type) => {
  modalType.value     = type
  modalInput.value    = ''
  modalPriority.value = 'medium'
  isModalOpen.value   = true
}

const handleModalSubmit = () => {
  if (!modalInput.value.trim()) return
  if (modalType.value === 'create-ws') {
    workspaces.value.push({ id: Date.now(), name: modalInput.value.trim() })
  } else {
    allTasks.value.push({
      id: Date.now(),
      title: modalInput.value.trim(),
      workspaceId: activeWorkspace.value.id,
      completed: false,
      createdAt: new Date().toISOString(),
      priority: modalPriority.value,
    })
  }
  isModalOpen.value = false
}

// ─── Filters ─────────────────────────────────────────────
const filters = [
  { id: 'all',     label: 'Semua'   },
  { id: 'pending', label: 'Proses'  },
  { id: 'done',    label: 'Selesai' },
]
const activeFilter = ref('all')

// ─── Navigation ──────────────────────────────────────────
const setPersonal = () => {
  view.value            = 'personal'
  activeWorkspace.value = null
}

const openWorkspace = (ws) => {
  view.value            = 'workspace-detail'
  activeWorkspace.value = ws
  activeFilter.value    = 'all'
}

// ─── Computed ────────────────────────────────────────────
const currentTasks = computed(() =>
  allTasks.value.filter(t => t.workspaceId === activeWorkspace.value?.id)
)

const filteredTasks = computed(() => {
  if (activeFilter.value === 'pending') return currentTasks.value.filter(t => !t.completed)
  if (activeFilter.value === 'done')    return currentTasks.value.filter(t =>  t.completed)
  return currentTasks.value
})

const totalDoneTasks = computed(() => allTasks.value.filter(t => t.completed).length)

const avgProgress = computed(() =>
  allTasks.value.length
    ? Math.round((totalDoneTasks.value / allTasks.value.length) * 100)
    : 0
)

const progressPct = computed(() =>
  currentTasks.value.length
    ? Math.round((currentTasks.value.filter(t => t.completed).length / currentTasks.value.length) * 100)
    : 0
)

const taskCountFor  = (wsId) => allTasks.value.filter(t => t.workspaceId === wsId).length

const getWsProgress = (wsId) => {
  const wsTasks = allTasks.value.filter(t => t.workspaceId === wsId)
  return wsTasks.length
    ? Math.round((wsTasks.filter(t => t.completed).length / wsTasks.length) * 100)
    : 0
}

// ─── Task Actions ─────────────────────────────────────────
const toggleTask = (task) => { task.completed = !task.completed }
const deleteTask = (id)   => { allTasks.value = allTasks.value.filter(t => t.id !== id) }

// ─── Helpers ─────────────────────────────────────────────
const formatDate  = (iso) => new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })
const currentDate = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })

// SVG ring
const CIRCUMFERENCE = 125
const dashOffset    = computed(() => CIRCUMFERENCE - (CIRCUMFERENCE * progressPct.value / 100))
</script>

<template>
  <!-- ─── Ambient Background ──────────────────────────── -->
  <div class="ambient" aria-hidden="true">
    <div class="orb orb-1"></div>
    <div class="orb orb-2"></div>
    <div class="noise"></div>
  </div>

  <!-- ─── Layout ──────────────────────────────────────── -->
  <div class="layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
          </svg>
        </div>
        <span class="logo-text">TaskCollab</span>
      </div>

      <nav class="sidebar-nav">
        <p class="nav-label">Main Navigation</p>

        <button
          @click="setPersonal"
          :class="['nav-btn', view === 'personal' && 'nav-btn--active']"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
          Dashboard
        </button>

        <p class="nav-label" style="margin-top: 40px">Workspaces</p>

        <button
          v-for="ws in workspaces" :key="ws.id"
          @click="openWorkspace(ws)"
          :class="['nav-ws-btn', activeWorkspace?.id === ws.id && 'nav-ws-btn--active']"
        >
          <span
            class="ws-dot"
            :class="activeWorkspace?.id === ws.id ? 'ws-dot--active' : ''"
          ></span>
          <span class="truncate">{{ ws.name }}</span>
        </button>

        <button @click="openModal('create-ws')" class="nav-add-btn">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Add Workspace
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="user-card">
          <div class="user-avatar">K</div>
          <div class="user-info">
            <p class="user-name">kamu</p>
            <p class="user-role">Pro Access</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- MAIN -->
    <main class="main">

      <!-- HEADER -->
      <header class="header">
        <div class="header-left">
          <span class="breadcrumb-section">{{ view === 'personal' ? 'Overview' : 'Projects' }}</span>
          <span class="breadcrumb-divider">/</span>
          <h2 class="breadcrumb-page">{{ view === 'personal' ? 'Home' : activeWorkspace?.name }}</h2>
        </div>
        <div class="header-right">
          <span class="date-badge">{{ currentDate }}</span>
          <div class="avatar-placeholder"></div>
        </div>
      </header>

      <!-- CONTENT -->
      <div class="content-scroll">
        <div class="content-inner">
          <Transition name="fade" mode="out-in">

            <!-- ── DASHBOARD VIEW ── -->
            <div v-if="view === 'personal'" key="personal">

              <div class="welcome-header">
                <div>
                  <h1 class="welcome-title">
                    Selamat Datang,
                    <span class="welcome-name">Kamu</span>.
                  </h1>
                  <p class="welcome-sub">Berikut ringkasan progres kerja Anda hari ini. Semua sistem berjalan optimal.</p>
                </div>
                <button @click="openModal('create-ws')" class="btn-white">New Workspace</button>
              </div>

              <!-- Summary Cards -->
              <div class="summary-row">
                <div class="summary-card">
                  <div class="summary-icon bg-cyan-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
                      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
                    </svg>
                  </div>
                  <span class="summary-label">Workspaces</span>
                  <p class="summary-value">{{ workspaces.length }} <span class="summary-unit">Project</span></p>
                </div>

                <div class="summary-card">
                  <div class="summary-icon bg-emerald-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <span class="summary-label">Task Selesai</span>
                  <p class="summary-value">{{ totalDoneTasks }} <span class="summary-unit">Item</span></p>
                </div>

                <div class="summary-card">
                  <div class="summary-icon bg-amber-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                    </svg>
                  </div>
                  <span class="summary-label">Rata-rata Progres</span>
                  <p class="summary-value">{{ avgProgress }}% <span class="summary-unit">Total</span></p>
                </div>
              </div>

              <!-- Workspace Grid -->
              <section>
                <div class="section-header">
                  <div class="section-title">
                    <div class="section-dot"></div>
                    <h3>Project Berlangsung</h3>
                  </div>
                </div>

                <div class="ws-grid">
                  <div
                    v-for="ws in workspaces" :key="ws.id"
                    class="ws-card"
                    @click="openWorkspace(ws)"
                  >
                    <div class="ws-icon-wrap">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h4 class="ws-card-name">{{ ws.name }}</h4>
                      <div class="ws-card-meta">
                        <span class="ws-task-count">{{ taskCountFor(ws.id) }} Tasks</span>
                        <div class="progress-bar-track">
                          <div class="progress-bar-fill" :style="{ width: getWsProgress(ws.id) + '%' }"></div>
                        </div>
                      </div>
                    </div>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" class="chevron">
                      <polyline points="9 18 15 12 9 6"/>
                    </svg>
                  </div>
                </div>
              </section>
            </div>

            <!-- ── WORKSPACE DETAIL VIEW ── -->
            <div v-else key="workspace">

              <div class="detail-header">
                <div>
                  <span class="ws-badge">Active Workspace</span>
                  <h1 class="ws-detail-title">{{ activeWorkspace?.name }}</h1>
                </div>
                <button @click="openModal('add-task')" class="btn-cyan">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
                  </svg>
                  Tambah Task
                </button>
              </div>

              <div class="task-container">
                <!-- Filter bar + Progress ring -->
                <div class="task-toolbar">
                  <div class="filter-bar">
                    <button
                      v-for="f in filters" :key="f.id"
                      @click="activeFilter = f.id"
                      :class="['filter-btn', activeFilter === f.id && 'filter-btn--active']"
                    >
                      {{ f.label }}
                    </button>
                  </div>

                  <div class="progress-info">
                    <div class="progress-text">
                      <p class="progress-label">Progress</p>
                      <p class="progress-pct">{{ progressPct }}%</p>
                    </div>
                    <div class="ring-wrap">
                      <svg class="ring-svg">
                        <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="4" class="ring-bg"/>
                        <circle
                          cx="24" cy="24" r="20" fill="none" stroke="currentColor" stroke-width="4"
                          class="ring-fg"
                          :stroke-dasharray="CIRCUMFERENCE"
                          :stroke-dashoffset="dashOffset"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                <!-- Task list -->
                <div v-if="filteredTasks.length" class="task-list">
                  <div
                    v-for="task in filteredTasks" :key="task.id"
                    :class="['task-row', task.completed && 'task-row--done']"
                    @click="toggleTask(task)"
                  >
                    <div :class="['checkbox', task.completed && 'checkbox--checked']">
                      <svg v-if="task.completed" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div class="flex-1">
                      <h4 :class="['task-title', task.completed ? 'task-title--done' : 'task-title--active']">
                        {{ task.title }}
                      </h4>
                      <div class="task-meta">
                        <span class="task-date">{{ formatDate(task.createdAt) }}</span>
                        <span :class="['prio-pill', `prio-${task.priority}`]">{{ task.priority }}</span>
                      </div>
                    </div>
                    <button @click.stop="deleteTask(task.id)" class="delete-btn">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                        <polyline points="3 6 5 6 21 6"/>
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                      </svg>
                    </button>
                  </div>
                </div>

                <div v-else class="empty-state">
                  <p>List Kosong</p>
                </div>
              </div>
            </div>

          </Transition>
        </div>
      </div>
    </main>
  </div>

  <!-- ─── MODAL ──────────────────────────────────────────── -->
  <Transition name="fade">
    <div v-if="isModalOpen" class="modal-overlay" @click.self="isModalOpen = false">
      <div class="modal-box">
        <h4 class="modal-title">{{ modalType === 'create-ws' ? 'New Space' : 'Add Task' }}</h4>
        <p class="modal-sub">Silakan isi detail di bawah ini untuk melanjutkan.</p>

        <div class="modal-fields">
          <div class="field">
            <label class="field-label">Entry Name</label>
            <input
              v-model="modalInput"
              type="text"
              class="field-input"
              placeholder="..."
              autofocus
              @keyup.enter="handleModalSubmit"
            />
          </div>

          <div v-if="modalType === 'add-task'" class="field">
            <label class="field-label">Priority</label>
            <div class="prio-grid">
              <button
                v-for="p in ['low', 'medium', 'high']" :key="p"
                @click="modalPriority = p"
                :class="['prio-btn', modalPriority === p && 'prio-btn--active']"
              >{{ p }}</button>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <button @click="isModalOpen = false" class="btn-cancel">Cancel</button>
          <button @click="handleModalSubmit" :disabled="!modalInput.trim()" class="btn-confirm">Confirm</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* ─── CSS Variables ─── */
*, *::before, *::after { box-sizing: border-box; }

.layout {
  --bg-deep:   #060810;
  --accent:    #22d3ee;
  --card-bg:   rgba(13, 18, 36, 0.6);
  --border:    rgba(255, 255, 255, 0.06);

  display: flex;
  height: 100vh;
  position: relative;
  z-index: 1;
  font-family: 'Figtree', sans-serif;
  color: #e2e8f0;
  background-color: var(--bg-deep);
  overflow: hidden;
}

/* ─── Ambient ─── */
.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.orb     { position: absolute; border-radius: 50%; filter: blur(100px); }
.orb-1   { width: 600px; height: 600px; background: radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%); top: -200px; right: -150px; }
.orb-2   { width: 500px; height: 500px; background: radial-gradient(circle, rgba(59,130,246,0.06) 0%, transparent 70%); bottom: -150px; left: -100px; }
.noise   { position: absolute; inset: 0; opacity: 0.015; }

/* ─── Sidebar ─── */
.sidebar {
  width: 240px; flex-shrink: 0;
  background: rgba(6, 9, 20, 0.98);
  backdrop-filter: blur(20px);
  border-right: 1px solid var(--border);
  display: flex; flex-direction: column;
}

.sidebar-logo {
  padding: 28px; border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; gap: 12px;
}

.logo-icon {
  width: 32px; height: 32px; border-radius: 8px;
  background: #06b6d4; display: flex; align-items: center; justify-content: center;
  color: white; box-shadow: 0 4px 16px rgba(6,182,212,0.3);
}

.logo-text {
  font-family: 'Syne', sans-serif; font-weight: 800;
  font-size: 1.125rem; color: white; letter-spacing: -0.03em;
}

.sidebar-nav  { flex: 1; padding: 32px 16px; overflow-y: auto; }
.nav-label    { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; color: #475569; padding: 0 12px; margin-bottom: 16px; display: block; }

.nav-btn {
  width: 100%; display: flex; align-items: center; gap: 12px;
  padding: 12px; border-radius: 12px; font-size: 14px; font-weight: 500;
  border: none; cursor: pointer; transition: all 0.3s; background: transparent;
  color: #64748b; margin-bottom: 4px;
}
.nav-btn:hover        { background: rgba(255,255,255,0.05); color: #cbd5e1; }
.nav-btn--active      { background: rgba(34,211,238,0.1); color: #22d3ee; border: 1px solid rgba(34,211,238,0.2); }

.nav-ws-btn {
  width: 100%; display: flex; align-items: center; gap: 12px;
  padding: 10px 12px; border-radius: 12px; font-size: 14px; font-weight: 500;
  border: none; cursor: pointer; transition: all 0.2s; background: transparent;
  color: #64748b; margin-bottom: 4px;
}
.nav-ws-btn:hover     { background: rgba(255,255,255,0.05); color: #94a3b8; }
.nav-ws-btn--active   { background: rgba(34,211,238,0.1); color: #22d3ee; border: 1px solid rgba(34,211,238,0.2); }

.ws-dot        { width: 6px; height: 6px; border-radius: 50%; background: #334155; flex-shrink: 0; transition: all 0.2s; }
.ws-dot--active { background: #22d3ee; transform: scale(1.25); }

.nav-add-btn {
  width: 100%; display: flex; align-items: center; gap: 12px;
  padding: 12px; border-radius: 12px; font-size: 12px; font-weight: 700;
  color: #64748b; border: 1px dashed rgba(255,255,255,0.1);
  background: rgba(255,255,255,0.02); cursor: pointer; margin-top: 24px;
  transition: all 0.2s;
}
.nav-add-btn:hover { border-color: rgba(34,211,238,0.4); color: #22d3ee; }

.sidebar-footer { padding: 20px; border-top: 1px solid rgba(255,255,255,0.05); background: rgba(0,0,0,0.1); }
.user-card      { display: flex; align-items: center; gap: 12px; padding: 12px; border-radius: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); }
.user-avatar    { width: 36px; height: 36px; border-radius: 8px; background: linear-gradient(135deg, #0891b2, #3b82f6); display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 900; color: white; }
.user-name      { font-size: 12px; font-weight: 700; color: #cbd5e1; }
.user-role      { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #0e7490; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 700; }

/* ─── Main ─── */
.main {
  flex: 1; display: flex; flex-direction: column; min-width: 0;
  background: radial-gradient(circle at 50% 0%, rgba(13,18,36,0.4) 0%, transparent 100%);
}

/* ─── Header ─── */
.header {
  height: 64px; border-bottom: 1px solid var(--border);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 32px; background: rgba(5,8,18,0.5); backdrop-filter: blur(10px); flex-shrink: 0;
}

.header-left          { display: flex; align-items: center; gap: 16px; }
.breadcrumb-section   { font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.15em; }
.breadcrumb-divider   { color: #1e293b; }
.breadcrumb-page      { font-size: 14px; font-weight: 700; color: white; margin: 0; }
.header-right         { display: flex; align-items: center; gap: 16px; }
.date-badge           { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #475569; background: rgba(255,255,255,0.05); padding: 6px 16px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.05); }
.avatar-placeholder   { width: 32px; height: 32px; border-radius: 50%; border: 1px solid rgba(255,255,255,0.1); background: #1e293b; }

/* ─── Content ─── */
.content-scroll { flex: 1; overflow-y: auto; padding: 48px; }
.content-inner  { max-width: 1040px; margin: 0 auto; }

/* ─── Dashboard ─── */
.welcome-header {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 54px; padding-bottom: 32px; border-bottom: 1px solid var(--border);
}
.welcome-title { font-family: 'Syne', sans-serif; font-size: 2.25rem; font-weight: 800; letter-spacing: -0.04em; line-height: 1.1; margin: 0; }
.welcome-name  { background: linear-gradient(to right, #22d3ee, #3b82f6); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.welcome-sub   { color: #64748b; font-size: 0.95rem; margin-top: 8px; max-width: 480px; }

.summary-row   { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 48px; }
.summary-card  {
  background: var(--card-bg); border: 1px solid var(--border);
  border-radius: 20px; padding: 24px; transition: all 0.3s ease;
}
.summary-card:hover { border-color: rgba(34,211,238,0.2); background: rgba(13,18,36,0.8); transform: translateY(-2px); }

.summary-icon  { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; }
.bg-cyan-icon    { background: rgba(34,211,238,0.1); color: #22d3ee; }
.bg-emerald-icon { background: rgba(52,211,153,0.1); color: #34d399; }
.bg-amber-icon   { background: rgba(251,191,36,0.1);  color: #fbbf24; }

.summary-label { font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; display: block; }
.summary-value { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 700; color: #f1f5f9; margin-top: 4px; }
.summary-unit  { font-size: 12px; color: #475569; font-weight: 400; font-family: 'Figtree', sans-serif; margin-left: 4px; }

.section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; }
.section-title  { display: flex; align-items: center; gap: 12px; }
.section-dot    { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 10px var(--accent); }
.section-title h3 { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; text-transform: uppercase; letter-spacing: 0.2em; color: #475569; font-weight: 600; margin: 0; }

.ws-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 20px; }
.ws-card {
  background: var(--card-bg); border: 1px solid var(--border); border-radius: 20px;
  padding: 24px; display: flex; align-items: center; gap: 18px; cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4,0,0.2,1);
}
.ws-card:hover { border-color: rgba(34,211,238,0.3); background: rgba(34,211,238,0.04); transform: scale(1.02); box-shadow: 0 10px 40px rgba(0,0,0,0.4); }

.ws-icon-wrap { width: 48px; height: 48px; border-radius: 12px; background: rgba(6,182,212,0.08); border: 1px solid rgba(6,182,212,0.15); display: flex; align-items: center; justify-content: center; color: var(--accent); flex-shrink: 0; }
.ws-card-name  { font-weight: 700; color: white; font-size: 14px; letter-spacing: -0.02em; margin: 0 0 4px; }
.ws-card-meta  { display: flex; align-items: center; gap: 16px; }
.ws-task-count { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; }
.progress-bar-track { height: 4px; width: 48px; background: #1e293b; border-radius: 999px; overflow: hidden; }
.progress-bar-fill  { height: 100%; background: #22d3ee; transition: width 0.4s ease; }
.chevron { color: #334155; }
.flex-1 { flex: 1; }

/* ─── Workspace Detail ─── */
.detail-header    { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.ws-badge         { display: inline-block; padding: 2px 8px; border-radius: 4px; background: rgba(34,211,238,0.1); color: #22d3ee; font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.15em; border: 1px solid rgba(34,211,238,0.2); margin-bottom: 12px; }
.ws-detail-title  { font-family: 'Syne', sans-serif; font-size: 2.5rem; font-weight: 800; letter-spacing: -0.04em; color: white; margin: 0; }

.btn-cyan {
  display: flex; align-items: center; gap: 8px; padding: 10px 24px;
  background: #0891b2; border: none; border-radius: 12px; font-size: 12px;
  font-weight: 700; color: white; cursor: pointer;
  box-shadow: 0 8px 24px rgba(8,145,178,0.2); transition: transform 0.2s;
}
.btn-cyan:hover { transform: translateY(-2px); }

.btn-white {
  padding: 10px 24px; background: white; color: #0f172a; border: none;
  border-radius: 12px; font-size: 12px; font-weight: 700; cursor: pointer;
  box-shadow: 0 8px 24px rgba(0,0,0,0.2); transition: transform 0.2s;
}
.btn-white:hover { transform: scale(1.05); }

.task-container { background: rgba(13,18,36,0.3); border: 1px solid var(--border); border-radius: 24px; padding: 32px; }
.task-toolbar   { display: flex; justify-content: space-between; align-items: center; margin-bottom: 32px; }

.filter-bar     { display: flex; gap: 4px; padding: 4px; background: rgba(0,0,0,0.2); border-radius: 12px; border: 1px solid rgba(255,255,255,0.05); }
.filter-btn     { padding: 8px 20px; border-radius: 8px; font-size: 11px; font-weight: 700; border: none; cursor: pointer; transition: all 0.2s; background: transparent; color: #64748b; }
.filter-btn:hover     { color: #cbd5e1; }
.filter-btn--active   { background: white; color: #0f172a; box-shadow: 0 4px 12px rgba(0,0,0,0.2); }

.progress-info  { display: flex; align-items: center; gap: 12px; }
.progress-text  { text-align: right; }
.progress-label { font-family: 'JetBrains Mono', monospace; font-size: 10px; color: #475569; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em; margin: 0; }
.progress-pct   { font-size: 14px; font-weight: 700; color: #22d3ee; margin: 0; }

.ring-wrap  { width: 48px; height: 48px; position: relative; }
.ring-svg   { position: absolute; inset: 0; width: 100%; height: 100%; transform: rotate(-90deg); }
.ring-bg    { color: rgba(34,211,238,0.15); }
.ring-fg    { color: #22d3ee; transition: stroke-dashoffset 0.5s ease; }

.task-list  { display: flex; flex-direction: column; gap: 12px; }
.task-row   {
  display: flex; align-items: center; gap: 16px; padding: 16px;
  background: rgba(255,255,255,0.02); border: 1px solid transparent;
  border-radius: 16px; cursor: pointer; transition: all 0.2s ease;
}
.task-row:hover    { background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.06); transform: translateX(4px); }
.task-row--done    { opacity: 0.4; }

.checkbox           { width: 20px; height: 20px; border-radius: 6px; border: 2px solid #334155; display: flex; align-items: center; justify-content: center; flex-shrink: 0; transition: all 0.2s; }
.checkbox--checked  { background: #10b981; border-color: #10b981; }

.task-title         { font-size: 14px; font-weight: 700; letter-spacing: -0.02em; margin: 0 0 4px; }
.task-title--active { color: #cbd5e1; }
.task-title--done   { text-decoration: line-through; color: #475569; }
.task-meta          { display: flex; align-items: center; gap: 12px; }
.task-date          { font-family: 'JetBrains Mono', monospace; font-size: 9px; color: #475569; font-weight: 700; }

.prio-pill   { padding: 3px 8px; border-radius: 6px; font-size: 0.6rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
.prio-high   { background: rgba(248,113,113,0.1); color: #f87171; }
.prio-medium { background: rgba(251,191,36,0.1);  color: #fbbf24; }
.prio-low    { background: rgba(52,211,153,0.1);  color: #34d399; }

.delete-btn   { padding: 8px; background: none; border: none; cursor: pointer; color: #1e293b; transition: color 0.2s; flex-shrink: 0; }
.delete-btn:hover { color: #f87171; }

.empty-state { padding: 64px 0; text-align: center; }
.empty-state p { color: #334155; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em; }

/* ─── Modal ─── */
.modal-overlay {
  position: fixed; inset: 0; background: rgba(3,5,14,0.9);
  backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 1000;
}
.modal-box    { background: #0d1224; border: 1px solid var(--border); border-radius: 28px; width: 440px; padding: 32px; box-shadow: 0 40px 100px rgba(0,0,0,0.8); }
.modal-title  { font-family: 'Syne', sans-serif; font-size: 1.5rem; font-weight: 800; color: white; letter-spacing: -0.04em; margin: 0; }
.modal-sub    { font-size: 12px; color: #475569; margin: 8px 0 0; }
.modal-fields { display: flex; flex-direction: column; gap: 24px; margin-top: 32px; }

.field        { display: flex; flex-direction: column; gap: 8px; }
.field-label  { font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 0.15em; }
.field-input  { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 14px 16px; font-size: 14px; color: #e2e8f0; outline: none; transition: border-color 0.2s; font-family: inherit; width: 100%; }
.field-input:focus { border-color: rgba(34,211,238,0.4); }

.prio-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
.prio-btn   { padding: 10px; border-radius: 12px; font-size: 10px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.05); color: #64748b; cursor: pointer; transition: all 0.2s; }
.prio-btn--active { background: rgba(34,211,238,0.1); border-color: #22d3ee; color: #22d3ee; }

.modal-actions { display: flex; gap: 12px; margin-top: 40px; }
.btn-cancel  { flex: 1; padding: 12px; font-size: 12px; font-weight: 700; color: #64748b; background: none; border: none; cursor: pointer; transition: color 0.2s; }
.btn-cancel:hover { color: #94a3b8; }
.btn-confirm { flex: 2; padding: 12px; background: #0891b2; border: none; border-radius: 12px; font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.1em; color: white; cursor: pointer; box-shadow: 0 8px 24px rgba(8,145,178,0.2); transition: opacity 0.2s; }
.btn-confirm:disabled { opacity: 0.2; cursor: not-allowed; }

/* ─── Transitions ─── */
.fade-enter-active, .fade-leave-active { transition: opacity 0.35s cubic-bezier(0.4,0,0.2,1), transform 0.35s cubic-bezier(0.4,0,0.2,1); }
.fade-enter-from, .fade-leave-to       { opacity: 0; transform: translateY(8px); }

/* ─── Scrollbar ─── */
::-webkit-scrollbar       { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 4px; }
.truncate { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
</style>