<template>
  <div class="flex flex-col  lg:flex-row items-center justify-center">
    <div class="bg-slate-50 p-8 rounded-lg shadow-xl mt-10 lg:me-10  w-[80vh]">
      <div class="h-[55vh]">
      <h2 class="text-2xl font-bold text-center">Tambah Absensi</h2>
      <form @submit.prevent="kirimData">
        <!-- Nama Siswa -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name"> Nama Siswa </label>
          <input v-model="form.nama" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Masukkan Nama Siswa" />
        </div>

        <!-- Kelas -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="kelas"> Kelas </label>
          <input v-model="form.kelas" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="kelas" type="text" placeholder="Masukkan Kelas" />
        </div>

        <!-- Keterangan -->
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="keterangan"> Keterangan </label>
          <select v-model="form.status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
            <option value="Sakit">Sakit</option>
            <option value="Izin">Izin</option>
            <option value="Alpa">Alpa</option>
          </select>
        </div>

        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Send Data</button>
          <nuxt-link to="/logout" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> Logout </nuxt-link>
        </div>
      </form>
    </div>
    </div>

    <!-- Tabel absensi -->
    <div class="flex items-center justify-center mt-10">
      <div class="bg-slate-50 rounded-lg shadow-xl">
        <div class="h-[60vh] overflow-auto mt-5 p-4 m-5 shadow-xl">
          <div class="text-2xl font-semibold mb-5 text-center">
            <h3>Riwayat Presensi</h3>
          </div>

          <div>
            <button @click="downloadExcel" class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
              Download Data Excel
            </button>
          </div>

          <table class="border-collapse border border-black w-full">
            <thead class="bg-[#0365AE] text-white">
              <tr>
                <th class="border border-black">NO</th>
                <th class="border border-black">Siswa</th>
                <th class="border border-black">Waktu</th>
                <th class="border border-black">Keterangan</th>
                <th class="border border-black">Aksi</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(visitor, i) in visitors" :key="i">
                <td class="border border-black">{{ i + 1 }}.</td>
                <td class="border border-black">{{ visitor.nama }} {{ visitor.kelas }}</td>
                <td class="border border-black">{{ visitor.tanggal }}, {{ visitor.time }}</td>
                <td class="border border-black">{{ visitor.status }}</td>
                <td class="border border-black">
                  <button @click="editData(visitor)" class="text-blue-600 hover:underline">Edit |</button>
                  <button @click="confirmDelete(visitor)" class="text-red-600 hover:underline"> | Delete</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Popup Edit -->
    <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-slate-50 w-11/12 md:w-96 p-6 rounded-lg shadow-gray-500 shadow-xl">
        <h3 class="text-2xl font-bold mb-4">Edit Data Siswa</h3>

        <!-- Form Edit -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Nama Siswa</label>
          <input v-model="selectedVisitor.nama" class="border rounded w-full py-2 px-3" type="text" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Kelas</label>
          <input v-model="selectedVisitor.kelas" class="border rounded w-full py-2 px-3" type="text" />
        </div>
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2">Keterangan</label>
          <input v-model="selectedVisitor.status" class="border rounded w-full py-2 px-3" type="text" />
        </div>

        <!-- Tombol Simpan dan Batal -->
        <div class="flex justify-between">
          <button @click="updateData" class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Save</button>
          <button @click="isEditing = false" class="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>

    <!-- Modal Konfirmasi Hapus -->
    <div v-if="showConfirmModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white w-11/12 md:w-96 p-6 rounded-lg shadow-xl">
        <h3 class="text-lg font-semibold mb-4">Konfirmasi Hapus</h3>
        <p>{{ visitorToDelete?.nama }} yakin mau dihapus?</p>
        <div class="flex justify-between mt-4">
          <button @click="hapusData" class="bg-red-500 hover:bg-red-700 text-white py-2 px-4 rounded">Delete</button>
          <button @click="showConfirmModal = false" class="bg-gray-300 hover:bg-gray-400 text-black py-2 px-4 rounded">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
useHead({
  title: "Face Presensi",
  meta: [
    {
      name: "description",
      content: "Form Siswa",
    },
  ],
});
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

// Fungsi untuk mendownload data Excel
const downloadExcel = () => {
  // Buat worksheet dari data yang ada di visitors
  const worksheet = XLSX.utils.json_to_sheet(visitors.value);
  
  // Buat workbook dan tambahkan worksheet ke dalamnya
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');

  // Hasilkan file Excel dalam format array buffer
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  // Buat Blob dan download file dengan nama 'data-absensi.xlsx'
  const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  saveAs(blob, 'data-absensi.xlsx');
};

const supabase = useSupabaseClient();
const form = ref({
  nama: "",
  kelas: "",
  status: "",
});

const kirimData = async () => {
  const { error } = await supabase.from("siswa").insert([form.value]);
  if (error) {
    console.error('Error inserting data:', error.message);
  } else {
    navigateTo("/absen");
  }
};


const visitors = ref([]);
const isEditing = ref(false);
const selectedVisitor = ref(null);
const showConfirmModal = ref(false); // Untuk mengontrol tampilan modal konfirmasi
const visitorToDelete = ref(null); // Untuk menyimpan data visitor yang akan dihapus


const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatToJakartaTime = (timeString) => {
  if (!timeString) return '00:00';
  const utcDate = new Date(`1970-01-01T${timeString}Z`);
  const jakartaDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));
  const hours = String(jakartaDate.getHours()).padStart(2, '0');
  const minutes = String(jakartaDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
};

const getSiswa = async () => {
  const { data, error } = await supabase.from("siswa").select("*").order("id", { ascending: false });
  if (data) {
    visitors.value = data.map((visitor) => ({
      ...visitor,
      status: visitor.status || "Hadir",
      time: formatToJakartaTime(visitor.time),
      tanggal: formatDate(visitor.tanggal), // Apply formatDate function
    }));
    supabase
      .channel('realtime presensi')
      .on('postgres_changes', { event: '*', schema: '*' }, payload => {
        getSiswa(); // Refresh data when any change happens
      })
      .subscribe();
  }
};

onMounted(() => {
  getSiswa();
});

const updateData = async () => {
  const { error } = await supabase.from("siswa").update({
    nama: selectedVisitor.value.nama,
    kelas: selectedVisitor.value.kelas,
    status: selectedVisitor.value.status
  }).eq('id', selectedVisitor.value.id);

  if (!error) {
    isEditing.value = false;
    getSiswa();
  } else {
    console.error("Error updating data:", error);
  }
};

const hapusData = async () => {
  if (visitorToDelete.value) {
    const { error } = await supabase.from("siswa").delete().eq("id", visitorToDelete.value.id);
    if (!error) {
      getSiswa(); // Refresh data tabel
    } else {
      console.error("Error deleting data:", error);
    }
    showConfirmModal.value = false; // Tutup modal setelah menghapus
    visitorToDelete.value = null; // Reset data setelah menghapus
  }
};


const editData = (visitor) => {
  selectedVisitor.value = { ...visitor };
  isEditing.value = true;
};

const confirmDelete = (visitor) => {
  visitorToDelete.value = visitor; // Simpan data visitor yang akan dihapus
  showConfirmModal.value = true; // Tampilkan modal konfirmasi
};
</script>