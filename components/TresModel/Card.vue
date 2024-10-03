<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
const emits = defineEmits(["onload"]);
const { scene: model } = await useGLTF("/assets/models/card.1.gltf");
setTimeout(() => {
  emits("onload");
}, 1300);
</script>

<template>
  <primitive :object="model" />
</template>
