<template>
  <div class="text-center text-3xl mt-16">
    <h1>Anda sedang keluar dari halaman Absensi...</h1>
  </div>
</template>

<script setup>
const supabase = useSupabaseClient()

async function logout() {
  const { error } = await supabase.auth.signOut();
  if (!error) {
    navigateTo("/");  // Arahkan ke halaman login setelah logout berhasil
  } else {
    console.error("Error logging out:", error.message);  // Tangani error jika ada
  }
}

onMounted(() => {
  logout();  // Jalankan logout saat halaman ini diakses
})
</script>
