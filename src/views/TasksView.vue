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

      <TasksStats
        :completed="completedTasks"
        :pending="pendingTasks"
        :progress="progressPercentage"
      />

      <TasksListPanel
        :tasks="tasks"
        :loading="loading"
        @add-task="goToAddTask"
        @toggle-task="toggleTask"
        @edit-task="goToEditTask"
        @delete-task="handleDeleteTask"
      />

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
    fetchData,
    toggleTask,
    goToAddTask,
    goToEditTask,
    handleDeleteTask,
    handleLogout,
} = useTasks()

onMounted(fetchData)
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
  padding: 32px 36px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  overflow-y: auto;
  flex: 1;
}

@media (max-width: 900px) {
  .content-body {
    padding: 20px;
  }
}
</style>