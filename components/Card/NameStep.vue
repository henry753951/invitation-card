<template>
  <div v-if="show" class="flex flex-col items-center space-y-20vh w-full">
    <div
      class="rounded-xl bg-white/70 p-6 backdrop-filter-blur-10px shadow-sm max-w-400px mx-auto w-full"
    >
      <p class="text-xl mb-3">你的名字是？</p>
      <input v-model="member.name" class="input" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  member: {
    type: Object,
    required: true,
  },
  CardCanvasRef: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.input {
  width: 100%;
  padding: 0.5rem;
  border-radius: 0.5rem;
  font-size: 1rem;
  outline: none;
  background-color: rgba(214, 214, 214, 0.7);
  backdrop-filter: blur(10px);
}
</style>
