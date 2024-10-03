<script setup lang="ts">
import { TresCanvas, extend, useTexture } from "@tresjs/core";
import { OrbitControls, Html } from "@tresjs/cientos";

import { BasicShadowMap, SRGBColorSpace, NoToneMapping, Vector3 } from "three";
import gsap from "gsap";
const gl = {
  shadows: true,
  alpha: true,
  shadowMapType: BasicShadowMap,
  outputColorSpace: SRGBColorSpace,
  toneMapping: NoToneMapping,
  windowSize: false,
};

const isIntroDone = defineModel("isIntroDone", {
  type: Boolean,
  default: false,
});

const cardRef = shallowRef();
const controlRef = ref();
const cameraRef = ref();
const animateCard = () => {
  if (!cardRef.value && !controlRef.value) return;
  gsap.killTweensOf(cardRef.value.position);
  gsap.killTweensOf(cardRef.value.rotation);
  controlRef.value.instance.reset();

  cardRef.value.position.y = -7;
  cardRef.value.rotation.y = 0;

  gsap.to(cardRef.value.position, {
    y: 0,
    duration: 3,
    ease: "power2.out",
    onComplete: () => {
      isIntroDone.value = true;
    },
  });

  gsap.to(cardRef.value.rotation, {
    y: Math.PI * 2,
    duration: 2.7,
    ease: "power2.out",
  });
};
const reverse = ref(false);
const reverseTween = {
  rotate: null as gsap.core.Tween | null,
  position: null as gsap.core.Tween | null,
  scale: null as gsap.core.Tween | null,
};

const reverseCard = (floating = false, forced = false) => {
  if (!isIntroDone.value) return false;

  for (const tween in reverseTween) {
    if (reverseTween[tween as keyof typeof reverseTween]) {
      reverseTween[tween as keyof typeof reverseTween]!.kill();
    }
  }

  if (forced) {
    reverse.value = true;
  } else {
    reverse.value = !reverse.value;
  }

  const currentPolar = controlRef.value.instance.getPolarAngle();
  const currentAzimuth = controlRef.value.instance.getAzimuthalAngle();

  const targetPolar = Math.PI / 2;
  const targetAzimuth = !reverse.value ? Math.PI : 0;

  const angles = { polar: currentPolar, azimuth: currentAzimuth };

  reverseTween.rotate = gsap.to(angles, {
    polar: targetPolar,
    azimuth: targetAzimuth,
    duration: 0.8,
    ease: "power2.out",
    onUpdate: () => {
      controlRef.value.instance.setPolarAngle(angles.polar);
      controlRef.value.instance.setAzimuthalAngle(angles.azimuth);
    },
  });

  if (floating) {
    const targetY = reverse.value ? 3 : 0;
    reverseTween.position = gsap.to(cardRef.value.position, {
      y: targetY,
      duration: 0.8,
      ease: "power2.out",
    });
    reverseTween.scale = gsap.to(cardRef.value.scale, {
      y: reverse.value ? 0.8 : 1,
      x: reverse.value ? 0.8 : 1,
      z: reverse.value ? 0.8 : 1,
      duration: 0.8,
      ease: "power2.out",
    });
  } else {
    reverseTween.position = gsap.to(cardRef.value.position, {
      y: 0,
      duration: 0.8,
      ease: "power2.out",
    });
    reverseTween.scale = gsap.to(cardRef.value.scale, {
      y: 1,
      x: 1,
      z: 1,
      duration: 0.8,
      ease: "power2.out",
    });
  }

  return reverse.value;
};

const props = defineProps<{
  member: { nth: string; name: string; email: string };
  rotating: boolean;
  topping: boolean;
}>();


watch(() => props.topping, (topping) => {
  if(topping) {
    gsap.to(cardRef.value.position, {
      y: 4,
      duration: 1,
      ease: "power2.out",
    });
    gsap.to(cardRef.value.scale, {
      y: 0.5,
      x: 0.5,
      z: 0.5,
      duration: 1,
      ease: "power2.out",
    });
  } else {
    gsap.to(cardRef.value.position, {
      y: 0,
      duration: 1,
      ease: "power2.out",
    });
    gsap.to(cardRef.value.scale, {
      y: 1,
      x: 1,
      z: 1,
      duration: 1,
      ease: "power2.out",
    });
  }
});

defineExpose({
  animateCard,
  reverseCard,
});
</script>

<template>
  <TresCanvas v-bind="gl">
    <TresPerspectiveCamera :position="[0, 0, -11]" ref="cameraRef" />
    <OrbitControls
      :enable-pan="false"
      :auto-rotate="rotating"
      :enable-zoom="false"
      ref="controlRef"
      :enable-rotate="!reverse || rotating"
    />

    <!-- Card -->
    <TresGroup ref="cardRef" cast-shadow :position="[0, -7, 0]" :scale="[1, 1, 1]">
      <Suspense cast-shadow>
        <TresModelCard cast-shadow @onload="animateCard" />
      </Suspense>

      <Html transform :position="[0, 0, 0.01]" occlude>
        <div flex flex-col gap-3 z="-10" w-200px h-130px p-4 relative class="back-html">
          <div flex w-full gap-3>
            <div class="badge" p-2>
              <img src="~/assets/imgs/logo.png" alt="GDG Logo" h-10px />
            </div>
            <div class="badge" p-1 w-full bg-gray-200 opacity-50>
              {{ member.name ? member.name : "Your name" }}
            </div>
          </div>
          <p text-size="0.5rem" p-1 overflow-hidden>{{ member.email }}</p>
          <p absolute bottom-0 right-0 p-2 opacity-80 text-size="0.5rem">GDG on Campus</p>
          <p absolute bottom-0 left-0 p-2 opacity-80 text-size="0.5rem"># {{ member.nth }}</p>
        </div>
      </Html>
    </TresGroup>

    <!-- Light -->
    <TresDirectionalLight :position="[0, 2, 4]" :intensity="3" cast-shadow />
    <TresDirectionalLight :position="[0, 2, -4]" :intensity="1.2" cast-shadow />
    <TresAmbientLight :intensity="2" />
  </TresCanvas>
</template>

<style lang="scss" scoped>
.badge {
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 0.5rem;
  font-weight: 700;
  color: #000;
  user-select: none;
}

.back-html {
  pointer-events: none;
  user-select: none;
}
</style>
