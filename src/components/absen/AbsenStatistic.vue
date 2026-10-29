<template>
  <section class="stats-grid">
    <div class="stat-pill hadir">
      <span class="num">{{ stats.hadir }}</span>
      <span class="lbl">✅ Hadir</span>
    </div>
    <div class="stat-pill terlambat">
      <span class="num">{{ stats.terlambat }}</span>
      <span class="lbl">🕐 Telat</span>
    </div>
    <div class="stat-pill izin">
      <span class="num">{{ stats.izin }}</span>
      <span class="lbl">📋 Izin</span>
    </div>
    <div class="stat-pill sakit">
      <span class="num">{{ stats.sakit }}</span>
      <span class="lbl">🤒 Sakit</span>
    </div>
    <div class="stat-pill dispensasi">
      <span class="num">{{ stats.dispensasi }}</span>
      <span class="lbl">🎖️ Dispen</span>
    </div>
    <div class="stat-pill alpa">
      <span class="num">{{ stats.alpa }}</span>
      <span class="lbl">❌ Alpa</span>
    </div>
    <div class="stat-pill belum">
      <span class="num">{{ stats.belum }}</span>
      <span class="lbl">⏳ Belum</span>
    </div>
  </section>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.stat-pill {
  border: var(--border-sm);
  border-radius: 8px;
  padding: 0.5rem 0.3rem;
  text-align: center;
  box-shadow: 2px 2px 0px var(--black);
  display: flex;
  flex-direction: column;
}

.stat-pill .num {
  font-size: 1.2rem;
  font-weight: 900;
  line-height: 1.1;
}

.stat-pill .lbl {
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
}

.hadir      { background: #d1fae5; color: #065f46; }
.terlambat  { background: #ffedd5; color: #9a3412; }
.izin       { background: #fef3c7; color: #92400e; }
.sakit      { background: #fee2e2; color: #991b1b; }
.dispensasi { background: #ede9fe; color: #5b21b6; }
.alpa       { background: #e5e7eb; color: #1f2937; }
.belum      { background: var(--white); color: var(--gray-dark); }

@media (min-width: 640px) {
  .stats-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}
</style>