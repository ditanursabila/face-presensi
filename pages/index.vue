<template>
  <div class="container mx-auto p-4">
    <div class="flex flex-col lg:flex-row gap-4">
      <div class="flex-1 p-4">
        <Cam  @deteksi-wajah="handleDetection"/>
      </div>

      <div class="max-w-full max-h-[348px] overflow-auto border border-black p-4 m-5 mt-[65px] shadow-xl flex-1">
        <div class="text-2xl font-semibold text-center">
          <h3>Presensi Hari Ini {{ formatDate(today) }}</h3>
        </div>

        <div class="flex justify-between mb-4 mt-5">
          <input type="date" @change="filterData" class="border p-2 rounded" />
          <nuxt-link to="/login" class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"> Absensi </nuxt-link>
        </div>
        <div class="mb-5"></div>

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
              <td class="border border-black">{{ visitor.nama }} {{ visitor.kelas }}</td>
              <td class="border border-black">{{ visitor.tanggal }}, {{ visitor.time }}</td>
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
import Cam from '@/components/Cam.vue'; // '@' merujuk ke folder root proyek



const supabase = useSupabaseClient();
const visitors = ref([]);
const selectedDate = ref(null);
const today = ref("");

// Fungsi untuk menangani event deteksi wajah dari komponen Cam
const handleDetection = (data) => {
  console.log('Detected data from Cam:', data);
  // Lakukan sesuatu dengan data ini
};
const getTodayDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${parseInt(day)}-${parseInt(month)}-${year}`;
};

// Fungsi untuk mengonversi waktu ke format 2 digit (HH:MM)
const formatTime = (timeString) => {
  if (!timeString) return '00:00'; // Pastikan timeString tidak kosong

  // Pisahkan jam dan menit dari string time
  const [hours, minutes] = timeString.split(":"); 

  // Pastikan jam dan menit dua digit
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

// Fungsi untuk mengonversi waktu ke waktu Jakarta
const formatToJakartaTime = (timeString) => {
  if (!timeString) return '00:00'; // Pastikan timeString tidak kosong

  // Buat objek Date berdasarkan waktu yang disimpan
  const utcDate = new Date(`1970-01-01T${timeString}Z`); // Z untuk UTC
  const jakartaDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }));

  // Ambil jam dan menit dalam format 2 digit
  const hours = String(jakartaDate.getHours()).padStart(2, '0');
  const minutes = String(jakartaDate.getMinutes()).padStart(2, '0');

  return `${hours}:${minutes}`; // Kembalikan dalam format HH:MM
};



// Mengambil data siswa dari Supabase dan mengatur listener untuk perubahan
const getSiswa = async () => {
  const { data, error } = await supabase.from("siswa").select("*").order("id", { ascending: false });
  if (data) {
    visitors.value = data.map((visitor) => ({
      ...visitor,
      status: visitor.status || "Hadir", // Default status "Hadir" jika belum ada
      time: formatToJakartaTime(visitor.time), // Format waktu ke HH:MM
      tanggal: formatDate(visitor.tanggal),
    }));
    
    // Mengatur channel untuk mendengarkan perubahan
    supabase
      .channel('channel_siswa')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'siswa' }, (payload) => {
        console.log('Data baru:', payload);
        getSiswa(); // Memperbarui data setelah ada perubahan
      })
      .subscribe();
  } else if (error) {
    console.error("Error fetching data from Supabase:", error);
  }
};


// // Fungsi untuk mengambil data siswa dari Supabase
// const getSiswa = async () => {
//   const { data, error } = await supabase.from("siswa").select("*").order("id", { ascending: false });
//   if (data) {
//     visitors.value = data.map((visitor) => ({
//       ...visitor,
//       status: visitor.status || "Hadir", // Default status "Hadir" jika belum ada
//       time: formatToJakartaTime(visitor.time), // Format waktu ke HH:MM
//       tanggal: formatDate(visitor.tanggal),
//     }));
//   } else if (error) {
//     console.error("Error fetching data from Supabase:", error);
//   }
// };



// const getSiswa = async () => {
//   const { data } = await supabase.from("siswa").select("*").order("id", { ascending: false });
//   if (data) {
//     visitors.value = data.map((visitor) => ({
//       ...visitor,
//       status: visitor.status || "H",
//       tanggal: formatDate(visitor.tanggal),
//     }));
//   }

  // supabase
  //   .channel('channel_siswa')
  //   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'siswa' }, handleDariCam)
  //   .subscribe()
// };

const {
  data: students,
  error,
  refresh,
} = useAsyncData(
  "students",
  async () => {
    let query = supabase.from("siswa").select();
    const { data, error } = await query;
    return data;
  },
  {
    immediate: false,
  }
);

onMounted(() => {
  today.value = getTodayDate();
  selectedDate.value = today.value;
  getSiswa();
});

const formatDate = (dateString) => {
  const [year, month, day] = dateString.split("-");
  return `${year}-${month}-${day}`;
};

// async function filterData(event) {
//   const { data, error } = await supabase.from("siswa").select().eq("tanggal", event.target.value);
//   if (data) {
//     visitors.value = data;
//   }
// }

// Fungsi untuk filter data berdasarkan tanggal
async function filterData(event) {
  try {
    const { data, error } = await supabase.from("siswa").select().eq("tanggal", event.target.value);
    if (error) {
      console.error("Error filtering data:", error);
    } else {
      visitors.value = data.map((visitor) => ({
        ...visitor,
        time: formatToJakartaTime(visitor.time), // Pastikan waktu dalam format HH:MM
      }));
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}


</script>
