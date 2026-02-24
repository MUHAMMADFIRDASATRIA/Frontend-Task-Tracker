<script setup lang="ts">
interface FilterTab {
  label: string
  value: string
}

const props = defineProps<{
  search: string
  filterStatus: string
  filterTabs: FilterTab[]
  count: number
}>()

const emit = defineEmits<{
  (e: 'update:search', value: string): void
  (e: 'update:filterStatus', value: string): void
}>()
</script>

<template>
  <div class="toolbar">
    <div class="search-wrapper">
      <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2" />
        <path
          d="M21 21l-4.35-4.35"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
        />
      </svg>
      <input
        :value="search"
        @input="emit('update:search', ($event.target as HTMLInputElement).value)"
        type="text"
        placeholder="Cari proyek..."
        class="search-input"
      />
    </div>

    <div class="filter-tabs">
      <button
        v-for="tab in filterTabs"
        :key="tab.value"
        @click="emit('update:filterStatus', tab.value)"
        :class="['filter-tab', { active: filterStatus === tab.value }]"
      >
        {{ tab.label }}
      </button>
    </div>

    <span class="result-count">{{ count }} proyek</span>
  </div>
</template>

<style scoped>
.toolbar {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.search-wrapper {
  position: relative;
  flex: 1;
  min-width: 200px;
  max-width: 320px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #475569;
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 9px 12px 9px 36px;
  background: #0d1420;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  color: #e2e8f0;
  font-family: 'Sora', sans-serif;
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: rgba(99, 102, 241, 0.5);
}

.search-input::placeholder {
  color: #475569;
}

.filter-tabs {
  display: flex;
  gap: 4px;
  background: #0d1420;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 4px;
}

.filter-tab {
  padding: 6px 16px;
  border-radius: 7px;
  font-size: 0.8rem;
  font-family: 'Sora', sans-serif;
  font-weight: 500;
  color: #475569;
  cursor: pointer;
  transition: all 0.2s;
  background: transparent;
  border: none;
}

.filter-tab:hover {
  color: #94a3b8;
}

.filter-tab.active {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
}

.result-count {
  font-size: 0.75rem;
  color: #475569;
  margin-left: auto;
  font-family: 'JetBrains Mono', monospace;
}
</style>
