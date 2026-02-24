<template>
  <div class="ws-root">

    <!-- ░░ AMBIENT ░░ -->
    <div class="ambient" aria-hidden="true">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
      <div class="noise"></div>
    </div>

    <div class="ws-layout">

      <!-- ══════════════════════════════════════════════
           SIDEBAR
      ═══════════════════════════════════════════════ -->
      <aside class="sidebar">
        <div class="sidebar-logo">
          <div class="logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <span class="logo-text">TaskTracker</span>
        </div>

        <nav class="sidebar-nav">
          <a href="dashboard.html" class="nav-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
            <span>Dashboard</span>
          </a>
          <a href="projects.html" class="nav-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
            <span>Proyek Saya</span>
          </a>
          <a href="#" class="nav-item nav-active">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            <span>Workspace</span>
            <span class="nav-pip"></span>
          </a>
          <a href="profile.html" class="nav-item">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span>Profil</span>
          </a>
        </nav>

        <!-- Project switcher -->
        <div class="sidebar-projects">
          <p class="sidebar-section-label">Proyek Aktif</p>
          <div
            v-for="p in projects"
            :key="p.id"
            :class="['sidebar-project-item', activeProject?.id === p.id ? 'sidebar-project-active' : '']"
            @click="activeProject = p"
          >
            <div class="sp-dot" :style="{ background: p.color }"></div>
            <span class="sp-name">{{ p.name }}</span>
            <span v-if="activeProject?.id === p.id" class="sp-check">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
          </div>
        </div>

        <div class="sidebar-footer">
          <div class="sidebar-user">
            <div class="user-avatar-sm">{{ currentUser.initial }}</div>
            <div class="user-meta">
              <span class="user-name-sm">{{ currentUser.name }}</span>
              <span class="user-role">Admin</span>
            </div>
            <div class="user-online-dot"></div>
          </div>
        </div>
      </aside>

      <!-- ══════════════════════════════════════════════
           MAIN
      ═══════════════════════════════════════════════ -->
      <div class="ws-main">

        <!-- TOPBAR -->
        <header class="topbar">
          <div class="topbar-left">
            <div class="topbar-project-badge" :style="{ '--pc': activeProject?.color }">
              <span class="tpb-dot"></span>
              <span class="tpb-name">{{ activeProject?.name }}</span>
            </div>
            <div class="topbar-divider"></div>
            <span class="topbar-page">Workspace</span>
          </div>

          <div class="topbar-center">
            <div class="view-tabs">
              <button
                v-for="v in views"
                :key="v.id"
                :class="['view-tab', activeView === v.id ? 'view-tab-active' : '']"
                @click="activeView = v.id"
              >
                <span v-html="v.icon" class="view-tab-icon"></span>
                {{ v.label }}
              </button>
            </div>
          </div>

          <div class="topbar-right">
            <!-- Online members -->
            <div class="online-members">
              <div
                v-for="(m, i) in onlineMembers"
                :key="m.id"
                class="member-avatar"
                :style="{ '--bg': m.color, '--z': onlineMembers.length - i, marginLeft: i === 0 ? '0' : '-8px' }"
                :title="m.name + ' — online'"
              >{{ m.initial }}</div>
              <div class="member-count">+{{ extraMembers }}</div>
            </div>

            <button class="btn-invite" @click="showInviteModal = true">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Undang
            </button>
          </div>
        </header>

        <!-- PROJECT HERO -->
        <div class="project-hero">
          <div class="hero-left">
            <div class="hero-meta">
              <span class="hero-tag" :style="{ '--pc': activeProject?.color }">{{ activeProject?.tag }}</span>
              <span class="hero-deadline">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Deadline: {{ activeProject?.deadline }}
              </span>
            </div>
            <h1 class="hero-title">{{ activeProject?.name }}</h1>
            <p class="hero-desc">{{ activeProject?.desc }}</p>
          </div>
          <div class="hero-stats">
            <div class="stat-card" v-for="s in stats" :key="s.label">
              <span class="stat-value" :style="{ color: s.color }">{{ s.value }}</span>
              <span class="stat-label">{{ s.label }}</span>
            </div>
            <div class="stat-progress">
              <svg width="64" height="64" viewBox="0 0 64 64">
                <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="5"/>
                <circle
                  cx="32" cy="32" r="26" fill="none"
                  stroke="url(#prog-grad)" stroke-width="5"
                  stroke-linecap="round"
                  :stroke-dasharray="`${progressArc} 163.36`"
                  transform="rotate(-90 32 32)"
                />
                <defs>
                  <linearGradient id="prog-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stop-color="#22d3ee"/>
                    <stop offset="100%" stop-color="#3b82f6"/>
                  </linearGradient>
                </defs>
              </svg>
              <div class="prog-center">
                <span class="prog-pct">{{ progressPct }}%</span>
                <span class="prog-label">Done</span>
              </div>
            </div>
          </div>
        </div>

        <!-- WORKSPACE BODY -->
        <div class="ws-body">

          <!-- ── KANBAN BOARD ────────────────────────────── -->
          <div class="kanban-wrap" v-if="activeView === 'board'">
            <div class="kanban-board">
              <div
                v-for="col in columns"
                :key="col.id"
                class="kanban-col"
                :class="{ 'col-drag-over': dragOverCol === col.id }"
                @dragover.prevent="dragOverCol = col.id"
                @dragleave="dragOverCol = null"
                @drop="onDrop(col.id)"
              >
                <!-- Column Header -->
                <div class="col-header">
                  <div class="col-header-left">
                    <div class="col-indicator" :style="{ background: col.color }"></div>
                    <span class="col-title">{{ col.title }}</span>
                    <span class="col-count">{{ tasksIn(col.id).length }}</span>
                  </div>
                  <button class="col-add-btn" @click="openAddTask(col.id)" title="Tambah task">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>

                <!-- Top accent -->
                <div class="col-accent" :style="{ background: col.color }"></div>

                <!-- Cards -->
                <div class="col-cards">
                  <div
                    v-for="task in tasksIn(col.id)"
                    :key="task.id"
                    class="task-card"
                    :class="{ 'card-dragging': draggingId === task.id }"
                    draggable="true"
                    @dragstart="draggingId = task.id"
                    @dragend="draggingId = null; dragOverCol = null"
                  >
                    <div class="card-top">
                      <span class="card-id">{{ task.code }}</span>
                      <span :class="['card-priority', `prio-${task.priority}`]">
                        <span class="prio-dot"></span>{{ task.priority }}
                      </span>
                    </div>
                    <p class="card-title">{{ task.title }}</p>
                    <p v-if="task.desc" class="card-desc">{{ task.desc }}</p>

                    <div class="card-tags" v-if="task.tags?.length">
                      <span v-for="tag in task.tags" :key="tag" class="card-tag">{{ tag }}</span>
                    </div>

                    <div class="card-bottom">
                      <div class="card-assignees">
                        <div
                          v-for="(mid, i) in task.assignees"
                          :key="mid"
                          class="card-assignee"
                          :style="{ '--bg': getMember(mid)?.color, marginLeft: i === 0 ? '0' : '-6px' }"
                          :title="getMember(mid)?.name"
                        >{{ getMember(mid)?.initial }}</div>
                      </div>
                      <div class="card-meta">
                        <span v-if="task.comments" class="card-meta-item">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                          {{ task.comments }}
                        </span>
                        <span v-if="task.dueDate" class="card-meta-item" :class="{ 'meta-overdue': isOverdue(task.dueDate) }">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                          {{ task.dueDate }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Empty col -->
                  <div v-if="tasksIn(col.id).length === 0" class="col-empty">
                    <div class="col-empty-icon" :style="{ color: col.color }">
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="3" stroke-dasharray="4 3"/></svg>
                    </div>
                    <p>Belum ada task</p>
                  </div>
                </div>

                <!-- Add task inline form -->
                <div v-if="addingInCol === col.id" class="col-add-form">
                  <input
                    ref="inlineInput"
                    v-model="newTaskTitle"
                    placeholder="Judul task baru..."
                    class="col-add-input"
                    @keyup.enter="confirmAddTask"
                    @keyup.esc="addingInCol = null"
                    autofocus
                  />
                  <div class="col-add-actions">
                    <button class="col-add-confirm" @click="confirmAddTask">Tambah</button>
                    <button class="col-add-cancel" @click="addingInCol = null">Batal</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- ── LIST VIEW ───────────────────────────────── -->
          <div class="list-wrap" v-if="activeView === 'list'">
            <div class="list-header-row">
              <span class="lh-task">Task</span>
              <span class="lh-assignee">Assignee</span>
              <span class="lh-priority">Prioritas</span>
              <span class="lh-status">Status</span>
              <span class="lh-due">Due Date</span>
            </div>
            <div
              v-for="task in allTasks"
              :key="task.id"
              class="list-row"
              :class="{ 'list-row-done': task.status === 'done' }"
            >
              <div class="lr-task">
                <span class="lr-code">{{ task.code }}</span>
                <span class="lr-title">{{ task.title }}</span>
              </div>
              <div class="lr-assignee">
                <div
                  v-for="mid in task.assignees"
                  :key="mid"
                  class="card-assignee"
                  :style="{ '--bg': getMember(mid)?.color }"
                  :title="getMember(mid)?.name"
                >{{ getMember(mid)?.initial }}</div>
              </div>
              <div class="lr-priority">
                <span :class="['card-priority', `prio-${task.priority}`]">
                  <span class="prio-dot"></span>{{ task.priority }}
                </span>
              </div>
              <div class="lr-status">
                <span class="status-chip" :style="{ '--sc': getCol(task.status)?.color }">
                  {{ getCol(task.status)?.title }}
                </span>
              </div>
              <div class="lr-due">
                <span class="card-meta-item" :class="{ 'meta-overdue': isOverdue(task.dueDate) }">{{ task.dueDate || '—' }}</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- ══════════════════════════════════════════════
           RIGHT PANEL — Activity + Chat
      ═══════════════════════════════════════════════ -->
      <aside class="right-panel" :class="{ 'panel-collapsed': panelCollapsed }">
        <div class="rp-toggle" @click="panelCollapsed = !panelCollapsed">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
            <polyline :points="panelCollapsed ? '15 18 9 12 15 6' : '9 18 15 12 9 6'"/>
          </svg>
        </div>

        <template v-if="!panelCollapsed">
          <!-- Panel Tabs -->
          <div class="rp-tabs">
            <button :class="['rp-tab', rpTab === 'activity' ? 'rp-tab-active' : '']" @click="rpTab = 'activity'">Aktivitas</button>
            <button :class="['rp-tab', rpTab === 'chat' ? 'rp-tab-active' : '']" @click="rpTab = 'chat'">
              Chat
              <span v-if="unreadChat > 0" class="rp-badge">{{ unreadChat }}</span>
            </button>
            <button :class="['rp-tab', rpTab === 'members' ? 'rp-tab-active' : '']" @click="rpTab = 'members'">Tim</button>
          </div>

          <!-- ── ACTIVITY TAB ─────────────────────────── -->
          <div v-if="rpTab === 'activity'" class="rp-scroll">
            <div class="activity-feed">
              <div v-for="(act, i) in activities" :key="i" class="activity-item">
                <div class="act-avatar" :style="{ '--bg': act.color }">{{ act.initial }}</div>
                <div class="act-body">
                  <p class="act-text"><strong>{{ act.name }}</strong> {{ act.action }}</p>
                  <span class="act-time">{{ act.time }}</span>
                </div>
                <div class="act-icon" :class="`act-icon-${act.type}`">
                  <svg v-if="act.type === 'done'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  <svg v-else-if="act.type === 'add'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <svg v-else-if="act.type === 'move'" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="5 12 19 12"/><polyline points="14 6 20 12 14 18"/></svg>
                  <svg v-else width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>
                </div>
              </div>
            </div>
          </div>

          <!-- ── CHAT TAB ─────────────────────────────── -->
          <div v-if="rpTab === 'chat'" class="rp-chat">
            <div class="chat-messages" ref="chatScroll">
              <div
                v-for="msg in chatMessages"
                :key="msg.id"
                :class="['chat-msg', msg.isMe ? 'msg-me' : 'msg-other']"
              >
                <div v-if="!msg.isMe" class="msg-avatar" :style="{ '--bg': msg.color }">{{ msg.initial }}</div>
                <div class="msg-bubble-wrap">
                  <span v-if="!msg.isMe" class="msg-name">{{ msg.name }}</span>
                  <div class="msg-bubble">{{ msg.text }}</div>
                  <span class="msg-time">{{ msg.time }}</span>
                </div>
              </div>
            </div>
            <div class="chat-input-wrap">
              <input
                v-model="chatInput"
                class="chat-input"
                placeholder="Ketik pesan..."
                @keyup.enter="sendChat"
              />
              <button class="chat-send" @click="sendChat" :disabled="!chatInput.trim()">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              </button>
            </div>
          </div>

          <!-- ── MEMBERS TAB ──────────────────────────── -->
          <div v-if="rpTab === 'members'" class="rp-scroll">
            <div class="members-list">
              <div v-for="m in allMembers" :key="m.id" class="member-row">
                <div class="member-ava" :style="{ '--bg': m.color }">
                  {{ m.initial }}
                  <div class="member-status-dot" :class="m.online ? 'dot-online' : 'dot-offline'"></div>
                </div>
                <div class="member-info">
                  <span class="member-name">{{ m.name }}</span>
                  <span class="member-role">{{ m.role }}</span>
                </div>
                <span :class="['member-badge', m.online ? 'badge-on' : 'badge-off']">
                  {{ m.online ? 'Online' : 'Offline' }}
                </span>
              </div>
            </div>
          </div>
        </template>
      </aside>

    </div>

    <!-- ══ ADD TASK MODAL ══════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showAddModal" class="modal-overlay" @click.self="showAddModal = false">
        <div class="modal-box">
          <div class="modal-head">
            <h3 class="modal-title">Tambah Task Baru</h3>
            <button class="modal-close" @click="showAddModal = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>

          <div class="modal-body">
            <div class="mf-field">
              <label class="mf-label">Judul Task <span class="req">*</span></label>
              <input v-model="modalForm.title" class="mf-input" placeholder="Apa yang perlu dikerjakan?"/>
            </div>
            <div class="mf-field">
              <label class="mf-label">Deskripsi</label>
              <textarea v-model="modalForm.desc" class="mf-textarea" rows="3" placeholder="Detail tambahan..."></textarea>
            </div>
            <div class="mf-row">
              <div class="mf-field">
                <label class="mf-label">Status</label>
                <select v-model="modalForm.status" class="mf-select">
                  <option v-for="c in columns" :key="c.id" :value="c.id">{{ c.title }}</option>
                </select>
              </div>
              <div class="mf-field">
                <label class="mf-label">Prioritas</label>
                <div class="prio-btns">
                  <button v-for="p in priorities" :key="p" :class="['prio-btn', `prio-${p}`, modalForm.priority === p ? 'prio-active' : '']" type="button" @click="modalForm.priority = p">
                    <span class="prio-dot"></span>{{ p }}
                  </button>
                </div>
              </div>
            </div>
            <div class="mf-field">
              <label class="mf-label">Assignee</label>
              <div class="assignee-picker">
                <div
                  v-for="m in allMembers"
                  :key="m.id"
                  :class="['ap-avatar', modalForm.assignees.includes(m.id) ? 'ap-selected' : '']"
                  :style="{ '--bg': m.color }"
                  :title="m.name"
                  @click="toggleAssignee(m.id)"
                >{{ m.initial }}</div>
              </div>
            </div>
          </div>

          <div class="modal-foot">
            <button class="btn-cancel" @click="showAddModal = false">Batal</button>
            <button class="btn-submit" @click="submitModalTask" :disabled="!modalForm.title.trim()">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah Task
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- ══ INVITE MODAL ════════════════════════════════════ -->
    <Transition name="modal">
      <div v-if="showInviteModal" class="modal-overlay" @click.self="showInviteModal = false">
        <div class="modal-box modal-sm">
          <div class="modal-head">
            <h3 class="modal-title">Undang Anggota</h3>
            <button class="modal-close" @click="showInviteModal = false">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            </button>
          </div>
          <div class="modal-body">
            <div class="mf-field">
              <label class="mf-label">Alamat Email</label>
              <input v-model="inviteEmail" class="mf-input" type="email" placeholder="colleague@email.com"/>
            </div>
            <div class="invite-link-box">
              <span class="invite-link-label">Link Undangan</span>
              <div class="invite-link-row">
                <span class="invite-link-text">https://tasktracker.app/inv/{{ activeProject?.id }}/xK9mP2</span>
                <button class="invite-copy" @click="copiedLink = true">
                  <svg v-if="!copiedLink" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  <svg v-else width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#34d399" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                </button>
              </div>
            </div>
          </div>
          <div class="modal-foot">
            <button class="btn-cancel" @click="showInviteModal = false">Batal</button>
            <button class="btn-submit" @click="showInviteModal = false">Kirim Undangan</button>
          </div>
        </div>
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, nextTick, watch } from 'vue'

