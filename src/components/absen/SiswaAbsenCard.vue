<template>
  <div class="siswa-card" :data-status="siswa.status || ''">
    <!-- Bagian Atas Kartu: Nomor, Nama Siswa, Badge Keterangan/Nilai, & Tombol Batal -->
    <div class="siswa-top">
      <div class="siswa-identity">
        <span class="siswa-no">{{ index + 1 }}</span>
        <div>
          <p class="siswa-nama">
            {{ siswa.nama_siswa }}
            <span v-if="siswa.status" class="status-tag">
              {{ siswa.status.toUpperCase() }}
            </span>
          </p>
          <small class="siswa-jk">
            {{ siswa.jenis_kelamin === 'L' ? '👦 Laki-laki' : '👧 Perempuan' }}
          </small>
        </div>
      </div>

      <div class="siswa-meta-actions">
        <!-- Badge jika ada Nilai / Keterangan / Catatan -->
        <button
          v-if="siswa.nilai !== null && siswa.nilai !== ''"
          type="button"
          class="meta-badge badge-nilai"
          @click="$emit('open-detail', siswa)"
        >
          💯 Nilai: {{ siswa.nilai }}
        </button>

        <button
          v-if="siswa.keterangan || siswa.catatan"
          type="button"
          class="meta-badge badge-ket"
          @click="$emit('open-detail', siswa)"
        >
          📝 {{ ringkasTeks(siswa.keterangan || siswa.catatan) }}
        </button>

        <!-- Tombol Batalkan Status -->
        <button
          v-if="siswa.status"
          type="button"
          class="cancel-btn"
          @click="$emit('clear-status', siswa)"
        >
          ✖ Batal
        </button>
      </div>
    </div>

    <!-- Bagian Bawah Kartu: Pilihan Tombol Status & Tombol Detail (Nilai/Keterangan) -->
    <div class="status-options">
      <button
        v-for="opt in statusList"
        :key="opt.value"
        type="button"
        class="status-btn"
        :class="[
          `opt-${opt.value}`,
          { active: siswa.status === opt.value }
        ]"
        @click="$emit('select-status', { siswaId: siswa.siswa_id, status: opt.value })"
      >
        {{ opt.label }}
      </button>

      <!-- Tombol Buka Modal Keterangan & Nilai -->
      <button
        v-if="siswa.status"
        type="button"
        class="detail-trigger-btn"
        title="Isi Keterangan, Nilai Harian, atau Catatan Siswa"
        @click="$emit('open-detail', siswa)"
      >
        ✏️ Ket / Nilai
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({
  siswa: { type: Object, required: true },
  index: { type: Number, default: 0 },
})

defineEmits(['select-status', 'clear-status', 'open-detail'])

const statusList = [
  { value: 'hadir', label: 'Hadir' },
  { value: 'terlambat', label: 'Terlambat' },
  { value: 'izin', label: 'Izin' },
  { value: 'sakit', label: 'Sakit' },
  { value: 'dispensasi', label: 'Dispen' },
  { value: 'alpa', label: 'Alpa' },
]

function ringkasTeks(teks) {
  if (!teks) return ''
  return teks.length > 22 ? teks.slice(0, 22) + '...' : teks
}
</script>

<style scoped>
.siswa-card {
  background: var(--white);
  border: var(--border);
  border-radius: 12px;
  padding: 1rem;
  margin-bottom: 0.75rem;
  box-shadow: var(--shadow-sm);
  position: relative;
  overflow: hidden;
  transition: all 0.2s ease;
  padding-left: 1.25rem;
}

.siswa-card::before {
  content: "";
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 7px;
  background: var(--gray-muted);
}

/* Warna tepi kiri berdasarkan status */
.siswa-card[data-status="hadir"]      { border-color: #10b981; background: #f0fdf4; }
.siswa-card[data-status="hadir"]::before { background: #10b981; }

.siswa-card[data-status="terlambat"]  { border-color: #f97316; background: #fff7ed; }
.siswa-card[data-status="terlambat"]::before { background: #f97316; }

.siswa-card[data-status="izin"]       { border-color: #f59e0b; background: #fefce8; }
.siswa-card[data-status="izin"]::before { background: #f59e0b; }

.siswa-card[data-status="sakit"]      { border-color: #ef4444; background: #fef2f2; }
.siswa-card[data-status="sakit"]::before { background: #ef4444; }

.siswa-card[data-status="dispensasi"] { border-color: #8b5cf6; background: #f5f3ff; }
.siswa-card[data-status="dispensasi"]::before { background: #8b5cf6; }

.siswa-card[data-status="alpa"]       { border-color: #6b7280; background: #f3f4f6; }
.siswa-card[data-status="alpa"]::before { background: #6b7280; }

.siswa-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.siswa-identity {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.siswa-no {
  width: 28px;
  height: 28px;
  background: var(--accent-yellow);
  border: 2px solid var(--black);
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.siswa-nama {
  font-size: 1rem;
  font-weight: 900;
  color: var(--black);
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.status-tag {
  font-size: 0.65rem;
  padding: 0.15rem 0.45rem;
  border-radius: 10px;
  border: 1.5px solid var(--black);
  background: var(--white);
  font-weight: 900;
}

.siswa-jk {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--gray-dark);
}

.siswa-meta-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.meta-badge {
  padding: 0.25rem 0.55rem;
  border-radius: 8px;
  border: 1.5px solid var(--black);
  font-size: 0.72rem;
  font-weight: 800;
  cursor: pointer;
}

.badge-nilai { background: #dcfce7; color: #065f46; }
.badge-ket   { background: #e0f2fe; color: #0369a1; }

.cancel-btn {
  background: var(--accent-red);
  color: var(--white);
  border: 1.5px solid var(--black);
  border-radius: 6px;
  padding: 0.25rem 0.5rem;
  font-size: 0.7rem;
  font-weight: 800;
  cursor: pointer;
}

.status-options {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.status-btn {
  padding: 0.45rem 0.7rem;
  border: 2px solid var(--black);
  border-radius: 6px;
  background: var(--white);
  font-size: 0.78rem;
  font-weight: 800;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.15s ease;
  font-family: inherit;
}

.status-btn.active {
  transform: translate(-1px, -1px);
  box-shadow: 2px 2px 0px var(--black);
  color: var(--white);
}

.opt-hadir.active      { background: #10b981; }
.opt-terlambat.active  { background: #f97316; }
.opt-izin.active       { background: #f59e0b; color: var(--black); }
.opt-sakit.active      { background: #ef4444; }
.opt-dispensasi.active { background: #8b5cf6; }
.opt-alpa.active       { background: #4b5563; }

.detail-trigger-btn {
  padding: 0.45rem 0.65rem;
  border: 2px dashed var(--black);
  border-radius: 6px;
  background: #fef3c7;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  margin-left: auto;
}
</style>