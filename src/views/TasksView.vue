<template>
  <div class="app-shell">

    <AppSidebar :user="user" :user-initial="userInitial" @logout="handleLogout" />

    <!-- MAIN -->
    <main class="main-content">

      <AppHeader
        :user="user"
        :user-initial="userInitial"
        :current-date="currentDate"
      />

      <div class="content-body">
        <div class="content-inner">
          <section class="page-intro">
            <div class="intro-text">
              <p class="intro-eyebrow">Task Workspace</p>
              <h2 class="intro-title">Kelola daftar tugas harianmu</h2>
              <p class="intro-desc">
                Pantau progres, tandai task selesai, dan atur prioritas dengan cepat.
              </p>
            </div>

            <!-- Tombol Anggota -->
            <button class="btn-members" @click="openMembers">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
              Anggota
            </button>
          </section>

          <TasksStats
            :completed="completedTasks"
            :pending="pendingTasks"
            :progress="progressPercentage"
          />

          <TasksListPanel
            :tasks="tasks"
            :loading="loading"
            :is-leader="isLeader"
            @add-task="goToAddTask"
            @toggle-task="toggleTask"
            @edit-task="goToEditTask"
            @delete-task="handleDeleteTask"
          />
        </div>
      </div>

    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue"
import AppSidebar from "@/components/AppSidebar.vue"
import AppHeader from "@/components/AppHeader.vue"
import TasksStats from "@/components/TasksStats.vue"
import TasksListPanel from "@/components/TasksListPanel.vue"
import { useTasks } from "@/composables/useTasks"

const {
    tasks,
    loading,
    user,
    userInitial,
    currentDate,
    completedTasks,
    pendingTasks,
    progressPercentage,
    isLeader,
    fetchData,
    toggleTask,
    goToAddTask,
    goToEditTask,
    handleDeleteTask,
    handleLogout,
} = useTasks()

onMounted(fetchData)

function openMembers() {
  // Ganti dengan logika kamu: buka modal, navigasi ke halaman, dsb.
  console.log("Buka panel anggota")
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.app-shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: #080c14;
  font-family: 'Sora', sans-serif;
  color: #e2e8f0;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.content-body {
  padding: 28px 32px;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  flex: 1;
}

.content-inner {
  width: 100%;
  max-width: 1180px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.page-intro {
  padding: 16px 18px;
  border-radius: 16px;
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(99, 102, 241, 0.08));
  border: 1px solid rgba(148, 163, 184, 0.14);

  /* Ubah menjadi flex agar tombol sejajar di kanan */
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.intro-text {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.intro-eyebrow {
  margin: 0 0 4px;
  font-size: 0.68rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #38bdf8;
  font-weight: 600;
}

.intro-title {
  margin: 0;
  font-size: 1.15rem;
  color: #f1f5f9;
  font-weight: 700;
}

.intro-desc {
  margin: 6px 0 0;
  font-size: 0.82rem;
  color: #94a3b8;
}

/* ── Tombol Anggota ── */
.btn-members {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 9px 18px;
  border-radius: 10px;
  border: 1px solid rgba(56, 189, 248, 0.35);
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  font-family: 'Sora', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.2s, border-color 0.2s, transform 0.15s;
}

.btn-members:hover {
  background: rgba(56, 189, 248, 0.2);
  border-color: rgba(56, 189, 248, 0.6);
  transform: translateY(-1px);
}

.btn-members:active {
  transform: translateY(0);
}

@media (max-width: 900px) {
  .content-body {
    padding: 16px;
  }

  .page-intro {
    padding: 14px;
  }
}
</style>