// ── Types ──────────────────────────────────────────────────
interface Member { id: string; name: string; initial: string; color: string; role: string; online: boolean }
interface Task { id: number; code: string; title: string; desc?: string; status: string; priority: string; assignees: string[]; tags?: string[]; comments?: number; dueDate?: string }
interface Column { id: string; title: string; color: string }
interface Project { id: string; name: string; color: string; tag: string; deadline: string; desc: string }
interface Activity { name: string; initial: string; color: string; action: string; time: string; type: string }
interface ChatMessage { id: number; name: string; initial: string; color: string; text: string; time: string; isMe: boolean }

// ── Data ───────────────────────────────────────────────────
const allMembers = ref<Member[]>([
  { id: 'm1', name: 'Andi Pratama',  initial: 'AP', color: '#0891b2', role: 'Frontend Dev', online: true },
  { id: 'm2', name: 'Budi Santoso',  initial: 'BS', color: '#7c3aed', role: 'Backend Dev',  online: true },
  { id: 'm3', name: 'Citra Dewi',    initial: 'CD', color: '#be185d', role: 'UI Designer',  online: false },
  { id: 'm4', name: 'Dian Fitri',    initial: 'DF', color: '#059669', role: 'QA Engineer',  online: true },
  { id: 'm5', name: 'Eko Prasetya',  initial: 'EP', color: '#d97706', role: 'DevOps',        online: false },
])

