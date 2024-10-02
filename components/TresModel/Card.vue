<script setup lang="ts">
import { useGLTF } from "@tresjs/cientos";
const emits = defineEmits(["onload"]);
const { scene: model } = await useGLTF("/_nuxt/assets/models/card.1.gltf");
emits("onload");
</script>

<template>
  <primitive :object="model" />
</template>
