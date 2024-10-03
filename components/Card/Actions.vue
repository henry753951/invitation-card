<template>
  <div class="w-full flex justify-center items-center">
    <div class="w-full" v-auto-animate>
      <!-- 當前步驟的主要按鈕 -->
      <Button v-if="steps !== 'confirm'" rounded w-full @click="handleNext" size="large">
        {{ stepsConfig[steps].previous ? "下一步" : "立刻開始" }}
      </Button>
      <Button v-if="steps === 'confirm'" rounded w-full @click="handleNext" size="large" :disabled="submitting">
        {{ submitting ? "儲存中..." : "確認送出" }}
      </Button>

      <!-- 上一步按鈕，除了第一步（intro）之外顯示 -->
      <Button
        v-if="stepsConfig[steps].previous"
        rounded
        w-full
        @click="handlePrevious"
        size="large"
        class="mt-4"
        text
      >
        上一步
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from "vue";

// 定義傳入的屬性
const props = defineProps({
  steps: {
    type: String as () => "intro" | "name" | "email" | "confirm",
    required: true,
  },
  CardCanvasRef: {
    type: Object,
    required: true,
  },
  submitting: {
    type: Boolean,
    required: false,
  },
});

// 步驟配置物件
const stepsConfig = {
  intro: {
    next: "name",
    previous: null,
  },
  name: {
    next: "email",
    previous: "intro",
  },
  email: {
    next: "confirm",
    previous: "name",
  },
  confirm: {
    next: "submit",
    previous: "email",
  },
};

const emit = defineEmits(["change-step"]);
const handleNext = () => {
  if (stepsConfig[props.steps].next) {
    emit("change-step", stepsConfig[props.steps].next);
  }
};

const handlePrevious = () => {
  if (stepsConfig[props.steps].previous) {
    emit("change-step", stepsConfig[props.steps].previous);
  }
};
</script>

<style scoped></style>