const currentUser: Member = { id: 'me', name: 'Andi Pratama', initial: 'AP', color: '#0891b2', role: 'Frontend Dev', online: true }

const projects = ref<Project[]>([
  { id: 'p1', name: 'Website Redesign', color: '#22d3ee', tag: 'DESIGN', deadline: '31 Mar 2026', desc: 'Redesign penuh tampilan website perusahaan dengan identitas visual baru dan UX yang lebih intuitif.' },
  { id: 'p2', name: 'Mobile App v2',    color: '#a78bfa', tag: 'DEV',    deadline: '15 Apr 2026', desc: 'Versi kedua aplikasi mobile dengan fitur kolaborasi real-time dan notifikasi pintar.' },
  { id: 'p3', name: 'API Integration',  color: '#34d399', tag: 'BACKEND', deadline: '10 Apr 2026', desc: 'Integrasi API pihak ketiga untuk payment gateway, notifikasi, dan analitik.' },
])

const activeProject = ref<Project>(projects.value[0])

const columns: Column[] = [
  { id: 'todo',       title: 'To Do',       color: '#64748b' },
  { id: 'inprogress', title: 'In Progress', color: '#22d3ee' },
  { id: 'review',     title: 'Review',      color: '#f59e0b' },
  { id: 'done',       title: 'Done',        color: '#34d399' },
]

const tasks = ref<Task[]>([
  { id: 1,  code: 'WR-01', title: 'Riset kompetitor dan benchmark desain', desc: 'Analisis 5 kompetitor utama',           status: 'done',       priority: 'high',   assignees: ['m1', 'm3'], tags: ['research'], comments: 4, dueDate: '10 Feb' },
  { id: 2,  code: 'WR-02', title: 'Buat wireframe halaman utama',          desc: 'Low-fidelity wireframe untuk 5 halaman', status: 'done',       priority: 'high',   assignees: ['m3'],        tags: ['design'],   comments: 2, dueDate: '14 Feb' },
  { id: 3,  code: 'WR-03', title: 'Design sistem warna & tipografi',                                                       status: 'done',       priority: 'medium', assignees: ['m3'],        tags: ['design'],   comments: 6, dueDate: '18 Feb' },
  { id: 4,  code: 'WR-04', title: 'Kembangkan komponen UI library',                                                        status: 'inprogress', priority: 'high',   assignees: ['m1', 'm3'], tags: ['frontend'], comments: 3, dueDate: '28 Feb' },
  { id: 5,  code: 'WR-05', title: 'Implementasi halaman Landing Page',                                                     status: 'inprogress', priority: 'high',   assignees: ['m1'],        tags: ['frontend'],              dueDate: '5 Mar'  },
  { id: 6,  code: 'WR-06', title: 'Integrasi CMS headless',                desc: 'Hubungkan Strapi dengan Next.js',       status: 'inprogress', priority: 'medium', assignees: ['m2'],        tags: ['backend'],  comments: 1, dueDate: '8 Mar'  },
  { id: 7,  code: 'WR-07', title: 'Setup CI/CD pipeline',                                                                  status: 'review',     priority: 'medium', assignees: ['m5'],        tags: ['devops'],   comments: 2, dueDate: '20 Feb' },
  { id: 8,  code: 'WR-08', title: 'Optimasi performa & Core Web Vitals',                                                   status: 'review',     priority: 'high',   assignees: ['m1', 'm2'], tags: ['frontend'], comments: 5, dueDate: '22 Feb' },
  { id: 9,  code: 'WR-09', title: 'Testing cross-browser compatibility',                                                   status: 'todo',       priority: 'medium', assignees: ['m4'],        tags: ['qa'],                    dueDate: '12 Mar' },
  { id: 10, code: 'WR-10', title: 'Dokumentasi API endpoint',                                                              status: 'todo',       priority: 'low',    assignees: ['m2'],        tags: ['backend'],               dueDate: '15 Mar' },
  { id: 11, code: 'WR-11', title: 'User acceptance testing (UAT)',                                                         status: 'todo',       priority: 'high',   assignees: ['m4', 'm1'],                                   dueDate: '20 Mar' },
])

