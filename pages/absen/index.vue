<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-lg">
      <h2 class="text-2xl font-bold mb-6 text-center">Tambah Data Siswa</h2>
      <form @submit.prevent="submitForm">
        <!-- Nama Siswa -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="name"> Nama Siswa </label>
          <input v-model="name" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="name" type="text" placeholder="Masukkan Nama Siswa" />
        </div>

        <!-- Kelas -->
        <div class="mb-4">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="kelas"> Kelas </label>
          <input v-model="kelas" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="kelas" type="text" placeholder="Masukkan Kelas" />
        </div>

        <!-- Keterangan -->
        <div class="mb-6">
          <label class="block text-gray-700 text-sm font-bold mb-2" for="keterangan"> Keterangan </label>
          <textarea v-model="keterangan" class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="keterangan" placeholder="Masukkan Keterangan"></textarea>
        </div>

        <!-- Submit Button -->
        <div class="flex items-center justify-between">
          <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Simpan Data</button>
        </div>
      </form>

      <!-- Pesan Error (jika ada) -->
      <p v-if="errorMessage" class="text-red-500 mt-4">{{ errorMessage }}</p>

      <!-- Pesan Sukses -->
      <p v-if="successMessage" class="text-green-500 mt-4">{{ successMessage }}</p>
    </div>
  </div>
</template>

<script setup>
const name = ref("");
const kelas = ref("");
const keterangan = ref("");
const errorMessage = ref("");
const successMessage = ref("");

const submitForm = async () => {
  // Reset pesan
  errorMessage.value = "";
  successMessage.value = "";

  if (!name.value || !kelas.value || !keterangan.value) {
    errorMessage.value = "Semua field harus diisi!";
    return;
  }

  // Insert data siswa ke Supabase
  const { data, error } = await supabase.from("students").insert([{ name: name.value, kelas: kelas.value, keterangan: keterangan.value }]);

  if (error) {
    errorMessage.value = error.message;
  } else {
    successMessage.value = "Data berhasil disimpan!";
    name.value = "";
    kelas.value = "";
    keterangan.value = "";
  }
};
</script>
