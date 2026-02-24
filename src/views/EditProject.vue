<template>
  <EditProjectShell
    :user-name="user.name || 'Pengguna'"
    :user-initial="userInitial"
    @logout="handleLogout"
  >
    <EditProjectHeading />

    <EditProjectFormCard
      :form="form"
      :loading="loading"
      :alert-message="alertMessage"
      :alert-success="alertSuccess"
      @submit="submitEdit"
    />
  </EditProjectShell>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import EditProjectShell from '@/components/EditProjectShell.vue'
import EditProjectHeading from '@/components/EditProjectHeading.vue'
import EditProjectFormCard from '@/components/EditProjectFormCard.vue'
import { useEditProject } from '@/composables/useEditProject'

const route = useRoute()
const projectId = String(route.params.id ?? '')

const {
  user,
  userInitial,
  loading,
  form,
  alertMessage,
  alertSuccess,
  loadProject,
  loadProfile,
  handleSubmit,
  handleLogout,
} = useEditProject()

onMounted(async () => {
  await loadProfile()
  if (projectId) {
    await loadProject(projectId)
  }
})

const submitEdit = () => {
  if (!projectId) return
  handleSubmit(projectId)
}
</script>
