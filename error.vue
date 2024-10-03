<template>
    <Html min-h-screen>
      <Body overflow-x-hidden>
        <div class="fixed h-1 w-full bg-transparent" />
        <NuxtLayout>
          <div grid place-items-center px-6 py-24 sm="py-32" lg="px-8">
            <div text-center>
              <p v-if="showStatusCode" text-xl text-emerald-500 font-semibold>
                {{ error?.statusCode }}
              </p>
              <h1 mt-4 text-3xl font-bold tracking-tight sm="text-5xl">
                {{ errorData.title }}
              </h1>
              <p mt-6 text-base text-neutral-800 leading-7>
                {{ errorData.message }}
              </p>
              <div mt-10 flex items-center justify-center gap-x-6>
                <Button block @click="handleError">
                  返回首頁
                </Button>
              </div>
            </div>
          </div>
        </NuxtLayout>
      </Body>
    </Html>
  </template>
  
  <script lang="ts" setup>
  import type { NuxtError } from "#app";
  
  const props = defineProps({
    error: Object as () => NuxtError,
  });
  
  const showStatusCode = computed(() =>
    ["404", "500", "403", "401"].includes((props.error?.statusCode || "").toString())
  );
  
  const errorData = computed(() => {
    switch (props.error?.statusCode) {
      case 404:
        return {
          title: "頁面未找到",
          message: "很抱歉，我們找不到您要查看的頁面。",
        };
      case 500:
        return {
          title: "內部伺服器錯誤",
          message: "伺服器遇到問題，請稍後再試。",
        };
      case 401:
        return {
          title: "未授權",
          message: "您沒有訪問該頁面的權限。",
        };
      case 403:
        return {
          title: "禁止訪問",
          message: "您無權訪問此頁面。",
        };
      default:
        return {
          title: "未知錯誤",
          message: "發生未知錯誤，請稍後再試。",
        };
    }
  });
  
  const handleError = () => clearError({ redirect: "/" });
  </script>
  