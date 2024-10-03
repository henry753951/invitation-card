<template>
  <div></div>
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
/* 你可以在這裡添加特定的樣式 */
</style>
