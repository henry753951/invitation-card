<template>
  <div>
    <!-- Loading Animation -->
    <div v-if="isLoading" class="loading-screen">
      <div flex items-center gap-5 class="gdg-content">
        <div h-40px md:h-50px>
          <img src="~/assets/imgs/logo.png" class="gdg-logo" alt="GDG Logo" />
        </div>
        <div>
          <h1 class="gdg-text">Google Developer Group</h1>
          <h2 class="gdg-subtitle">
            <span class="subtitle">On Campus</span>
            <span class="dot">•</span>
            <span class="location">NUK</span>
          </h2>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-show="!isLoading">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { gsap } from "gsap";

const nuxtApp = useNuxtApp();
const isLoading = ref(true);

nuxtApp.hook("page:start", () => {
  isLoading.value = true;
});

nuxtApp.hook("page:finish", () => {
  setTimeout(() => {
    gsap.to(".gdg-content", {
      duration: 2,
      y: -100,
      ease: "power4.out",
      onComplete: () => {
        isLoading.value = false;
      },
    });
    gsap.to(".loading-screen", {
      duration: 2,
      opacity: 0,
      ease: "power4.out",
      onComplete: () => {
        isLoading.value = false;
      },
    });
  }, 1200);
});

watch(isLoading, (newValue) => {
  if (!newValue) {
  }
});
</script>

<style lang="scss" scoped>
.loading-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100dvh;
  background-color: #ffffff;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
}

.gdg-logo {
  height: 100%;
}

.gdg-text {
  font-size: 36px;
  font-weight: bold;
  margin: 0;
  @media screen and (max-width: 768px) {
    font-size: 20px;
  }
}

.gdg-subtitle {
  font-size: 24px;
  color: #4285f4; /* Google Blue */
  @media screen and (max-width: 768px) {
    font-size: 18px;
  }
}

.subtitle {
  color: #4285f4; /* Blue subtitle */
}

.dot {
  color: #000;
  margin: 0 10px;
}

.location {
  color: #000;
}
</style>
