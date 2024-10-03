<template>
  <div @wheel="handleWheel">
    <!-- 背景 -->
    <CardBackgroundBlocks z="-10" />
    <!-- 畫布 -->
    <div class="h-100dvh overflow-hidden sticky top-0">
      <ClientOnly>
        <CardCanvasView
          ref="CardCanvasRef"
          :member="member"
          :rotating="rotating || wasRegistered"
          :topping="isSectionUp"
          v-model:is-intro-done="isIntroDone"
        />
      </ClientOnly>
    </div>
    <CardIntroStep
      :show="steps === 'intro' && !wasRegistered"
      :nth="member.nth"
      :title="'歡迎加入 開發者俱樂部'"
    />
    <CardIntroStep
      :show="wasRegistered && !isSectionUp"
      :nth="member.nth"
      :title="'歡迎回來 ' + member.name"
    />
    <template v-if="!wasRegistered">
      <!-- Actions -->
      <Transition name="fadeUp" appear>
        <div fixed bottom-0 flex justify-center items-center w-full p-5 v-if="isIntroDone">
          <div class="container" gap-5 flex-col flex>
            <CardNameStep
              :show="steps === 'name'"
              v-model:member="member"
              v-model:CardCanvasRef="CardCanvasRef"
            />
            <CardEmailStep
              :show="steps === 'email'"
              v-model:member="member"
              v-model:CardCanvasRef="CardCanvasRef"
            />
            <CardConfirmStep
              :show="steps === 'confirm'"
              v-model:member="member"
              v-model:CardCanvasRef="CardCanvasRef"
            />
            <CardActions
              :steps="steps"
              :CardCanvasRef="CardCanvasRef"
              @change-step="changeStep"
              :submitting="submitting"
            />
          </div>
        </div>
      </Transition>
    </template>

    <template v-else>
      <!-- Section -->
      <div
        class="section"
        :class="{ up: isSectionUp }"
        ref="sectionRef"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <div class="w-full flex justify-center items-center p-3 h-5rem">
          <div gap-1 flex flex-col items-center class="swipe-up-icon">
            <Icon name="hugeicons:swipe-up-07" size="2xl" v-if="!isSectionUp" />
            <p v-if="!isSectionUp" class="text-gray-500">Swipe up from here</p>
            <p v-else class="text-gray-500">Swipe down to close</p>
          </div>
        </div>
        <div class="content-card py-8 flex justify-center" ref="sectionContentRef">
          <div container>
            <CardContent w-full :member="member" />
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useRoute } from "vue-router";
import { useToast } from "primevue/usetoast";
import { useScroll } from "@vueuse/core";

const toast = useToast();
const route = useRoute();

const sectionContentRef = ref<HTMLElement | null>(null);
const { arrivedState: sectionContentArrivedState } = useScroll(sectionContentRef);
const CardCanvasRef = ref();
const steps = ref<"intro" | "name" | "email" | "confirm">("intro");
const rotating = ref(false);
const isIntroDone = ref(false);
const submitting = ref(false);

const { wasRegistered, data, saveData } = await useCardData(route.params.card_id as string);
const member = ref({
  name: data.value?.user?.name || "",
  email: data.value?.user?.email || "",
  nth: data.value?.nth || "000001",
});

const changeStep = (newStep: "intro" | "name" | "email" | "confirm" | "submit") => {
  if (newStep === "submit") {
    handleSubmit();
    return;
  }
  rotating.value = false;
  steps.value = newStep;
  if (newStep === "confirm") {
    CardCanvasRef.value.reverseCard(false, true);
    rotating.value = true;
  } else if (newStep === "name") {
    CardCanvasRef.value.reverseCard(true, true);
  } else if (newStep === "email") {
    CardCanvasRef.value.reverseCard(true, true);
  } else if (newStep === "intro") {
    CardCanvasRef.value.reverseCard(true, false);
  }
};

const handleSubmit = () => {
  submitting.value = true;
  saveData(member.value)
    .then(() => {
      submitting.value = false;
    })
    .catch((e) => {
      submitting.value = false;
      toast.add({ severity: "error", summary: "儲存失敗", detail: e.message, life: 3000 });
    });
};

// 新增的代碼：滑動手勢和滾輪事件處理
const sectionRef = ref<HTMLElement | null>(null);
let touchStartY = 0;
let touchEndY = 0;
const isSectionUp = ref(false); // 用於追蹤當前狀態

// 防抖處理，避免動畫被過於頻繁地觸發
let isAnimating = false;
const animationDuration = 500; // 毫秒，需與 CSS transition 持續時間相匹配

const handleTouchStart = (e: TouchEvent) => {
  touchStartY = e.changedTouches[0].screenY;
};

const handleTouchEnd = (e: TouchEvent) => {
  touchEndY = e.changedTouches[0].screenY;
  handleGesture();
};

const handleGesture = () => {
  if (isAnimating) return;

  const swipeThreshold = 50;

  if (touchStartY - touchEndY > swipeThreshold && !isSectionUp.value) {
    // 上滑
    isSectionUp.value = true;
    triggerAnimation();
  } else if (touchEndY - touchStartY > swipeThreshold && isSectionUp.value) {
    // 下滑
    isSectionUp.value = false;
    triggerAnimation();
  }
};

const handleWheel = (e: WheelEvent) => {
  if (isAnimating) return;
  if (!sectionContentArrivedState.top && isSectionUp.value) return;
  const wheelThreshold = 50;

  if (e.deltaY < -wheelThreshold && isSectionUp.value) {
    isSectionUp.value = false;
    triggerAnimation();
  } else if (e.deltaY > wheelThreshold && !isSectionUp.value) {
    isSectionUp.value = true;
    triggerAnimation();
  }
};

const triggerAnimation = () => {
  isAnimating = true;
  setTimeout(() => {
    isAnimating = false;
  }, animationDuration);
};
</script>

<style lang="scss" scoped>
.section {
  position: fixed;
  top: calc(100% - 5rem); // 初始位置
  width: 100%;
  height: 100%;
  bottom: 0;
  transition: top 0.5s ease; // 添加過渡效果，持續時間需與腳本中的 animationDuration 相匹配
  &.up {
    top: 10%;
  }
  .content-card {
    background-color: rgba(250, 250, 250, 0.7);
    border-radius: 2rem;
    backdrop-filter: blur(10px);
    height: 100%;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow-y: auto;
  }
  .swipe-up-icon {
    animation: bounce 1s infinite;
  }
  @keyframes bounce {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-0.5rem);
    }
    100% {
      transform: translateY(0);
    }
  }
}

// fadeDown Transition
.fadeDown-enter-active,
.fadeDown-leave-active {
  transition: all 0.5s ease;
}

.fadeDown-enter-from {
  transform: translateY(-100%);
  opacity: 0;
}

.fadeDown-enter-to {
  transform: translateY(0%);
  opacity: 1;
}

.fadeDown-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.fadeDown-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

// fadeUp Transition
.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: all 0.5s ease;
}

.fadeUp-enter-from {
  transform: translateY(100%);
  opacity: 0;
}

.fadeUp-enter-to {
  transform: translateY(0%);
  opacity: 1;
}

.fadeUp-leave-from {
  transform: translateY(0%);
  opacity: 1;
}

.fadeUp-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
