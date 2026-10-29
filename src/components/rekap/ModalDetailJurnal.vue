<template>
  <NeoModal
    :model-value="modelValue"
    :title="`📋 Detail Jurnal Kelas ${jurnal?.nama_kelas || ''}`"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <StateMessage :loading="loading" loading-text="Memuat daftar absensi siswa..." />

    <div v-if="!loading && detail" class="detail-container">
      <div class="jurnal-meta">
        <p><strong>🏫 Sekolah:</strong> {{ detail.nama_sekolah }}</p>
        <p><strong>📅 Tanggal / Jam:</strong> {{ detail.tanggal }} (JP {{ detail.jam_ke || '-' }})</p>
        <p><strong>📚 Mapel:</strong> {{ detail.nama_mapel || '-' }}</p>
        <p><strong>👨‍🏫 Guru:</strong> {{ detail.nama_guru }}</p>
        <p><strong>📖 Materi:</strong> {{ detail.materi || '-' }}</p>
        <p v-if="detail.catatan"><strong>💬 Catatan:</strong> {{ detail.catatan }}</p>
      </div>

      <h4 class="sub-heading">👥 Daftar Kehadiran Siswa ({{ detail.absensi?.length || 0 }})</h4>

      <div class="absensi-list">
        <div
          v-for="item in detail.absensi"
          :key="item.id"
          class="absen-row"
        >
          <div class="absen-info">
            <span class="siswa-name">{{ item.nama_siswa }}</span>
            <small v-if="item.keterangan" class="siswa-ket">📝 {{ item.keterangan }}</small>
          </div>

          <div class="absen-controls">
            <select
              v-model="item.status"
              class="neo-select select-sm"
              @change="updateBarisAbsen(item)"
            >
              <option value="hadir">HADIR</option>
              <option value="terlambat">TERLAMBAT</option>
              <option value="izin">IZIN</option>
              <option value="sakit">SAKIT</option>
              <option value="dispensasi">DISPENSASI</option>
              <option value="alpa">ALPA</option>
            </select>

            <input
              v-model="item.nilai"
              type="number"
              min="0"
              max="100"
              placeholder="Nilai"
              class="neo-input input-nilai-sm"
              @change="updateBarisAbsen(item)"
            />
          </div>
        </div>
      </div>

      <p v-if="saveNotice" class="save-notice">{{ saveNotice }}</p>
    </div>

    <template #footer>
      <button
        type="button"
        class="neo-btn neo-btn-red btn-sm"
        @click="hapusJurnal"
      >
        🗑️ Hapus Jurnal
      </button>
      <button
        type="button"
        class="neo-btn neo-btn-white btn-sm"
        @click="$emit('update:modelValue', false)"
      >
        Tutup
      </button>
    </template>
  </NeoModal>
</template>

<script setup>
import { ref, watch } from 'vue'
import api from '@/services/api'
import NeoModal from '@/components/ui/NeoModal.vue'
import StateMessage from '@/components/ui/StateMessage.vue'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  jurnal: { type: Object, default: null },
})

const emit = defineEmits(['update:modelValue', 'deleted'])

const detail = ref(null)
const loading = ref(false)
const saveNotice = ref('')

watch(
  () => props.modelValue,
  async (isOpen) => {
    if (isOpen && props.jurnal?.id) {
      await fetchDetail(props.jurnal.id)
    }
  }
)

async function fetchDetail(id) {
  loading.value = true
  saveNotice.value = ''
  try {
    const res = await api.get(`/jurnal-mengajar/${id}`)
    detail.value = res.data?.data || null
  } catch (e) {
    alert('Gagal memuat detail jurnal.')
  } finally {
    loading.value = false
  }
}

async function updateBarisAbsen(item) {
  try {
    await api.put(`/absensi-mapel-siswa/${item.id}`, {
      status: item.status,
      nilai: item.nilai !== '' ? item.nilai : null,
      keterangan: item.keterangan,
      catatan: item.catatan,
    })
    saveNotice.value = `✅ Perubahan pada ${item.nama_siswa} tersimpan otomatis.`
    setTimeout(() => { saveNotice.value = '' }, 2500)
  } catch (e) {
    alert('Gagal memperbarui data absensi siswa.')
  }
}

async function hapusJurnal() {
  if (!confirm('Yakin ingin menghapus jurnal mengajar beserta seluruh data absensi di dalamnya?')) {
    return
  }
  try {
    await api.delete(`/jurnal-mengajar/${props.jurnal.id}`)
    emit('deleted')
    emit('update:modelValue', false)
  } catch (e) {
    alert('Gagal menghapus jurnal mengajar.')
  }
}
</script>

<style scoped>
.jurnal-meta {
  background: #f0f9ff;
  border: 2px solid var(--black);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.82rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 1rem;
}

.sub-heading {
  font-size: 0.9rem;
  font-weight: 900;
  margin-bottom: 0.5rem;
}

.absensi-list {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-height: 280px;
  overflow-y: auto;
  padding-right: 0.25rem;
}

.absen-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem 0.65rem;
  border: 1.5px solid var(--black);
  border-radius: 6px;
  background: var(--white);
}

.absen-info {
  display: flex;
  flex-direction: column;
}

.siswa-name {
  font-size: 0.85rem;
  font-weight: 800;
}

.siswa-ket {
  font-size: 0.72rem;
  color: var(--gray-dark);
}

.absen-controls {
  display: flex;
  gap: 0.4rem;
  align-items: center;
}

.select-sm {
  width: auto;
  padding: 0.3rem 0.5rem;
  font-size: 0.75rem;
}

.input-nilai-sm {
  width: 68px;
  padding: 0.3rem 0.45rem;
  font-size: 0.75rem;
}

.save-notice {
  margin-top: 0.65rem;
  font-size: 0.78rem;
  font-weight: 800;
  color: #059669;
  text-align: center;
}

.btn-sm {
  padding: 0.45rem 0.85rem;
  font-size: 0.78rem;
}
</style>