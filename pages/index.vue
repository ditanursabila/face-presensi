<template>
  <!-- <span class="mt-5 mb-5 inline-flex items-center md:ms-[250px] bg-green-100 text-green-800 text-xs font-medium px-5 py-1.5 rounded-full dark:bg-green-900 dark:text-green-300">
    <span class="w-2 h-2 me-1 bg-green-500 rounded-full"></span>
    Terdeteksi
  </span> -->
  <span class="mt-5 mb-5 inline-flex items-center md:ms-[250px] bg-red-100 text-red-800 text-xs font-medium px-5 py-1.5 rounded-full dark:bg-red-900 dark:text-red-300">
    <span class="w-2 h-2 me-1 bg-red-500 rounded-full"></span>
    Gagal Deteksi
  </span>

  <div class="flex md:h-[350px]">
    <div class="w-1/2 border border-black p-4 m-2">
      <div class="flex">
        <div class="w-full md:h-[300px] bg-black flex items-center justify-center">
          <!-- <p class="text-white text-lg">Camera Feed Placeholder</p> -->
          <div>Teachable Machine Image Model</div>
          <button type="button" onclick="init()">Start</button>
          <div id="webcam-container"></div>
          <div id="label-container"></div>
        </div>
      </div>
    </div>

    <div class="w-1/2 border border-black p-4 m-2">
      <div class="judul text-2xl font-semibold text-center mb-5">
        <h3>Presensi Hari Ini {{}}</h3>
      </div>
      <table class="border-collapse border border-black w-full">
        <thead class="bg-[#0365AE] text-white">
          <tr>
            <th class="border border-black">NO</th>
            <th class="border border-black">Nama</th>
            <th class="border border-black">Kelas</th>
            <th class="border border-black">Jurusan</th>
            <th class="border border-black">Waktu</th>
            <th class="border border-black">Keterangan</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(visitor, i) in visitors" :key="i">
            <td class="border border-black">{{ i + 1 }}.</td>
            <td class="border border-black">{{ visitor.nama }}</td>
            <td class="border border-black">{{ visitor.kelas }}</td>
            <td class="border border-black">{{ visitor.jurusan }}</td>
            <td class="border border-black">{{ visitor.time }}</td>
            <td class="border border-black">{{ visitor.ket }}</td>
          </tr>
        </tbody>
      </table>
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

const getSiswa = async () => {
  const { data } = await supabase.from("allsiswa").select("*");
  if (data) visitors.value = data;
};
onMounted(() => {
  getSiswa();
});
</script>
