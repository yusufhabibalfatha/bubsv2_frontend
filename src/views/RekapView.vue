<template>
  <div class="rekap-view">
    <div class="rekap-header">
      <h2 class="page-title">📊 Rekapitulasi Presensi & Jurnal</h2>

      <div class="mode-switcher">
        <button
          type="button"
          class="neo-btn"
          :class="activeTab === 'jurnal' ? 'neo-btn-blue' : 'neo-btn-white'"
          @click="activeTab = 'jurnal'"
        >
          📖 Riwayat Jurnal
        </button>
        <button
          type="button"
          class="neo-btn"
          :class="activeTab === 'kelas' ? 'neo-btn-blue' : 'neo-btn-white'"
          @click="activeTab = 'kelas'"
        >
          👥 Rekap Persentase Siswa
        </button>
      </div>
    </div>

    <TabRekapJurnal v-if="activeTab === 'jurnal'" />
    <TabRekapKelas v-else />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import TabRekapJurnal from '@/components/rekap/TabRekapJurnal.vue'
import TabRekapKelas from '@/components/rekap/TabRekapKelas.vue'

const activeTab = ref('jurnal')
</script>

<style scoped>
.rekap-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.page-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-blue);
  text-shadow: 1px 1px 0px var(--accent-yellow);
}

.mode-switcher {
  display: flex;
  gap: 0.5rem;
}
</style>