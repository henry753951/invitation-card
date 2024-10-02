<script setup lang="ts">
import { gsap } from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

const CardCanvasRef = ref();
const steps = ref("intro" as "intro" | "name" | "email" | "confirm");
const member = ref({
  name: "張宏宇",
  id: "000001",
});
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

<template>
  <div>
    <!-- Background -->
    <div fixed top-0 w-full h-full bg-white>
      <div
        v-for="(block, index) in blocks"
        :key="block.id"
        class="background-block"
        :class="block.bgColor"
        :style="generateEvenlyDistributedStyle(index, blocks.length)"
      />
    </div>
    <!-- Canvas -->
    <div h-100dvh overflow-hidden sticky top-0>
      <ClientOnly>
        <CardCanvasView ref="CardCanvasRef" :member="member" />
      </ClientOnly>
    </div>

    <!-- Title -->

    <Transition name="fade">
      <div fixed top-30 flex justify-center items-center w-full v-if="steps === 'intro'">
        <div container>
          <div text-center>
            <p class="text-4xl font-bold title-text">歡迎加入 開發者俱樂部</p>
            <p class="text-lg text-gray-500 subtitle-text">你是第 1 位加入的會員</p>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Actions -->
    <div fixed bottom-0 flex justify-center items-center p-10 w-full>
      <div container>
        <div v-if="steps === 'intro'">
          <Button
            rounded
            w-full
            @click="CardCanvasRef.reverseCard(true) ? (steps = 'name') : (steps = 'intro')"
            size="large"
          >
            Get Started
          </Button>
        </div>

        <div v-else-if="steps === 'name'" space-y="20vh" flex-col>
          <div
            rounded-xl
            bg="white/70"
            py-8
            px-6
            backdrop-filter="blur(10px)"
            shadow-sm
            max-w="500px"
            mx-auto
          >
            <p class="text-xl mb-3">你的名字是？</p>
            <InputText
              rounded
              w-full
              v-model="member.name"
              placeholder="Your Name"
              size="large"
              @keydown.enter="steps = 'email'"
            />
          </div>
          <Button
            rounded
            w-full
            @click="CardCanvasRef.reverseCard(true) ? (steps = 'name') : (steps = 'intro')"
            size="large"
          >
            Next
          </Button>
        </div>
      </div>
    </div>

    <!-- Section -->
    <div class="section">
      <div w-full flex justify-center items-center p-3>
        <Icon name="hugeicons:menu-09" size="2xl" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.background-block {
  position: absolute;
  border-radius: 50%;
  opacity: 0.7;
  filter: blur(20vh);
}

.section {
  position: fixed;
  top: calc(100%);
  background-color: rgba(250, 250, 250, 0.7);
  border-radius: 2rem;
  backdrop-filter: blur(10px);
  width: 100%;
  height: 100vh;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
}

// Fade Transition
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s ease;
}

.fade-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.fade-enter-to {
  transform: translateY(0%);
  opacity: 1;
}

.fade-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.fade-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
