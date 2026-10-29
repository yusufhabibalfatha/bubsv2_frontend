<template>
  <section class="neo-card step-card">
    <div class="step-header">
      <div>
        <h3 class="step-title">4. Pilih Guru Pengajar</h3>
        <small class="cross-unit-note">Menampilkan seluruh guru yayasan (mendukung guru lintas jenjang)</small>
      </div>
      <span v-if="!selectedSubject" class="step-hint">Pilih mapel terlebih dahulu</span>
    </div>

    <template v-if="selectedSubject">
      <!-- Pencarian Cepat Nama Guru -->
      <div class="search-box">
        <input
          v-model="searchQuery"
          type="text"
          class="neo-input"
          placeholder="🔍 Cari nama guru..."
        />
      </div>

      <StateMessage
        :loading="loading"
        loading-text="Mengambil daftar guru..."
        :error="errorMsg"
        :empty="!loading && !errorMsg && filteredGuru.length === 0"
        empty-text="Nama guru tidak ditemukan."
        @retry="fetchSemuaGuru"
      />

      <div v-if="!loading && !errorMsg && filteredGuru.length > 0" class="guru-grid">
        <button
          v-for="guru in filteredGuru"
          :key="guru.id"
          type="button"
          class="guru-btn"
          :class="{ selected: modelValue?.id === guru.id }"
          @click="$emit('update:modelValue', guru)"
        >
          <span class="guru-name">{{ guru.nama }}</span>
          <span class="guru-unit">{{ singkatanSekolah(guru.nama_sekolah) }}</span>
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '@/services/api'
import StateMessage from '@/components/ui/StateMessage.vue'

defineProps({
  modelValue: { type: Object, default: null },
  selectedSubject: { type: Object, default: null },
})

defineEmits(['update:modelValue'])

const guruList = ref([])
const searchQuery = ref('')
const loading = ref(false)
const errorMsg = ref(null)

// Memanggil /api/guru TANPA filter sekolah_id agar semua guru SMP & SMA muncul
async function fetchSemuaGuru() {
  loading.value = true
  errorMsg.value = null
  try {
    const res = await api.get('/guru')
    const raw = res.data?.data || []
    guruList.value = raw.filter(g => g.status === 'aktif')
  } catch (err) {
    errorMsg.value = 'Gagal mengambil daftar guru.'
  } finally {
    loading.value = false
  }
}

const filteredGuru = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  if (!q) return guruList.value
  return guruList.value.filter(
    g =>
      g.nama.toLowerCase().includes(q) ||
      (g.nama_sekolah && g.nama_sekolah.toLowerCase().includes(q))
  )
})

function singkatanSekolah(namaSekolah) {
  if (!namaSekolah) return ''
  if (namaSekolah.toUpperCase().includes('SMP')) return 'SMP'
  if (namaSekolah.toUpperCase().includes('SMA')) return 'SMA'
  return namaSekolah
}

onMounted(() => {
  fetchSemuaGuru()
})
</script>

<style scoped>
.step-card {
  margin-bottom: 1rem;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed var(--black);
}

.step-title {
  font-size: 1.05rem;
  font-weight: 900;
}

.cross-unit-note {
  font-size: 0.72rem;
  color: var(--gray-dark);
  font-weight: 600;
}

.step-hint {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray-dark);
  font-style: italic;
}

.search-box {
  margin-bottom: 0.75rem;
}

.guru-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.55rem;
}

.guru-btn {
  padding: 0.7rem 0.85rem;
  border: var(--border-sm);
  border-radius: 8px;
  background: #dbeafe;
  color: var(--black);
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  text-align: left;
  font-family: inherit;
}

.guru-btn:hover {
  background: #bfdbfe;
  transform: translateY(-2px);
}

.guru-btn.selected {
  background: var(--primary-blue);
  color: var(--white);
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.guru-name {
  font-size: 0.88rem;
  font-weight: 800;
}

.guru-unit {
  font-size: 0.68rem;
  font-weight: 900;
  padding: 0.15rem 0.45rem;
  border-radius: 6px;
  border: 1.5px solid var(--black);
  background: var(--accent-yellow);
  color: var(--black);
  flex-shrink: 0;
}

@media (min-width: 640px) {
  .guru-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>