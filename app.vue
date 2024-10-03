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

<style lang="scss"></style>
