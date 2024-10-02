<template> 
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Tambah Data Siswa</h2>
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

const kirimData = async () => {
  const { error } = await supabase.from("siswa").insert([form.value]);
  if (!error) navigateTo("/");
};
</script>
