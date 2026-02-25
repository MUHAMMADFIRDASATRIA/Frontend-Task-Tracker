<template>
  <div class="app-shell">
    <AppSidebar :user="user" :user-initial="userInitial" @logout="handleLogout" />

    <main class="main-content">
      <AppHeader
        :user="user"
        :user-initial="userInitial"
        :current-date="currentDate"
      />

      <div class="content-body">
        <!-- STATS -->
        <div class="stats-grid">
          <StatCard title="Total Proyek" :value="totalProjects" icon="folder" color="blue" />
          <StatCard title="Total Tugas" :value="totalTasks" icon="list" color="purple" />
          <StatCard title="Selesai" :value="completedTasks" icon="check" color="green" />
          <StatCard title="Pending" :value="pendingTasks" icon="clock" color="orange" />
        </div>

        <!-- PROGRESS -->
        <ProgressCard
          v-if="totalTasks > 0"
          :completion-percent="completionPercent"
          :completed-tasks="completedTasks"
          :total-tasks="totalTasks"
        />

        <!-- TABLE -->
        <TaskTable :tasks="tasks" :loading="loading" />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import AppSidebar from '@/components/AppSidebar.vue'
import AppHeader from '@/components/AppHeader.vue'
import StatCard from '@/components/StatCard.vue'
import ProgressCard from '@/components/ProgressCard.vue'
import TaskTable from '@/components/TaskTable.vue'
import { useDashboard } from '@/composables/useDashboard'

const router = useRouter()

const {
  user,
  tasks,
  totalProjects,
  totalTasks,
  completedTasks,
  pendingTasks,
  loading,
  userInitial,
  completionPercent,
  currentDate,
  loadDashboard,
  handleLogout,
} = useDashboard()

onMounted(loadDashboard)
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

/* ─── Only layout styles remain here ─── */

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
}

.content-body {
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow: hidden;
  flex: 1;
  min-height: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}
</style>
