<template>
  <div class="flex flex-col items-center space-y-16 py-20 h-fit">
    <!-- 介紹 -->
    <section ref="introSection" class="max-w-3xl px-4">
      <div class="text-center">
        <p class="text-4xl font-extrabold text-blue-600 mb-4">我們是開發者俱樂部</p>
        <p class="text-lg text-gray-700">
          開發者俱樂部致力於為熱愛技術的夥伴們提供一個學習、分享和成長的平台。我們組織各種活動，包括工作坊、講座和社交聚會，讓每一位成員都能在這裡找到自己的位置。
        </p>
      </div>
    </section>

    <!-- 社團宗旨 -->
    <section ref="missionSection" class="max-w-3xl px-4">
      <div class="text-center">
        <p class="text-3xl font-bold text-green-500 mb-4">社團宗旨</p>
        <ul class="list-disc list-inside text-left text-gray-700 space-y-2">
          <li>促進技術知識的交流與分享</li>
          <li>提供實戰經驗和技能提升的機會</li>
          <li>建立一個支持與合作的社群環境</li>
          <li>推動創新與創意的發展</li>
        </ul>
      </div>
    </section>

    <!-- 連結區 -->
    <section ref="linksSection" class="max-w-3xl px-4">
      <div class="flex justify-center space-x-8">
        <!-- Instagram 連結 -->
        <a
          href="https://www.instagram.com/yourclub"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center hover:text-blue-600 transition-colors"
        >
          <Icon name="mdi:instagram" size="48" />
          <span class="mt-2 text-sm">Instagram</span>
        </a>

        <!-- Discord 連結 -->
        <a
          href="https://discord.gg/yourclub"
          target="_blank"
          rel="noopener noreferrer"
          class="flex flex-col items-center hover:text-indigo-600 transition-colors"
        >
          <Icon name="mdi:discord" size="48" />
          <span class="mt-2 text-sm">Discord</span>
        </a>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
const props = defineProps<{
  member: { nth: string; name: string; email: string };
}>();
</script>

<style scoped></style>
