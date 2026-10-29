<template>
  <div class="master-data-view">
    <h2 class="page-title">⚙️ Pengaturan WA & Master Data</h2>

    <!-- Navigasi Sub-Menu Master Data -->
    <div class="sub-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        class="tab-pill"
        :class="{ active: activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Komponen Dinamis Sesuai Tab yang Dipilih -->
    <MasterSekolahWa v-if="activeTab === 'wa'" />
    <MasterKelas v-else-if="activeTab === 'kelas'" />
    <MasterGuru v-else-if="activeTab === 'guru'" />
    <MasterMapel v-else-if="activeTab === 'mapel'" />
    <MasterSiswa v-else-if="activeTab === 'siswa'" />
    <MasterTahunAjaran v-else-if="activeTab === 'tahun'" />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import MasterSekolahWa from '@/components/master/MasterSekolahWa.vue'
import MasterKelas from '@/components/master/MasterKelas.vue'
import MasterGuru from '@/components/master/MasterGuru.vue'
import MasterMapel from '@/components/master/MasterMapel.vue'
import MasterSiswa from '@/components/master/MasterSiswa.vue'
import MasterTahunAjaran from '@/components/master/MasterTahunAjaran.vue'

const activeTab = ref('wa')

const tabs = [
  { key: 'wa', label: '💬 Sekolah & Template WA' },
  { key: 'siswa', label: '👥 Siswa & No. Ortu' },
  { key: 'kelas', label: '🏷️ Kelas' },
  { key: 'guru', label: '👨‍🏫 Guru' },
  { key: 'mapel', label: '📚 Mapel' },
  { key: 'tahun', label: '📅 Tahun Ajaran' },
]
</script>

<style scoped>
.page-title {
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--primary-blue);
  text-shadow: 1px 1px 0px var(--accent-yellow);
  margin-bottom: 0.85rem;
}

.sub-tabs {
  display: flex;
  gap: 0.45rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.tab-pill {
  padding: 0.5rem 0.85rem;
  border: var(--border-sm);
  border-radius: 8px;
  background: var(--white);
  font-weight: 800;
  font-size: 0.8rem;
  white-space: nowrap;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  font-family: inherit;
}

.tab-pill.active {
  background: var(--accent-yellow);
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}
</style>