const activities = ref<Activity[]>([
  { name: 'Budi',  initial: 'BS', color: '#7c3aed', action: 'memindahkan "Setup CI/CD" ke Review',           time: '2 mnt lalu',   type: 'move' },
  { name: 'Citra', initial: 'CD', color: '#be185d', action: 'menyelesaikan "Design sistem warna"',            time: '15 mnt lalu',  type: 'done' },
  { name: 'Andi',  initial: 'AP', color: '#0891b2', action: 'menambahkan task "UAT" ke To Do',               time: '32 mnt lalu',  type: 'add'  },
  { name: 'Dian',  initial: 'DF', color: '#059669', action: 'mengedit "Optimasi Core Web Vitals"',           time: '1 jam lalu',   type: 'edit' },
  { name: 'Eko',   initial: 'EP', color: '#d97706', action: 'memindahkan "CI/CD pipeline" ke In Progress',   time: '2 jam lalu',   type: 'move' },
  { name: 'Citra', initial: 'CD', color: '#be185d', action: 'menyelesaikan "Wireframe halaman utama"',       time: '3 jam lalu',   type: 'done' },
  { name: 'Andi',  initial: 'AP', color: '#0891b2', action: 'menambahkan "Komponen UI library"',             time: 'Kemarin',      type: 'add'  },
  { name: 'Budi',  initial: 'BS', color: '#7c3aed', action: 'mengedit deskripsi "Integrasi CMS headless"',  time: 'Kemarin',      type: 'edit' },
])

const chatMessages = ref<ChatMessage[]>([
  { id: 1, name: 'Budi Santoso', initial: 'BS', color: '#7c3aed', text: 'Hei tim, ada update soal integrasi CMS. Saya sudah selesaikan endpoint authentication-nya.', time: '09:12', isMe: false },
  { id: 2, name: 'Citra Dewi',   initial: 'CD', color: '#be185d', text: 'Bagus! Nanti saya cek di staging ya. Btw mockup halaman about sudah saya upload ke Figma.', time: '09:15', isMe: false },
  { id: 3, name: 'Me',           initial: 'AP', color: '#0891b2', text: 'Siap, saya akan langsung implementasi setelah komponen selesai. Estimasi 2-3 hari.', time: '09:18', isMe: true  },
  { id: 4, name: 'Dian Fitri',   initial: 'DF', color: '#059669', text: 'Untuk UAT, kita mulai minggu depan kan? Saya butuh akses ke staging env.', time: '10:03', isMe: false },
  { id: 5, name: 'Me',           initial: 'AP', color: '#0891b2', text: 'Budi, bisa bantu kasih akses staging ke Dian?', time: '10:05', isMe: true  },
])

// ── State ──────────────────────────────────────────────────
const activeView = ref<'board' | 'list'>('board')
const rpTab      = ref<'activity' | 'chat' | 'members'>('activity')
const panelCollapsed = ref(false)
const showAddModal   = ref(false)
const showInviteModal = ref(false)
const unreadChat     = ref(2)
const copiedLink     = ref(false)

const draggingId  = ref<number | null>(null)
const dragOverCol = ref<string | null>(null)
const addingInCol = ref<string | null>(null)
const newTaskTitle = ref('')
const chatInput   = ref('')
const inviteEmail = ref('')
const chatScroll  = ref<HTMLElement | null>(null)
const inlineInput = ref<HTMLInputElement | null>(null)

const modalForm = reactive({
  title: '',
  desc: '',
  status: 'todo',
  priority: 'medium',
  assignees: [] as string[],
})

const priorities = ['low', 'medium', 'high']

