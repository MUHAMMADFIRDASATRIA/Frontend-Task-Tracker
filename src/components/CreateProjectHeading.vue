<template>
  <div class="page-heading">
    <div>
      <p class="page-eyebrow">{{ eyebrow }}</p>
      <h1 class="page-title">{{ title }}</h1>
      <p class="page-sub">{{ subtitle }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    eyebrow?: string
    title?: string
    subtitle?: string
  }>(),
  {
    eyebrow: 'Proyek Baru',
    title: 'Buat Proyek',
    subtitle: 'Isi formulir di bawah untuk memulai inisialisasi proyek Anda.',
  },
)
</script>

<style scoped>
.page-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
}

.page-eyebrow {
  font-size: 0.68rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: #0891b2;
  margin: 0 0 4px;
}

.page-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #f8fafc;
  letter-spacing: -0.03em;
  margin: 0 0 5px;
  line-height: 1.1;
}

.page-sub {
  font-size: 0.8rem;
  color: #475569;
  margin: 0;
}

.btn-cancel {
  display: flex;
  align-items: center;
  gap: 7px;
  font-size: 0.8rem;
  font-weight: 600;
  color: #334155;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.06);
  background: rgba(255,255,255,0.02);
  transition: all 0.15s;
  white-space: nowrap;
}

.btn-cancel:hover {
  color: #94a3b8;
  border-color: rgba(255,255,255,0.1);
}
</style>
