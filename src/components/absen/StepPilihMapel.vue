<template>
  <section class="neo-card step-card">
    <div class="step-header">
      <h3 class="step-title">2. Pilih Mata Pelajaran</h3>
      <span v-if="!selectedClass" class="step-hint">Pilih kelas terlebih dahulu</span>
    </div>

    <template v-if="selectedClass">
      <StateMessage
        :loading="loading"
        loading-text="Mengambil mata pelajaran..."
        :error="errorMsg"
        :empty="!loading && !errorMsg && mapelList.length === 0"
        empty-text="Belum ada mata pelajaran terdaftar."
        @retry="fetchMapel"
      />

      <div v-if="!loading && !errorMsg && mapelList.length > 0" class="mapel-grid">
        <button
          v-for="item in mapelList"
          :key="item.id"
          type="button"
          class="mapel-btn"
          :class="{ selected: modelValue?.id === item.id }"
          @click="$emit('update:modelValue', item)"
        >
          {{ item.nama }}
        </button>
      </div>
    </template>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import StateMessage from '@/components/ui/StateMessage.vue'

defineProps({
  modelValue: { type: Object, default: null },
  selectedClass: { type: Object, default: null },
})

defineEmits(['update:modelValue'])

const mapelList = ref([])
const loading = ref(false)
const errorMsg = ref(null)

async function fetchMapel() {
  loading.value = true
  errorMsg.value = null
  try {
    const res = await api.get('/mata-pelajaran')
    mapelList.value = res.data?.data || []
  } catch (err) {
    errorMsg.value = 'Gagal mengambil data mata pelajaran.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchMapel()
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
  margin-bottom: 0.85rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed var(--black);
}

.step-title {
  font-size: 1.05rem;
  font-weight: 900;
}

.step-hint {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--gray-dark);
  font-style: italic;
}

.mapel-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.6rem;
}

.mapel-btn {
  padding: 0.75rem 0.6rem;
  min-height: 52px;
  border: var(--border-sm);
  border-radius: 8px;
  background: #d1fae5;
  color: var(--black);
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  box-shadow: var(--shadow-sm);
  transition: all 0.15s ease;
  font-family: inherit;
}

.mapel-btn:hover {
  background: #a7f3d0;
  transform: translateY(-2px);
}

.mapel-btn.selected {
  background: var(--accent-green);
  color: var(--white);
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

@media (min-width: 640px) {
  .mapel-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>