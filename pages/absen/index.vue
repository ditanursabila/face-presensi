<template> 
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8  rounded-lg shadow-md me-10 w-full max-w-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Tambah Absensi</h2>
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
          <input v-model="form.status" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="keterangan" placeholder="Masukkan Keterangan"></input>
        </div>

        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Simpan Data</button>
          
          <nuxt-link to="/logout" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> Logout </nuxt-link>
        </div>
      </form>
    </div>

    <div class="flex items-center justify-center bg-gray-100">
      <div class="bg-white ms-10 rounded-lg shadow-md  max-w-5xl">
        <div class="max-h-[320px] overflow-auto border border-black p-4 m-5 mt-[65px] shadow-xl flex-1">
          <div class="text-2xl font-semibold text-center">
            <h3>Presensi Hari Ini {{ formatDate(today) }}</h3>
          </div>

          <div class="flex justify-between mb-4 mt-5">
            <input type="date" @change="filterData" class="border p-2 rounded" />
          </div>

          <table class="border-collapse border border-black w-full min-w-full table-auto">
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
                  <button @click="hapusData(visitor.id)" class="text-red-600 hover:underline"> | Hapus</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Popup Edit -->
    <div v-if="isEditing" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div class="bg-white p-6 rounded-lg shadow-xl">
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
          <button @click="updateData" class="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded">Simpan</button>
          <button @click="isEditing = false" class="bg-gray-500 hover:bg-gray-700 text-white py-2 px-4 rounded">Batal</button>
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

const supabase = useSupabaseClient();
const form = ref({
  nama: "",
  kelas: "",
  status: "",
});

const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${parseInt(day)}-${parseInt(month)}-${year}`;
};

const today = ref(getTodayDate()); // Inisialisasi today setelah getTodayDate didefinisikan

const kirimData = async () => {
  const { error } = await supabase.from("siswa").insert([form.value]);
  if (!error) {
    form.value = { nama: "", kelas: "", status: "" }; // Reset form
    getSiswa(); // Refresh data tabel
  }
};

const visitors = ref([]);
const selectedDate = ref(null);
const isEditing = ref(false);
const selectedVisitor = ref(null);

const formatDate = (dateString) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

const formatTime = (timeString) => {
  if (!timeString) return '00:00';
  const [hours, minutes] = timeString.split(":");
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
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

const hapusData = async (id) => {
  const { error } = await supabase.from("siswa").delete().eq('id', id);
  if (!error) {
    getSiswa();
  } else {
    console.error("Error deleting data:", error);
  }
};

const editData = (visitor) => {
  selectedVisitor.value = { ...visitor };
  isEditing.value = true;
};

// Fungsi untuk filter data berdasarkan tanggal
async function filterData(event) {
  try {
    const { data, error } = await supabase.from("siswa").select().eq("tanggal", event.target.value);
    if (error) {
      console.error("Error filtering data:", error);
    } else {
      visitors.value = data.map((visitor) => ({
        ...visitor,
        time: formatTime(visitor.time), // Pastikan waktu dalam format HH:MM
      }));
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}

</script>
