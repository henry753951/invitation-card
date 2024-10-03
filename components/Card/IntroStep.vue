<template>
  <Transition name="fadeDown" mode="out-in">
    <div fixed top-30 flex justify-center items-center w-full v-if="show">
      <div class="container">
        <div class="text-center">
          <p class="text-4xl font-bold title-text">{{title}}</p>
          <p class="text-lg text-gray-500 subtitle-text">
            你是第
            <span class="text-blue-500 font-mono">
              {{ formattedCount }}
            </span>
            位加入的會員
          </p>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { gsap } from "gsap";

// 接收 `show` 屬性
const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  nth: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
});

const count = computed(() => parseInt(props.nth || "1"));
const currentCount = ref(0);

const formattedCount = computed(() => {
  return String(currentCount.value).padStart(6, "0");
});

watch(
  () => props.show,
  (newVal) => {
    if (newVal) {
      startCountingAnimation();
    }
  },
);

watch(
  () => count,
  (newVal) => {
    startCountingAnimation();
  },
);

onMounted(() => {
  if (props.show) {
    startCountingAnimation();
  }
});

// 使用 GSAP 來做計數動畫
const startCountingAnimation = () => {
  const randomStart = Math.floor(Math.random() * 1000000); // 隨機起始值
  currentCount.value = randomStart;

  gsap.fromTo(
    currentCount,
    { value: randomStart },
    {
      value: count.value,
      duration: 2, // 設定動畫持續時間
      ease: "power2.out", // 動畫過渡效果
      onUpdate: () => {
        // 當動畫更新時，強制 Vue 重新渲染顯示的值
        currentCount.value = Math.floor(currentCount.value);
      },
    },
  );
};
</script>

<style scoped>
.title-text {
  margin-bottom: 0.5rem;
}
.subtitle-text {
  margin-top: 1rem;
}
</style>
