<template>
  <CreateProjectShell :user-name="user.name || 'Pengguna'" :user-initial="userInitial">
    <CreateProjectHeading />

    <CreateProjectFormCard
      :form="form"
      :loading="loading"
      :alert-message="alertMessage"
      :alert-success="alertSuccess"
      @submit="handleSubmit"
    />
  </CreateProjectShell>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import CreateProjectShell from '@/components/CreateProjectShell.vue'
import CreateProjectHeading from '@/components/CreateProjectHeading.vue'
import CreateProjectFormCard from '@/components/CreateProjectFormCard.vue'
import { useCreateProject } from '@/composables/useCreateProject'

const {
  form,
  user,
  loading,
  userInitial,
  alertMessage,
  alertSuccess,
  handleSubmit,
  loadProfile,
} = useCreateProject()

onMounted(loadProfile)

</script>
