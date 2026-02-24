<template>
  <CreateTaskShell
    :user="user"
    :user-initial="userInitial"
    :current-date="currentDate"
    @logout="handleLogout"
  >
    <CreateTaskHeading @back="goBack" />

    <CreateTaskParentCard :parent-task-title="parentTaskTitle" />

    <CreateTaskFormCard
      :form="form"
      :eror="eror"
      :submitting="submitting"
      :priorities="priorities"
      @submit="submitForm"
      @cancel="goBack"
      @update:form="Object.assign(form, $event)"
    />

    <p class="footer-tip">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      Setiap task yang diselesaikan akan berkontribusi pada progres proyek.
    </p>
  </CreateTaskShell>

  <CreateTaskSuccessModal :show="showSuccess" @close="goBack" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import CreateTaskShell from '@/components/CreateTaskShell.vue'
import CreateTaskHeading from '@/components/CreateTaskHeading.vue'
import CreateTaskParentCard from '@/components/CreateTaskParentCard.vue'
import CreateTaskFormCard from '@/components/CreateTaskFormCard.vue'
import CreateTaskSuccessModal from '@/components/CreateTaskSuccessModal.vue'
import { useCreateTask } from '@/composables/useCreateTask'

const {
    user,
    userInitial,
    currentDate,
    parentTaskTitle,
    form,
    eror,
    submitting,
    priorities,
    showSuccess,
    fetchData,
    submitForm,
    goBack,
    handleLogout,
} = useCreateTask()

onMounted(fetchData)
</script>

<style scoped>
.footer-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #475569;
  font-family: 'Sora', sans-serif;
  text-align: center;
}
</style>