const views = [
  { id: 'board', label: 'Board', icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>' },
  { id: 'list',  label: 'List',  icon: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>' },
]

// ── Computed ───────────────────────────────────────────────
const onlineMembers  = computed(() => allMembers.value.filter(m => m.online).slice(0, 4))
const extraMembers   = computed(() => Math.max(0, allMembers.value.length - onlineMembers.value.length))
const allTasks       = computed(() => tasks.value)
const doneTasks      = computed(() => tasks.value.filter(t => t.status === 'done').length)
const progressPct    = computed(() => Math.round(doneTasks.value / tasks.value.length * 100))
const progressArc    = computed(() => (progressPct.value / 100) * 163.36)

const stats = computed(() => [
  { label: 'Total Task',  value: tasks.value.length,          color: '#94a3b8' },
  { label: 'Selesai',     value: doneTasks.value,             color: '#34d399' },
  { label: 'In Progress', value: tasksIn('inprogress').length, color: '#22d3ee' },
])

// ── Methods ────────────────────────────────────────────────
const tasksIn  = (colId: string) => tasks.value.filter(t => t.status === colId)
const getMember = (id: string) => allMembers.value.find(m => m.id === id)
const getCol    = (id: string) => columns.find(c => c.id === id)
const isOverdue = (date?: string) => false // simplified

function onDrop(colId: string) {
  if (draggingId.value !== null) {
    const task = tasks.value.find(t => t.id === draggingId.value)
    if (task) task.status = colId
  }
  draggingId.value = null
  dragOverCol.value = null
}

async function openAddTask(colId: string) {
  addingInCol.value = colId
  newTaskTitle.value = ''
  await nextTick()
  const inputs = document.querySelectorAll('.col-add-input')
  ;(inputs[inputs.length - 1] as HTMLInputElement)?.focus()
}

function confirmAddTask() {
  if (!newTaskTitle.value.trim() || !addingInCol.value) return
  const newId = Math.max(...tasks.value.map(t => t.id)) + 1
  const col   = addingInCol.value
  const count = tasks.value.filter(t => t.status === col).length + 1
  tasks.value.push({
    id: newId,
    code: `WR-${String(newId).padStart(2,'0')}`,
    title: newTaskTitle.value.trim(),
    status: col,
    priority: 'medium',
    assignees: ['m1'],
  })
  activities.value.unshift({ name: 'Andi', initial: 'AP', color: '#0891b2', action: `menambahkan "${newTaskTitle.value.trim()}"`, time: 'Baru saja', type: 'add' })
  addingInCol.value = null
  newTaskTitle.value = ''
}

function submitModalTask() {
  if (!modalForm.title.trim()) return
  const newId = Math.max(...tasks.value.map(t => t.id)) + 1
  tasks.value.push({
    id: newId,
    code: `WR-${String(newId).padStart(2,'0')}`,
    title: modalForm.title,
    desc: modalForm.desc || undefined,
    status: modalForm.status,
    priority: modalForm.priority,
    assignees: modalForm.assignees.length ? [...modalForm.assignees] : ['m1'],
  })
  activities.value.unshift({ name: 'Andi', initial: 'AP', color: '#0891b2', action: `menambahkan "${modalForm.title}"`, time: 'Baru saja', type: 'add' })
  modalForm.title = ''; modalForm.desc = ''; modalForm.status = 'todo'; modalForm.priority = 'medium'; modalForm.assignees = []
  showAddModal.value = false
}

function toggleAssignee(id: string) {
  const idx = modalForm.assignees.indexOf(id)
  if (idx > -1) modalForm.assignees.splice(idx, 1)
  else modalForm.assignees.push(id)
}

async function sendChat() {
  if (!chatInput.value.trim()) return
  chatMessages.value.push({
    id: chatMessages.value.length + 1,
    name: 'Me', initial: 'AP', color: '#0891b2',
    text: chatInput.value.trim(),
    time: new Date().toTimeString().slice(0,5),
    isMe: true,
  })
  chatInput.value = ''
  await nextTick()
  if (chatScroll.value) chatScroll.value.scrollTop = chatScroll.value.scrollHeight
}

watch(rpTab, v => { if (v === 'chat') unreadChat.value = 0 })
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');

/* ─── Reset ─────────────────────────────────────────────── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
button { cursor: pointer; font-family: inherit; }
input, textarea, select { font-family: inherit; }
a { text-decoration: none; }

/* ─── Root ──────────────────────────────────────────────── */
.ws-root {
  font-family: 'Figtree', sans-serif;
  background: #060810;
  color: #e2e8f0;
  height: 100vh;
  overflow: hidden;
  position: relative;
}

/* ─── Ambient ───────────────────────────────────────────── */
.ambient { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.orb { position: absolute; border-radius: 50%; filter: blur(90px); }
.orb-1 { width: 600px; height: 600px; background: radial-gradient(circle, rgba(6,182,212,0.065) 0%, transparent 70%); top: -180px; right: -120px; }
.orb-2 { width: 450px; height: 450px; background: radial-gradient(circle, rgba(59,130,246,0.05) 0%, transparent 70%); bottom: -150px; left: -100px; }
.orb-3 { width: 300px; height: 300px; background: radial-gradient(circle, rgba(16,185,129,0.035) 0%, transparent 70%); top: 45%; left: 42%; }
.noise {
  position: absolute; inset: 0; opacity: 0.016;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 180px;
}

/* ─── Layout ────────────────────────────────────────────── */
.ws-layout {
  display: flex;
  height: 100vh;
  position: relative;
  z-index: 1;
}

/* ══════════════════════════════════════════════════════════
   SIDEBAR
══════════════════════════════════════════════════════════ */
.sidebar {
  width: 220px;
  flex-shrink: 0;
  background: rgba(6, 9, 20, 0.92);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(255,255,255,0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  box-shadow: 0 4px 12px rgba(8,145,178,0.3);
  flex-shrink: 0;
}

.logo-text {
  font-family: 'Syne', sans-serif; font-size: 0.98rem; font-weight: 800;
  background: linear-gradient(135deg, #22d3ee, #60a5fa);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  letter-spacing: -0.02em;
}

.sidebar-nav {
  padding: 14px 10px;
  display: flex; flex-direction: column; gap: 2px;
}

.nav-item {
  display: flex; align-items: center; gap: 9px;
  padding: 9px 10px; border-radius: 9px;
  font-size: 0.8rem; font-weight: 500; color: #475569;
  transition: all 0.18s ease; position: relative;
}
.nav-item:hover { background: rgba(255,255,255,0.04); color: #94a3b8; }
.nav-active { background: rgba(6,182,212,0.08) !important; color: #22d3ee !important; border: 1px solid rgba(6,182,212,0.15); }
.nav-pip { position: absolute; right: 10px; width: 5px; height: 5px; border-radius: 50%; background: #22d3ee; box-shadow: 0 0 6px #22d3ee; }

.sidebar-section-label {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.1em;
  color: #334155; padding: 0 10px 8px;
}

.sidebar-projects {
  padding: 14px 10px 10px;
  border-top: 1px solid rgba(255,255,255,0.04);
  flex: 1; overflow-y: auto;
}
.sidebar-projects::-webkit-scrollbar { width: 0; }

.sidebar-project-item {
  display: flex; align-items: center; gap: 8px;
  padding: 8px 10px; border-radius: 9px; cursor: pointer;
  transition: all 0.18s ease; margin-bottom: 2px;
}
.sidebar-project-item:hover { background: rgba(255,255,255,0.04); }
.sidebar-project-active { background: rgba(255,255,255,0.055) !important; }

.sp-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.sp-name { font-size: 0.78rem; font-weight: 500; color: #94a3b8; flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.sp-check { color: #22d3ee; display: flex; }

.sidebar-footer {
  padding: 12px 10px;
  border-top: 1px solid rgba(255,255,255,0.04);
}
.sidebar-user {
  display: flex; align-items: center; gap: 9px;
  padding: 8px 10px; border-radius: 9px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.04);
  position: relative;
}
.user-avatar-sm {
  width: 28px; height: 28px; border-radius: 7px;
  background: linear-gradient(135deg, #0891b2, #2563eb);
  color: #fff; font-size: 0.68rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.user-meta { display: flex; flex-direction: column; gap: 1px; flex: 1; min-width: 0; }
.user-name-sm { font-size: 0.75rem; font-weight: 600; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.user-role { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
.user-online-dot { position: absolute; top: 8px; right: 8px; width: 6px; height: 6px; border-radius: 50%; background: #34d399; box-shadow: 0 0 6px #34d399; }

/* ══════════════════════════════════════════════════════════
   MAIN
══════════════════════════════════════════════════════════ */
.ws-main {
  flex: 1; min-width: 0; display: flex; flex-direction: column; overflow: hidden;
}

/* TOPBAR */
.topbar {
  height: 60px; flex-shrink: 0;
  background: rgba(5, 8, 18, 0.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: center; justify-content: space-between;
  padding: 0 24px; gap: 16px;
}

.topbar-left { display: flex; align-items: center; gap: 10px; }
.topbar-project-badge {
  display: flex; align-items: center; gap: 7px;
  padding: 5px 10px; border-radius: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
}
.tpb-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--pc, #22d3ee); box-shadow: 0 0 6px var(--pc, #22d3ee); }
.tpb-name { font-size: 0.78rem; font-weight: 600; color: #94a3b8; }
.topbar-divider { width: 1px; height: 16px; background: rgba(255,255,255,0.08); }
.topbar-page { font-size: 0.78rem; color: #475569; }

.topbar-center { display: flex; align-items: center; }
.view-tabs { display: flex; gap: 2px; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); border-radius: 9px; padding: 3px; }
.view-tab {
  display: flex; align-items: center; gap: 5px;
  padding: 5px 12px; border-radius: 6px;
  font-size: 0.76rem; font-weight: 600; color: #475569;
  background: none; border: none;
  transition: all 0.18s ease;
}
.view-tab:hover { color: #94a3b8; }
.view-tab-active { background: rgba(34,211,238,0.1); color: #22d3ee !important; }
.view-tab-icon { display: flex; align-items: center; }

.topbar-right { display: flex; align-items: center; gap: 12px; }
.online-members { display: flex; align-items: center; }
.member-avatar {
  width: 28px; height: 28px; border-radius: 8px;
  background: var(--bg, #0891b2); color: #fff;
  font-size: 0.62rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #060810; position: relative; z-index: var(--z, 1);
  transition: transform 0.18s;
}
.member-avatar:hover { transform: translateY(-2px) scale(1.08); z-index: 99 !important; }
.member-count {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(255,255,255,0.06); border: 2px solid #060810;
  font-size: 0.62rem; font-weight: 700; color: #64748b;
  display: flex; align-items: center; justify-content: center;
  margin-left: -8px;
}

.btn-invite {
  display: flex; align-items: center; gap: 6px;
  padding: 7px 14px; border-radius: 9px;
  background: rgba(34,211,238,0.08); border: 1px solid rgba(34,211,238,0.18);
  color: #22d3ee; font-size: 0.76rem; font-weight: 600;
  transition: all 0.18s ease;
}
.btn-invite:hover { background: rgba(34,211,238,0.15); border-color: rgba(34,211,238,0.3); }

/* PROJECT HERO */
.project-hero {
  padding: 18px 24px; flex-shrink: 0;
  background: rgba(5, 8, 18, 0.6);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  display: flex; align-items: flex-end; justify-content: space-between; gap: 24px;
  animation: fadeUp 0.4s ease both;
}

@keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

.hero-left { flex: 1; min-width: 0; }
.hero-meta { display: flex; align-items: center; gap: 10px; margin-bottom: 6px; }
.hero-tag {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.6rem; font-weight: 500;
  text-transform: uppercase; letter-spacing: 0.12em;
  padding: 3px 8px; border-radius: 5px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08);
  color: var(--pc, #22d3ee);
}
.hero-deadline {
  display: flex; align-items: center; gap: 5px;
  font-size: 0.72rem; color: #475569;
}
.hero-title {
  font-family: 'Syne', sans-serif; font-size: 1.35rem; font-weight: 800;
  color: #f1f5f9; letter-spacing: -0.025em; line-height: 1.1; margin-bottom: 5px;
  overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
}
.hero-desc { font-size: 0.78rem; color: #475569; max-width: 460px; line-height: 1.45; }

.hero-stats {
  display: flex; align-items: center; gap: 20px; flex-shrink: 0;
}
.stat-card { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.stat-value { font-family: 'Syne', sans-serif; font-size: 1.4rem; font-weight: 800; line-height: 1; }
.stat-label { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: #334155; text-transform: uppercase; letter-spacing: 0.1em; }

.stat-progress { position: relative; display: flex; align-items: center; justify-content: center; }
.prog-center { position: absolute; display: flex; flex-direction: column; align-items: center; gap: 1px; }
.prog-pct { font-family: 'Syne', sans-serif; font-size: 0.85rem; font-weight: 800; color: #22d3ee; line-height: 1; }
.prog-label { font-family: 'JetBrains Mono', monospace; font-size: 0.48rem; color: #475569; text-transform: uppercase; letter-spacing: 0.08em; }

/* WORKSPACE BODY */
.ws-body {
  flex: 1; overflow: hidden; display: flex; flex-direction: column;
}

/* ══ KANBAN ══════════════════════════════════════════════ */
.kanban-wrap {
  flex: 1; overflow-x: auto; overflow-y: hidden; padding: 20px 24px;
}
.kanban-wrap::-webkit-scrollbar { height: 5px; }
.kanban-wrap::-webkit-scrollbar-track { background: transparent; }
.kanban-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 999px; }

.kanban-board {
  display: flex; gap: 14px;
  height: 100%; min-height: 0;
  min-width: max-content;
}

.kanban-col {
  width: 270px; flex-shrink: 0;
  background: rgba(8, 12, 24, 0.75);
  border: 1px solid rgba(255,255,255,0.055);
  border-radius: 16px;
  display: flex; flex-direction: column;
  overflow: hidden;
  transition: border-color 0.18s ease, box-shadow 0.18s ease;
}

.col-drag-over {
  border-color: rgba(34,211,238,0.35) !important;
  box-shadow: 0 0 0 1px rgba(34,211,238,0.15), 0 8px 32px rgba(0,0,0,0.3);
}

.col-accent { height: 3px; flex-shrink: 0; }

.col-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 14px 14px 10px;
}
.col-header-left { display: flex; align-items: center; gap: 8px; }
.col-indicator { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.col-title { font-family: 'Syne', sans-serif; font-size: 0.82rem; font-weight: 700; color: #cbd5e1; }
.col-count {
  font-family: 'JetBrains Mono', monospace; font-size: 0.65rem; font-weight: 500;
  padding: 2px 7px; border-radius: 5px;
  background: rgba(255,255,255,0.06); color: #64748b;
}
.col-add-btn {
  width: 24px; height: 24px; border-radius: 7px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  color: #475569; display: flex; align-items: center; justify-content: center;
  transition: all 0.18s ease;
}
.col-add-btn:hover { background: rgba(34,211,238,0.1); border-color: rgba(34,211,238,0.2); color: #22d3ee; }

.col-cards {
  flex: 1; overflow-y: auto; padding: 4px 10px 10px;
  display: flex; flex-direction: column; gap: 8px;
}
.col-cards::-webkit-scrollbar { width: 4px; }
.col-cards::-webkit-scrollbar-track { background: transparent; }
.col-cards::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 999px; }

.col-empty {
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 32px 12px;
  color: #1e293b; font-size: 0.75rem;
}

/* TASK CARD */
.task-card {
  background: rgba(12, 18, 36, 0.9);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 12px; padding: 12px;
  cursor: grab; transition: all 0.18s ease;
  animation: cardIn 0.25s ease both;
}
@keyframes cardIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }

.task-card:hover {
  border-color: rgba(255,255,255,0.12);
  background: rgba(16, 24, 44, 0.95);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.4);
}
.card-dragging { opacity: 0.4; transform: rotate(2deg) scale(0.97); cursor: grabbing; }

.card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px; }
.card-id { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: #334155; }

.card-priority {
  display: flex; align-items: center; gap: 4px;
  font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; font-weight: 500;
  padding: 2px 7px; border-radius: 5px;
  text-transform: capitalize;
}
.prio-dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
.prio-low    { background: rgba(52,211,153,0.1);  color: #34d399; border: 1px solid rgba(52,211,153,0.2);  }
.prio-low    .prio-dot { background: #34d399; }
.prio-medium { background: rgba(251,191,36,0.08); color: #fbbf24; border: 1px solid rgba(251,191,36,0.2);  }
.prio-medium .prio-dot { background: #fbbf24; }
.prio-high   { background: rgba(248,113,133,0.08);color: #f87171; border: 1px solid rgba(248,113,133,0.2); }
.prio-high   .prio-dot { background: #f87171; box-shadow: 0 0 5px rgba(248,113,133,0.5); }

.card-title { font-size: 0.82rem; font-weight: 600; color: #cbd5e1; line-height: 1.35; margin-bottom: 5px; }
.card-desc  { font-size: 0.72rem; color: #475569; line-height: 1.4; margin-bottom: 8px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }

.card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 10px; }
.card-tag {
  font-family: 'JetBrains Mono', monospace; font-size: 0.58rem;
  padding: 2px 6px; border-radius: 4px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.07); color: #64748b;
}

.card-bottom { display: flex; align-items: center; justify-content: space-between; }
.card-assignees { display: flex; align-items: center; }
.card-assignee {
  width: 22px; height: 22px; border-radius: 6px;
  background: var(--bg, #0891b2); color: #fff;
  font-size: 0.55rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  border: 2px solid #0c1224;
}
.card-meta { display: flex; align-items: center; gap: 8px; }
.card-meta-item { display: flex; align-items: center; gap: 3px; font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: #475569; }
.meta-overdue { color: #f87171 !important; }

/* INLINE ADD FORM */
.col-add-form { padding: 8px 10px; border-top: 1px solid rgba(255,255,255,0.04); }
.col-add-input {
  width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(34,211,238,0.3);
  border-radius: 8px; padding: 8px 10px; font-size: 0.8rem; color: #e2e8f0;
  outline: none; margin-bottom: 6px;
}
.col-add-input::placeholder { color: #334155; }
.col-add-actions { display: flex; gap: 6px; }
.col-add-confirm {
  padding: 5px 12px; border-radius: 7px;
  background: linear-gradient(135deg, #0891b2, #2563eb); border: none; color: #fff;
  font-size: 0.75rem; font-weight: 600; transition: all 0.18s;
}
.col-add-confirm:hover { opacity: 0.9; }
.col-add-cancel {
  padding: 5px 10px; border-radius: 7px;
  background: transparent; border: 1px solid rgba(255,255,255,0.07); color: #475569;
  font-size: 0.75rem; font-weight: 500; transition: all 0.18s;
}
.col-add-cancel:hover { color: #94a3b8; border-color: rgba(255,255,255,0.12); }

/* ══ LIST VIEW ═══════════════════════════════════════════ */
.list-wrap { flex: 1; overflow-y: auto; padding: 16px 24px; }
.list-wrap::-webkit-scrollbar { width: 5px; }
.list-wrap::-webkit-scrollbar-track { background: transparent; }
.list-wrap::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.07); border-radius: 999px; }

.list-header-row {
  display: grid;
  grid-template-columns: 1fr 120px 100px 120px 90px;
  gap: 12px; padding: 8px 14px; margin-bottom: 4px;
  font-family: 'JetBrains Mono', monospace; font-size: 0.6rem;
  text-transform: uppercase; letter-spacing: 0.1em; color: #334155;
}

.list-row {
  display: grid; grid-template-columns: 1fr 120px 100px 120px 90px;
  gap: 12px; padding: 12px 14px; border-radius: 10px;
  background: rgba(8, 12, 24, 0.7); border: 1px solid rgba(255,255,255,0.045);
  margin-bottom: 5px; align-items: center;
  transition: all 0.18s ease; animation: cardIn 0.25s ease both;
}
.list-row:hover { background: rgba(14, 20, 40, 0.9); border-color: rgba(255,255,255,0.08); transform: translateX(2px); }
.list-row-done { opacity: 0.45; }

.lr-task { display: flex; align-items: center; gap: 10px; min-width: 0; }
.lr-code { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: #334155; flex-shrink: 0; }
.lr-title { font-size: 0.82rem; font-weight: 500; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.lr-assignee { display: flex; align-items: center; }
.lr-priority, .lr-status, .lr-due { display: flex; align-items: center; }

.status-chip {
  font-family: 'JetBrains Mono', monospace; font-size: 0.62rem; font-weight: 500;
  padding: 3px 8px; border-radius: 5px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  color: var(--sc, #94a3b8);
}

/* ══════════════════════════════════════════════════════════
   RIGHT PANEL
══════════════════════════════════════════════════════════ */
.right-panel {
  width: 290px; flex-shrink: 0;
  background: rgba(6, 9, 20, 0.92);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255,255,255,0.05);
  display: flex; flex-direction: column;
  transition: width 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}
.panel-collapsed { width: 36px; }

.rp-toggle {
  position: absolute; top: 50%; left: -14px;
  transform: translateY(-50%);
  width: 26px; height: 26px; border-radius: 50%;
  background: rgba(8, 12, 24, 0.95); border: 1px solid rgba(255,255,255,0.08);
  display: flex; align-items: center; justify-content: center;
  color: #475569; cursor: pointer; z-index: 10;
  transition: all 0.18s ease;
}
.rp-toggle:hover { color: #22d3ee; border-color: rgba(34,211,238,0.25); }

.rp-tabs {
  display: flex; gap: 1px; padding: 14px 12px 10px;
  border-bottom: 1px solid rgba(255,255,255,0.04);
  flex-shrink: 0;
}
.rp-tab {
  flex: 1; padding: 6px 4px; border-radius: 7px;
  font-size: 0.74rem; font-weight: 600; color: #475569;
  background: none; border: none;
  transition: all 0.18s ease; position: relative;
}
.rp-tab:hover { color: #94a3b8; }
.rp-tab-active { background: rgba(255,255,255,0.05); color: #e2e8f0; }
.rp-badge {
  display: inline-flex; align-items: center; justify-content: center;
  width: 16px; height: 16px; border-radius: 50%;
  background: linear-gradient(135deg, #0891b2, #2563eb); color: #fff;
  font-size: 0.55rem; font-weight: 700; margin-left: 4px;
}

.rp-scroll {
  flex: 1; overflow-y: auto; padding: 10px 12px;
}
.rp-scroll::-webkit-scrollbar { width: 3px; }
.rp-scroll::-webkit-scrollbar-track { background: transparent; }
.rp-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 999px; }

/* Activity */
.activity-feed { display: flex; flex-direction: column; gap: 1px; }
.activity-item {
  display: flex; align-items: flex-start; gap: 9px;
  padding: 10px 8px; border-radius: 8px;
  transition: background 0.18s;
}
.activity-item:hover { background: rgba(255,255,255,0.03); }

.act-avatar {
  width: 26px; height: 26px; border-radius: 7px;
  background: var(--bg, #0891b2); color: #fff;
  font-size: 0.6rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.act-body { flex: 1; min-width: 0; }
.act-text { font-size: 0.75rem; color: #94a3b8; line-height: 1.4; }
.act-text strong { color: #cbd5e1; font-weight: 600; }
.act-time { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; color: #334155; }
.act-icon {
  width: 18px; height: 18px; border-radius: 5px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.act-icon-done { background: rgba(52,211,153,0.12); color: #34d399; }
.act-icon-add  { background: rgba(34,211,238,0.1);  color: #22d3ee; }
.act-icon-move { background: rgba(251,191,36,0.08); color: #fbbf24; }
.act-icon-edit { background: rgba(167,139,250,0.1); color: #a78bfa; }

/* Chat */
.rp-chat { flex: 1; display: flex; flex-direction: column; min-height: 0; overflow: hidden; }
.chat-messages {
  flex: 1; overflow-y: auto; padding: 10px 12px;
  display: flex; flex-direction: column; gap: 12px;
}
.chat-messages::-webkit-scrollbar { width: 3px; }
.chat-messages::-webkit-scrollbar-track { background: transparent; }
.chat-messages::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.06); border-radius: 999px; }

.chat-msg { display: flex; gap: 8px; align-items: flex-end; }
.msg-me { flex-direction: row-reverse; }
.msg-avatar {
  width: 26px; height: 26px; border-radius: 7px;
  background: var(--bg, #0891b2); color: #fff;
  font-size: 0.58rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.msg-bubble-wrap { display: flex; flex-direction: column; gap: 3px; max-width: 78%; }
.msg-name { font-size: 0.65rem; font-weight: 600; color: #64748b; padding: 0 4px; }
.msg-me .msg-name { text-align: right; }
.msg-bubble {
  padding: 8px 11px; border-radius: 10px;
  font-size: 0.78rem; line-height: 1.45; word-break: break-word;
}
.msg-other .msg-bubble {
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.06); color: #cbd5e1;
  border-radius: 10px 10px 10px 2px;
}
.msg-me .msg-bubble {
  background: linear-gradient(135deg, rgba(8,145,178,0.35), rgba(37,99,235,0.35));
  border: 1px solid rgba(34,211,238,0.18); color: #e2e8f0;
  border-radius: 10px 10px 2px 10px;
}
.msg-time { font-family: 'JetBrains Mono', monospace; font-size: 0.55rem; color: #334155; padding: 0 4px; }
.msg-me .msg-time { text-align: right; }

.chat-input-wrap {
  display: flex; gap: 8px; padding: 10px 12px;
  border-top: 1px solid rgba(255,255,255,0.04); flex-shrink: 0;
}
.chat-input {
  flex: 1; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 9px; padding: 9px 12px; font-size: 0.78rem; color: #e2e8f0; outline: none;
  transition: all 0.18s;
}
.chat-input:focus { border-color: rgba(34,211,238,0.3); background: rgba(6,182,212,0.04); }
.chat-input::placeholder { color: #2d3748; }
.chat-send {
  width: 34px; height: 34px; border-radius: 9px;
  background: linear-gradient(135deg, #0891b2, #2563eb); border: none; color: #fff;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s; box-shadow: 0 2px 8px rgba(8,145,178,0.3);
}
.chat-send:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(8,145,178,0.45); }
.chat-send:disabled { opacity: 0.35; cursor: not-allowed; }

/* Members */
.members-list { display: flex; flex-direction: column; gap: 4px; }
.member-row {
  display: flex; align-items: center; gap: 10px;
  padding: 9px 8px; border-radius: 9px;
  transition: background 0.18s;
}
.member-row:hover { background: rgba(255,255,255,0.03); }
.member-ava {
  width: 32px; height: 32px; border-radius: 9px;
  background: var(--bg, #0891b2); color: #fff;
  font-size: 0.68rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0; position: relative;
}
.member-status-dot {
  position: absolute; bottom: -2px; right: -2px;
  width: 8px; height: 8px; border-radius: 50%;
  border: 2px solid #060810;
}
.dot-online  { background: #34d399; box-shadow: 0 0 5px #34d399; }
.dot-offline { background: #334155; }
.member-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1px; }
.member-name { font-size: 0.78rem; font-weight: 600; color: #cbd5e1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.member-role { font-size: 0.68rem; color: #475569; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.member-badge { font-family: 'JetBrains Mono', monospace; font-size: 0.58rem; font-weight: 500; padding: 2px 7px; border-radius: 5px; flex-shrink: 0; }
.badge-on  { background: rgba(52,211,153,0.1);  color: #34d399; border: 1px solid rgba(52,211,153,0.2);  }
.badge-off { background: rgba(51,65,85,0.3);    color: #475569; border: 1px solid rgba(51,65,85,0.5);   }

/* ══════════════════════════════════════════════════════════
   MODALS
══════════════════════════════════════════════════════════ */
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(3, 5, 14, 0.75); backdrop-filter: blur(8px);
  display: flex; align-items: center; justify-content: center;
  z-index: 100; padding: 20px;
}
.modal-box {
  background: linear-gradient(160deg, #0d1628, #070c1a);
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 20px; width: 100%; max-width: 520px;
  box-shadow: 0 40px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.05);
  overflow: hidden;
}
.modal-sm { max-width: 380px; }

.modal-head {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 24px; border-bottom: 1px solid rgba(255,255,255,0.055);
  background: rgba(255,255,255,0.02);
}
.modal-title { font-family: 'Syne', sans-serif; font-size: 1rem; font-weight: 800; color: #f1f5f9; letter-spacing: -0.02em; }
.modal-close {
  width: 28px; height: 28px; border-radius: 8px;
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); color: #475569;
  display: flex; align-items: center; justify-content: center; transition: all 0.18s;
}
.modal-close:hover { color: #f87171; border-color: rgba(248,113,133,0.25); background: rgba(248,113,133,0.07); }

.modal-body { padding: 22px 24px; display: flex; flex-direction: column; gap: 16px; }

.mf-field { display: flex; flex-direction: column; gap: 6px; }
.mf-label { font-size: 0.78rem; font-weight: 600; color: #94a3b8; }
.req { color: #f87171; }
.mf-input, .mf-textarea, .mf-select {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px; padding: 10px 13px; font-size: 0.82rem; color: #e2e8f0; outline: none;
  transition: all 0.18s;
}
.mf-input:focus, .mf-textarea:focus, .mf-select:focus {
  border-color: rgba(34,211,238,0.35); background: rgba(6,182,212,0.04);
  box-shadow: 0 0 0 3px rgba(34,211,238,0.07);
}
.mf-input::placeholder, .mf-textarea::placeholder { color: #2d3748; }
.mf-select { appearance: none; cursor: pointer; }
.mf-textarea { resize: vertical; min-height: 80px; line-height: 1.5; }
.mf-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

.prio-btns { display: flex; gap: 6px; }
.prio-btn {
  flex: 1; display: flex; align-items: center; justify-content: center; gap: 5px;
  padding: 8px 6px; border-radius: 8px;
  font-size: 0.75rem; font-weight: 600;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); color: #64748b;
  text-transform: capitalize; transition: all 0.18s;
}
.prio-low.prio-active    { background: rgba(52,211,153,0.1);  border-color: rgba(52,211,153,0.3);  color: #34d399; }
.prio-medium.prio-active { background: rgba(251,191,36,0.08); border-color: rgba(251,191,36,0.28); color: #fbbf24; }
.prio-high.prio-active   { background: rgba(248,113,133,0.08);border-color: rgba(248,113,133,0.28);color: #f87171; }

.assignee-picker { display: flex; flex-wrap: wrap; gap: 8px; }
.ap-avatar {
  width: 36px; height: 36px; border-radius: 10px;
  background: var(--bg, #0891b2); color: #fff;
  font-size: 0.7rem; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; border: 2px solid transparent;
  transition: all 0.18s; opacity: 0.45;
}
.ap-avatar:hover { opacity: 0.8; transform: translateY(-2px); }
.ap-selected { opacity: 1; border-color: #22d3ee; box-shadow: 0 0 10px rgba(34,211,238,0.3); transform: translateY(-2px); }

.invite-link-box {
  background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px; padding: 12px;
  display: flex; flex-direction: column; gap: 8px;
}
.invite-link-label { font-family: 'JetBrains Mono', monospace; font-size: 0.6rem; color: #475569; text-transform: uppercase; letter-spacing: 0.1em; }
.invite-link-row { display: flex; align-items: center; gap: 8px; }
.invite-link-text { flex: 1; font-family: 'JetBrains Mono', monospace; font-size: 0.68rem; color: #64748b; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.invite-copy {
  width: 28px; height: 28px; border-radius: 7px;
  background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #64748b;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.18s; flex-shrink: 0;
}
.invite-copy:hover { color: #22d3ee; border-color: rgba(34,211,238,0.25); }

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
  padding: 9px 20px; border-radius: 9px;
  background: linear-gradient(135deg, #0891b2, #2563eb); border: none; color: #fff;
  font-size: 0.8rem; font-weight: 700;
  transition: all 0.2s; box-shadow: 0 4px 16px rgba(8,145,178,0.35);
}
.btn-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 22px rgba(8,145,178,0.5); }
.btn-submit:disabled { opacity: 0.4; cursor: not-allowed; }

/* Modal Transition */
.modal-enter-active { animation: modalIn 0.24s cubic-bezier(0.34, 1.56, 0.64, 1); }
.modal-leave-active { animation: modalOut 0.16s ease forwards; }
@keyframes modalIn  { from { opacity: 0; transform: scale(0.9);  } to { opacity: 1; transform: scale(1);   } }
@keyframes modalOut { from { opacity: 1; transform: scale(1);    } to { opacity: 0; transform: scale(0.94); } }
</style>