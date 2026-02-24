<template>
	<CreateTaskShell
		:user="user"
		:user-initial="userInitial"
		:current-date="currentDate"
		@logout="handleLogout"
	>
		<div class="page-header">
			<div class="page-title-wrap">
				<div class="page-eyebrow">
					<span class="eyebrow-dot"></span>
					<span>Form Edit</span>
				</div>
				<h1 class="page-title">Edit <span class="title-accent">Task</span></h1>
				<p class="page-desc">Perbarui detail task agar progres pekerjaan tetap sesuai kebutuhan.</p>
			</div>
			<button @click="goBack" class="btn-back">
				<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round">
					<polyline points="15 18 9 12 15 6"/>
				</svg>
				Kembali
			</button>
		</div>

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
import { useEditTask } from '@/composables/useEditTask'
import CreateTaskShell from '@/components/CreateTaskShell.vue'
import CreateTaskParentCard from '@/components/CreateTaskParentCard.vue'
import CreateTaskFormCard from '@/components/CreateTaskFormCard.vue'
import CreateTaskSuccessModal from '@/components/CreateTaskSuccessModal.vue'

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
	loadTask,
    submitForm,
    goBack,
    handleLogout,
} = useEditTask()

onMounted(async () => {
  await fetchData()
	await loadTask()
})

</script>

<style scoped>
.page-header {
	display: flex;
	align-items: flex-start;
	justify-content: space-between;
	gap: 16px;
}

.page-title-wrap {
	display: flex;
	flex-direction: column;
	gap: 6px;
}

.page-eyebrow {
	display: flex;
	align-items: center;
	gap: 6px;
	font-family: 'JetBrains Mono', monospace;
	font-size: 0.62rem;
	font-weight: 500;
	letter-spacing: 0.12em;
	text-transform: uppercase;
	color: #6366f1;
}

.eyebrow-dot {
	width: 5px;
	height: 5px;
	border-radius: 50%;
	background: #6366f1;
	box-shadow: 0 0 7px #6366f1;
	animation: blink 2.5s infinite;
}

@keyframes blink {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.4;
	}
}

.page-title {
	font-family: 'Sora', sans-serif;
	font-size: 1.75rem;
	font-weight: 700;
	color: #f1f5f9;
	letter-spacing: -0.02em;
	line-height: 1;
	margin: 0;
}

.title-accent {
	background: linear-gradient(135deg, #818cf8, #60a5fa);
	-webkit-background-clip: text;
	-webkit-text-fill-color: transparent;
	background-clip: text;
}

.page-desc {
	font-size: 0.82rem;
	color: #64748b;
	max-width: 380px;
	margin: 0;
}

.btn-back {
	display: inline-flex;
	align-items: center;
	gap: 6px;
	padding: 9px 16px;
	border-radius: 10px;
	background: rgba(255, 255, 255, 0.04);
	border: 1px solid rgba(255, 255, 255, 0.07);
	color: #94a3b8;
	font-family: 'Sora', sans-serif;
	font-size: 0.8rem;
	font-weight: 600;
	cursor: pointer;
	transition: all 0.18s ease;
	white-space: nowrap;
	flex-shrink: 0;
}

.btn-back:hover {
	background: rgba(255, 255, 255, 0.07);
	color: #e2e8f0;
	border-color: rgba(255, 255, 255, 0.12);
}

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
