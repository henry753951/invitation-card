<template>
  <div>
    <LoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <div absolute>
      <!-- overlay -->
      <Toast position="top-center" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// add light class to body
onMounted(() => {
  document.body.classList.add("light");
}); 

</script>

<style lang="scss"></style>
