<template>
  <div class="page-heading">
    <div>
      <p class="page-eyebrow">Edit Proyek</p>
      <h1 class="page-title">Ubah Detail Proyek</h1>
      <p class="page-sub">Perbarui informasi proyek Anda sesuai kebutuhan terbaru.</p>
    </div>

    <RouterLink to="/projects" class="btn-cancel">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
      </svg>
      Batal
    </RouterLink>
  </div>
</template>

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
