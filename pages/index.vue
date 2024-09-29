<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 p-4">
        <Cam />
      </div>

      <div class="max-w-full max-h-[348px] overflow-auto border border-black p-4 m-5 mt-[65px] shadow-xl flex-1">
        <div class="text-2xl font-semibold text-center">
          <h3>Presensi Hari Ini {{ formatDate(today) }}</h3>
        </div>

        <div class="flex justify-between mb-4 mt-5">
          <input type="date" v-model="selectedDate" class="border p-2 rounded" />
          <button @click="applyFilter" class="bg-blue-500 text-white px-2 me-80 rounded">Apply</button>
        </div>
        <div class="mb-5">
          <nuxt-link to="/login" class="bg-green-700 text-white px-2 py-2 rounded"> Tambah Siswa </nuxt-link>
        </div>

        <table class="border-collapse border border-black w-full min-w-full table-auto">
          <thead class="bg-[#0365AE] text-white">
            <tr>
              <th class="border border-black">NO</th>
              <th class="border border-black">Siswa</th>
              <th class="border border-black">Waktu</th>
              <th class="border border-black">Keterangan</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(visitor, i) in visitors" :key="i">
              <td class="border border-black">{{ i + 1 }}.</td>
              <td class="border border-black">{{ visitor.nama }}</td>
              <td class="border border-black">{{ visitor.tanggal }} , {{ visitor.time }}</td>
              <td class="border border-black">{{ visitor.status }}</td>
            </tr>
          </tbody>
        </table>
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
      content: "Presensi",
    },
  ],
});
const supabase = useSupabaseClient();
const visitors = ref([]);
const selectedDate = ref(null);
const today = ref("");

const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${parseInt(day)}-${parseInt(month)}-${year}`;
};

const getSiswa = async () => {
  const { data } = await supabase
    .from("allsiswa")
    .select("*")
    .order("id", { ascending: false })
    .on("INSERT", (payload) => {
      visitors.value.unshift(payload.new);
    });
  if (data) {
    visitors.value = data.map((visitor) => ({
      ...visitor,
      status: "Hadir",
      tanggal: formatDate(visitor.tanggal),
    }));
  }
};

onMounted(() => {
  today.value = getTodayDate();
  selectedDate.value = today.value;
  getSiswa();
});

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

// Computed property untuk filter data berdasarkan tanggal
const filteredVisitors = computed(() => {
  if (!selectedDate.value) return visitors.value; // Tampilkan semua data jika tidak ada tanggal yang dipilih
  return visitors.value.filter((visitor) => {
    // Pastikan tanggal siswa cocok dengan tanggal yang dipilih
    return visitor.tanggal === selectedDate.value;
  });
});
const applyFilter = () => {
  // Filter sudah ditangani oleh computed property
};
</script>
