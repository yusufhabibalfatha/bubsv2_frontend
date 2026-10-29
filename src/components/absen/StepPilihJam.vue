<template>
  <section class="neo-card step-card">
    <div class="step-header">
      <h3 class="step-title">3. Pilih Jam Mata Pelajaran</h3>
    </div>

    <div class="time-picker-grid">
      <!-- Jam Mulai -->
      <div class="time-field">
        <label for="jam-mulai" class="field-label">⏰ Jam Mulai</label>
        <select
          id="jam-mulai"
          v-model="jpMulai"
          class="neo-select"
          @change="onMulaiChange"
        >
          <option value="">-- Pilih Jam Mulai --</option>
          <option v-for="item in jamPelajaran" :key="item.jp" :value="item.jp">
            JP {{ item.jp }} — {{ formatTitik(item.mulai) }}
          </option>
        </select>
      </div>

      <!-- Jam Selesai -->
      <div class="time-field">
        <label for="jam-selesai" class="field-label">🏁 Jam Selesai</label>
        <select
          id="jam-selesai"
          v-model="jpSelesai"
          class="neo-select"
          :disabled="!jpMulai"
          @change="onSelesaiChange"
        >
          <option value="">-- Pilih Jam Selesai --</option>
          <option
            v-for="item in opsiJamSelesai"
            :key="item.jp"
            :value="item.jp"
          >
            JP {{ item.jp }} — {{ formatTitik(item.selesai) }}
          </option>
        </select>
      </div>
    </div>

    <div class="break-banner">
      ⏸️ <strong>Info:</strong> JP 5 — Istirahat (09.30 - 10.00)
    </div>
  </section>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  modelValue: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue'])

const jamPelajaran = [
  { jp: 1, mulai: '07:30', selesai: '08:00' },
  { jp: 2, mulai: '08:00', selesai: '08:30' },
  { jp: 3, mulai: '08:30', selesai: '09:00' },
  { jp: 4, mulai: '09:00', selesai: '09:30' },
  { jp: 6, mulai: '10:00', selesai: '10:30' },
  { jp: 7, mulai: '10:30', selesai: '11:00' },
  { jp: 8, mulai: '11:00', selesai: '11:30' },
]

const jpMulai = ref('')
const jpSelesai = ref('')

const opsiJamSelesai = computed(() => {
  if (!jpMulai.value) return jamPelajaran
  return jamPelajaran.filter(item => item.jp >= Number(jpMulai.value))
})

function formatTitik(jamStr) {
  return jamStr.replace(':', '.')
}

function onMulaiChange() {
  if (jpSelesai.value && Number(jpSelesai.value) < Number(jpMulai.value)) {
    jpSelesai.value = ''
    emit('update:modelValue', null)
  } else if (jpSelesai.value) {
    updateEmitValue()
  }
}

function onSelesaiChange() {
  updateEmitValue()
}

function updateEmitValue() {
  if (!jpMulai.value || !jpSelesai.value) {
    emit('update:modelValue', null)
    return
  }

  const startObj = jamPelajaran.find(i => i.jp === Number(jpMulai.value))
  const endObj = jamPelajaran.find(i => i.jp === Number(jpSelesai.value))

  if (!startObj || !endObj) return

  const jamKeLabel =
    startObj.jp === endObj.jp ? `${startObj.jp}` : `${startObj.jp}-${endObj.jp}`

  emit('update:modelValue', {
    jpMulai: startObj.jp,
    jpSelesai: endObj.jp,
    jamKe: jamKeLabel,
    jamMulai: `${startObj.mulai}:00`,
    jamSelesai: `${endObj.selesai}:00`,
    labelJam: `${formatTitik(startObj.mulai)} - ${formatTitik(endObj.selesai)}`,
  })
}

watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      jpMulai.value = val.jpMulai
      jpSelesai.value = val.jpSelesai
    }
  }
)

onMounted(() => {
  if (props.modelValue) {
    jpMulai.value = props.modelValue.jpMulai
    jpSelesai.value = props.modelValue.jpSelesai
  }
})
</script>

<style scoped>
.step-card {
  margin-bottom: 1rem;
}

.step-header {
  margin-bottom: 0.85rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px dashed var(--black);
}

.step-title {
  font-size: 1.05rem;
  font-weight: 900;
}

.time-picker-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;
}

.field-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}

.break-banner {
  margin-top: 0.85rem;
  padding: 0.55rem 0.75rem;
  background: #fef3c7;
  border: 2px solid var(--black);
  border-radius: 8px;
  font-size: 0.8rem;
  text-align: center;
}

@media (min-width: 640px) {
  .time-picker-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>