<template>
  <div class="master-sekolah-wa">
    <StateMessage :loading="loading" loading-text="Memuat konfigurasi sekolah & WhatsApp..." />

    <div v-if="!loading" class="sekolah-list">
      <div
        v-for="sekolah in sekolahForms"
        :key="sekolah.id"
        class="neo-card neo-card-top-bar sekolah-card"
      >
        <div class="card-head">
          <div>
            <span class="neo-badge neo-badge-yellow">{{ sekolah.nama_jenjang }}</span>
            <h3 class="sekolah-title">{{ sekolah.nama }}</h3>
          </div>

          <label class="wa-toggle">
            <input
              v-model="sekolah.is_wa_aktif"
              type="checkbox"
              :true-value="1"
              :false-value="0"
            />
            <span class="toggle-label">
              {{ Number(sekolah.is_wa_aktif) === 1 ? '🟢 WA Gateway Aktif' : '🔴 WA Nonaktif' }}
            </span>
          </label>
        </div>

        <div class="form-grid">
          <!-- Kolom Kiri: Data Sekolah & Token Fonnte -->
          <div class="form-col">
            <div class="field-group">
              <label>🏫 Nama Sekolah</label>
              <input v-model="sekolah.nama" type="text" class="neo-input" />
            </div>

            <div class="field-group">
              <label>📍 Alamat Sekolah</label>
              <textarea v-model="sekolah.alamat" rows="2" class="neo-textarea" />
            </div>

            <div class="field-group token-box">
              <label>🔑 Token Fonnte WhatsApp ({{ sekolah.nama_jenjang }})</label>
              <div class="token-input-row">
                <input
                  v-model="sekolah.fonnte_token"
                  :type="sekolah.showToken ? 'text' : 'password'"
                  class="neo-input"
                  placeholder="Masukkan Token API dari Dashboard Fonnte..."
                />
                <button
                  type="button"
                  class="neo-btn neo-btn-white btn-sm"
                  @click="sekolah.showToken = !sekolah.showToken"
                >
                  {{ sekolah.showToken ? '🙈' : '👁️' }}
                </button>
              </div>
              <small class="hint">
                Token ini digunakan untuk mengirim ringkasan absensi ke Grup WhatsApp masing-masing kelas di unit {{ sekolah.nama_jenjang }}. Pastikan <strong>ID Grup WA Kelas</strong> sudah diatur pada tab <strong>🏷️ Kelas & Grup WA</strong>.
              </small>
            </div>
          </div>

          <!-- Kolom Kanan: Contoh Format Ringkasan Grup Kelas -->
          <div class="preview-col">
            <label class="preview-title">📱 Contoh Ringkasan di Grup WA Kelas:</label>
            <div class="wa-chat-bubble">
              <pre class="wa-chat-text">{{ renderPreview(sekolah) }}</pre>
              <span class="wa-chat-time">09:00 ✓✓</span>
            </div>
          </div>
        </div>

        <div class="card-footer">
          <button
            type="button"
            class="neo-btn neo-btn-green"
            :disabled="savingId === sekolah.id"
            @click="simpanSekolah(sekolah)"
          >
            {{ savingId === sekolah.id ? '⏳ Menyimpan...' : `💾 Simpan Pengaturan ${sekolah.nama_jenjang}` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '@/services/api'
import { appState } from '@/stores/appState'
import StateMessage from '@/components/ui/StateMessage.vue'

const sekolahForms = ref([])
const loading = ref(false)
const savingId = ref(null)

async function fetchSekolah() {
  loading.value = true
  try {
    const res = await api.get('/sekolah')
    const data = res.data?.data || []
    sekolahForms.value = data.map(item => ({
      ...item,
      is_wa_aktif: Number(item.is_wa_aktif ?? 1),
      showToken: false,
    }))
  } catch (e) {
    alert('Gagal memuat data sekolah.')
  } finally {
    loading.value = false
  }
}

function renderPreview(sekolah) {
  const kelasContoh = sekolah.nama_jenjang === 'SMP' ? 'VII-A' : 'XI-1'
  const hariTgl = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    `📅 *Presensi Kelas ${kelasContoh}*\n` +
    `*Hari/Tgl:* ${hariTgl}\n` +
    `*Mapel:* Pendidikan Pancasila\n` +
    `*Jam:* 07:30 - 09:00\n` +
    `*Guru:* Budi Santoso, M.Pd.\n` +
    `*Materi:* Konstitusi dalam Kehidupan Berbangsa\n\n` +
    `✅ *Hadir (2):*\n` +
    `- Fajar Ramadhan\n` +
    `- Zahra Amalia\n\n` +
    `🤒 *Sakit (1):*\n` +
    `- Bagas Saputra (Istirahat di klinik)\n\n` +
    `📊 *Total:* 3 Siswa`
  )
}

async function simpanSekolah(sekolah) {
  savingId.value = sekolah.id
  try {
    await api.put(`/sekolah/${sekolah.id}`, {
      jenjang_id: sekolah.jenjang_id,
      nama: sekolah.nama,
      alamat: sekolah.alamat,
      latitude: sekolah.latitude,
      longitude: sekolah.longitude,
      status: sekolah.status,
      fonnte_token: sekolah.fonnte_token,
      is_wa_aktif: sekolah.is_wa_aktif,
      template_wa: sekolah.template_wa,
    })
    await appState.initAppData()
    alert(`✅ Pengaturan ${sekolah.nama} berhasil disimpan!`)
  } catch (err) {
    alert('Gagal menyimpan pengaturan sekolah.')
  } finally {
    savingId.value = null
  }
}

onMounted(() => {
  fetchSekolah()
})
</script>

<style scoped>
.sekolah-list {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.sekolah-card {
  padding-top: 1.5rem;
}

.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
  padding-bottom: 0.65rem;
  border-bottom: 2px dashed var(--black);
}

.sekolah-title {
  font-size: 1.15rem;
  font-weight: 900;
  margin-top: 0.35rem;
}

.wa-toggle {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.8rem;
  border: 2px solid var(--black);
  border-radius: 8px;
  background: var(--gray-light);
  cursor: pointer;
  font-weight: 800;
  font-size: 0.82rem;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.field-group {
  margin-bottom: 0.85rem;
}

.field-group label {
  display: block;
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 0.3rem;
  text-transform: uppercase;
}

.token-box {
  background: #fefce8;
  border: 2px solid var(--black);
  border-radius: 8px;
  padding: 0.75rem;
}

.token-input-row {
  display: flex;
  gap: 0.4rem;
}

.hint {
  display: block;
  margin-top: 0.3rem;
  font-size: 0.72rem;
  color: var(--gray-dark);
  font-weight: 600;
}

.placeholder-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  margin-bottom: 0.45rem;
}

.chip-btn {
  padding: 0.2rem 0.45rem;
  font-size: 0.7rem;
  font-weight: 800;
  background: #dbeafe;
  border: 1.5px solid var(--black);
  border-radius: 6px;
  cursor: pointer;
}

.chip-btn:hover {
  background: var(--accent-yellow);
}

.font-mono {
  font-family: monospace;
  font-size: 0.82rem;
  line-height: 1.4;
}

.preview-col {
  display: flex;
  flex-direction: column;
}

.preview-title {
  font-size: 0.78rem;
  font-weight: 800;
  margin-bottom: 0.35rem;
  text-transform: uppercase;
}

.wa-chat-bubble {
  background: #dcfce7;
  border: var(--border-sm);
  border-radius: 12px;
  padding: 1rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  flex: 1;
}

.wa-chat-text {
  white-space: pre-wrap;
  font-family: inherit;
  font-size: 0.84rem;
  line-height: 1.45;
  color: var(--black);
}

.wa-chat-time {
  display: block;
  text-align: right;
  font-size: 0.68rem;
  font-weight: 700;
  color: #065f46;
  margin-top: 0.5rem;
}

.card-footer {
  margin-top: 1rem;
  padding-top: 0.85rem;
  border-top: 2px dashed var(--black);
  display: flex;
  justify-content: flex-end;
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1.3fr 1fr;
  }
}
</style>