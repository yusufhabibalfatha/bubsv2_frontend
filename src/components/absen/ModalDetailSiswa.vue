<template>
  <NeoModal
    :model-value="modelValue"
    :title="`📝 Detail Absen: ${siswa?.nama_siswa || ''}`"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <p class="status-info">
      Status saat ini:
      <span class="neo-badge neo-badge-yellow">
        {{ siswa?.status?.toUpperCase() }}
      </span>
    </p>

    <div class="form-group">
      <label class="form-label">Keterangan Kehadiran (Tampil di WA Ortu)</label>
      <input
        v-model="localKeterangan"
        type="text"
        class="neo-input"
        :placeholder="contohKeterangan(siswa?.status)"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Nilai Harian / Keaktifan (0 - 100, Opsional)</label>
      <input
        v-model="localNilai"
        type="number"
        min="0"
        max="100"
        step="0.5"
        class="neo-input"
        placeholder="Kosongkan jika tidak ada pengambilan nilai hari ini"
      />
    </div>

    <div class="form-group">
      <label class="form-label">Catatan Guru untuk Siswa (Opsional)</label>
      <textarea
        v-model="localCatatan"
        rows="2"
        class="neo-textarea"
        placeholder="Contoh: Aktif bertanya di kelas / Tugas belum dikumpulkan"
      />
    </div>

    <template #footer>
      <button
        type="button"
        class="neo-btn neo-btn-white"
        @click="$emit('update:modelValue', false)"
      >
        Batal
      </button>
      <button
        type="button"
        class="neo-btn neo-btn-green"
        @click="simpan"
      >
        💾 Simpan Detail
      </button>
    </template>
  </NeoModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import NeoModal from '@/components/ui/NeoModal.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  siswa: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'save'])

const localKeterangan = ref('')
const localNilai = ref('')
const localCatatan = ref('')

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen && props.siswa) {
      localKeterangan.value = props.siswa.keterangan || ''
      localNilai.value = props.siswa.nilai ?? ''
      localCatatan.value = props.siswa.catatan || ''
    }
  }
)

function contohKeterangan(status) {
  switch (status) {
    case 'izin': return 'Contoh: Izin acara keluarga / pulang lebih awal'
    case 'sakit': return 'Contoh: Demam, istirahat di klinik asrama'
    case 'terlambat': return 'Contoh: Terlambat 15 menit'
    case 'dispensasi': return 'Contoh: Mengikuti persiapan lomba sekolah'
    case 'alpa': return 'Contoh: Tanpa keterangan'
    default: return 'Contoh: Hadir tepat waktu'
  }
}

function simpan() {
  emit('save', {
    siswa_id: props.siswa.siswa_id,
    keterangan: localKeterangan.value.trim() || null,
    nilai: localNilai.value !== '' ? Number(localNilai.value) : null,
    catatan: localCatatan.value.trim() || null,
  })
  emit('update:modelValue', false)
}
</script>

<style scoped>
.status-info {
  margin-bottom: 1rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.form-group {
  margin-bottom: 0.85rem;
}

.form-label {
  display: block;
  font-size: 0.8rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
}
</style>