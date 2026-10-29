<template>
  <section class="summary-grid">
    <div class="neo-card stat-card bg-blue-soft">
      <div class="stat-icon"><AppIcon name="student" size="1.6rem" /></div>
      <div class="stat-info">
        <span class="stat-value">{{ summary?.total_siswa_aktif ?? 0 }}</span>
        <span class="stat-label">Siswa Aktif</span>
      </div>
    </div>

    <div class="neo-card stat-card bg-yellow-soft">
      <div class="stat-icon"><AppIcon name="class" size="1.6rem" /></div>
      <div class="stat-info">
        <span class="stat-value">{{ summary?.total_kelas_aktif ?? 0 }}</span>
        <span class="stat-label">Rombel Kelas</span>
      </div>
    </div>

    <div class="neo-card stat-card bg-green-soft">
      <div class="stat-icon"><AppIcon name="teacher" size="1.6rem" /></div>
      <div class="stat-info">
        <span class="stat-value">{{ summary?.total_guru_aktif ?? 0 }}</span>
        <span class="stat-label">Guru Pengajar</span>
      </div>
    </div>

    <div class="neo-card stat-card bg-purple-soft">
      <div class="stat-icon"><AppIcon name="book" size="1.6rem" /></div>
      <div class="stat-info">
        <span class="stat-value">{{ jurnalHariIni ?? 0 }}</span>
        <span class="stat-label">Jurnal Hari Ini</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import AppIcon from '@/components/ui/AppIcon.vue'

defineProps({
  summary: {
    type: Object,
    default: () => ({}),
  },
  jurnalHariIni: {
    type: Number,
    default: 0,
  },
})
</script>

<style scoped>
.summary-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-bottom: 1.25rem;
}

.stat-card {
  padding: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: var(--shadow-sm);
}

.bg-blue-soft   { background: #eff6ff; }
.bg-yellow-soft { background: #fefce8; }
.bg-green-soft  { background: #ecfdf5; }
.bg-purple-soft { background: #f5f3ff; }

.stat-icon {
  width: 44px;
  height: 44px;
  background: var(--white);
  border: var(--border-sm);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 2px 2px 0px var(--black);
  flex-shrink: 0;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 900;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  color: var(--gray-dark);
}

@media (min-width: 768px) {
  .summary-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>