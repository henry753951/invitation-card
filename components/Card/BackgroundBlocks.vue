<template>
  <div fixed top-0 w-full h-full bg-white>
    <div
      v-for="(block, index) in blocks"
      :key="block.id"
      class="background-block"
      :class="block.bgColor"
      :style="generateEvenlyDistributedStyle(index, blocks.length)"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { gsap } from "gsap";

const blocks = ref([
  { id: 1, bgColor: "bg-red-500" },
  { id: 2, bgColor: "bg-blue-500" },
  { id: 3, bgColor: "bg-yellow-500" },
  { id: 4, bgColor: "bg-green-500" },
]);

// 初始化色块动画
const generateEvenlyDistributedStyle = (index: number, total: number) => {
  const size = gsap.utils.random(20, 30);
  const rows = Math.ceil(Math.sqrt(total));
  const cols = Math.ceil(total / rows);

  const row = Math.floor(index / cols);
  const col = index % cols;
  const top = (row / rows) * 100 + gsap.utils.random(-5, 0);
  const left = (col / cols) * 100 + gsap.utils.random(-5, 0);

  return {
    width: `${size}vh`,
    height: `${size}vh`,
    top: `${top}vh`,
    left: `${left}vw`,
  };
};

// 初始化色塊動畫
const initBackgroundAnimation = () => {
  const blocksElements = gsap.utils.toArray(".background-block") as HTMLElement[];
  if (blocksElements.length > 0) {
    blocksElements.forEach((block) => {
      const { width, height, top, left } = block.getBoundingClientRect();
      const maxX = window.innerWidth - width - left;
      const minX = -left;
      const maxY = window.innerHeight - height - top;
      const minY = -top;

      gsap.to(block, {
        x: () => gsap.utils.random(minX, maxX),
        y: () => gsap.utils.random(minY, maxY),
        repeat: -1,
        yoyo: true,
        duration: gsap.utils.random(4, 10),
        ease: "power1.inOut",
      });
    });
  }
};

onMounted(() => {
  initBackgroundAnimation();
});

onBeforeUnmount(() => {
  gsap.killTweensOf(".background-block");
});
</script>

<style scoped lang="scss">
.background-block {
  position: absolute;
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(20vh);
}
</style>
