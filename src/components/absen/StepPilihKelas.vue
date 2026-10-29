<template>
  <section class="neo-card step-card">
    <div class="step-header">
      <h3 class="step-title">1. Pilih Kelas</h3>
      <!-- Filter Cepat Unit Sekolah -->
      <div class="unit-tabs">
        <button
          type="button"
          class="tab-btn"
          :class="{ active: appState.selectedSekolahId === '' }"
          @click="appState.selectedSekolahId = ''"
        >
          Semua
        </button>
        <button
          v-for="s in appState.sekolahList"
          :key="s.id"
          type="button"
          class="tab-btn"
          :class="{ active: Number(appState.selectedSekolahId) === Number(s.id) }"
          @click="appState.selectedSekolahId = s.id"
        >
          {{ s.nama_jenjang }}
        </button>
      </div>
    </div>

    <StateMessage
      :loading="loading"
      loading-text="Mengambil daftar kelas..."
      :error="errorMsg"
      :empty="!loading && !errorMsg && kelasList.length === 0"
      empty-text="Belum ada data kelas pada unit ini."
      @retry="fetchKelas"
    />

    <div v-if="!loading && !errorMsg && kelasList.length > 0" class="choice-grid class-grid">
      <button
        v-for="item in kelasList"
        :key="item.id"
        type="button"
        class="choice-btn class-btn"
        :class="{ selected: modelValue?.id === item.id }"
        @click="$emit('update:modelValue', item)"
      >
        <span class="class-name">{{ item.nama }}</span>
        <small class="class-school">{{ item.nama_sekolah }}</small>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'
import StateMessage from '@/components/ui/StateMessage.vue'

const props = defineProps({
  modelValue: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const kelasList = ref([])
const loading = ref(false)
const errorMsg = ref(null)

async function fetchKelas() {
  loading.value = true
  errorMsg.value = null
  try {
    const params = {}
    if (appState.selectedSekolahId) {
      params.sekolah_id = appState.selectedSekolahId
    }
    if (appState.tahunAjaranAktif?.id) {
      params.tahun_ajaran_id = appState.tahunAjaranAktif.id
    }

    const res = await api.get('/kelas', { params })
    const raw = res.data?.data || []
    kelasList.value = raw.filter(k => Number(k.is_aktif) === 1)

    // Jika kelas yang sedang dipilih tidak ada di hasil filter baru, reset pilihan kelas
    if (props.modelValue && !kelasList.value.some(k => k.id === props.modelValue.id)) {
      emit('update:modelValue', null)
    }
  } catch (err) {
    errorMsg.value = 'Gagal mengambil data kelas.'
  } finally {
    loading.value = false
  }
}

watch(
  () => [appState.selectedSekolahId, appState.tahunAjaranAktif],
  () => fetchKelas()
)

onMounted(() => {
  fetchKelas()
})
</script>

<style scoped>
.step-card {
  margin-bottom: 1rem;
}

.step-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed var(--black);
}

.step-title {
  font-size: 1.05rem;
  font-weight: 900;
  color: var(--black);
}

.unit-tabs {
  display: flex;
  gap: 0.35rem;
}

.tab-btn {
  padding: 0.3rem 0.65rem;
  font-size: 0.75rem;
  font-weight: 800;
  border: 2px solid var(--black);
  border-radius: 6px;
  background: var(--white);
  cursor: pointer;
}

.tab-btn.active {
  background: var(--accent-yellow);
  box-shadow: 2px 2px 0px var(--black);
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
}

.choice-btn {
  padding: 0.75rem 0.6rem;
  border: var(--border-sm);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  box-shadow: var(--shadow-sm);
  font-family: inherit;
}

.class-btn {
  background: #ffedd5;
  color: var(--black);
}

.class-btn:hover {
  background: #fed7aa;
  transform: translateY(-2px);
}

.class-btn.selected {
  background: var(--primary-blue);
  color: var(--white);
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.class-name {
  font-size: 1rem;
  font-weight: 900;
}

.class-school {
  font-size: 0.68rem;
  font-weight: 700;
  opacity: 0.85;
  text-align: center;
}

@media (min-width: 640px) {
  .class-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>