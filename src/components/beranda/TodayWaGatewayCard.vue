<template>
  <section class="neo-card wa-card">
    <div class="wa-header">
      <div>
        <h3 class="wa-title">💬 Status WhatsApp Gateway (Fonnte) Hari Ini</h3>
        <p class="wa-subtitle">Laporan pengiriman otomatis ke nomor orang tua/wali siswa</p>
      </div>
      <button
        type="button"
        class="neo-btn neo-btn-green btn-sm"
        @click="$router.push('/notifikasi-wa')"
      >
        Lihat Detail Log →
      </button>
    </div>

    <div class="wa-stats-row">
      <div class="wa-pill success">
        <span class="wa-num">{{ waStats?.berhasil ?? 0 }}</span>
        <span class="wa-lbl">✅ Berhasil Terkirim</span>
      </div>

      <div class="wa-pill pending">
        <span class="wa-num">{{ waStats?.pending ?? 0 }}</span>
        <span class="wa-lbl">⏳ Pending / Antre</span>
      </div>

      <div class="wa-pill failed">
        <span class="wa-num">{{ waStats?.gagal ?? 0 }}</span>
        <span class="wa-lbl">❌ Gagal Kirim</span>
      </div>
    </div>

    <div v-if="(waStats?.gagal ?? 0) > 0" class="wa-alert">
      ⚠️ Terdapat <strong>{{ waStats.gagal }} pesan gagal terkirim</strong> hari ini. Silakan buka menu <strong>Log WA</strong> untuk melakukan kirim ulang (Resend).
    </div>
  </section>
</template>

<script setup>
defineProps({
  waStats: {
    type: Object,
    default: () => ({}),
  },
})
</script>

<style scoped>
.wa-card {
  background: linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%);
}

.wa-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.wa-title {
  font-size: 1rem;
  font-weight: 900;
  color: #065f46;
}

.wa-subtitle {
  font-size: 0.78rem;
  color: var(--gray-dark);
  font-weight: 600;
}

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.75rem;
}

.wa-stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.6rem;
}

.wa-pill {
  background: var(--white);
  border: var(--border-sm);
  border-radius: 8px;
  padding: 0.7rem 0.5rem;
  text-align: center;
  box-shadow: 2px 2px 0px var(--black);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.wa-num {
  font-size: 1.35rem;
  font-weight: 900;
}

.wa-lbl {
  font-size: 0.7rem;
  font-weight: 800;
}

.wa-pill.success { border-color: #059669; color: #065f46; }
.wa-pill.pending { border-color: #d97706; color: #92400e; }
.wa-pill.failed  { border-color: #dc2626; color: #991b1b; }

.wa-alert {
  margin-top: 0.85rem;
  padding: 0.65rem 0.85rem;
  background: #fee2e2;
  border: 2px solid #dc2626;
  border-radius: 8px;
  font-size: 0.8rem;
  color: #991b1b;
  font-weight: 600;
}
</style>