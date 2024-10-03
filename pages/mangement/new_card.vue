<template>
  <div class="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
    <div class="w-full max-w-md bg-white rounded-lg shadow-md p-6">
      <h1 class="text-2xl font-bold mb-4 text-center">生成卡片 ID</h1>
      <div class="mb-4">
        <label for="token" class="block text-gray-700 mb-2">Token:</label>
        <InputText
          id="token"
          v-model="token"
          placeholder="輸入你的 Token"
          class="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <Button @click="generateId" :disabled="loading" class="w-full">
        {{ loading ? "生成中..." : "生成 ID" }}
      </Button>

      <div flex mt-3>
        <div flex items-center gap-3 w-full>
          <ToggleSwitch v-model="copyOnGenerate" />
          <p>生成後自動複製 ID</p>
        </div>
        <div flex items-center gap-3 w-full>
          <ToggleSwitch v-model="copyUrl" />
          <p>URL</p>
        </div>
      </div>
      <div v-if="error" class="mt-4 text-red-500">
        {{ error }}
      </div>
      <div class="mt-6 w-full">
        <h2 class="text-xl font-semibold mb-2">生成的 ID:</h2>
        <div class="space-y-2">
          <div
            v-for="(item, index) in generatedIds"
            :key="index"
            class="p-3 bg-gray-200 rounded flex items-center justify-between"
          >
            <span>{{ item.id }}</span>
            <Button @click="copyToClipboard(item.id)">
              {{ item.copied ? "已複製" : "複製" }}</Button
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const token = ref("");
const generatedIds = ref<
  {
    id: string;
    copied: boolean;
  }[]
>([]);
const loading = ref(false);
const error = ref<string | null>(null);
const copyOnGenerate = ref(false);
const copyUrl = ref(true);

const generateId = async () => {
  if (!token.value) {
    error.value = "請輸入 Token";
    return;
  }
  loading.value = true;
  error.value = null;

  try {
    const { data, error: fetchError } = await useFetch<{
      id: string;
    }>("https://nuk-gdg.henry0725.workers.dev/generateCardId", {
      method: "GET",
      params: { token: token.value },
    });

    if (fetchError.value) {
      error.value = fetchError.value.message || "生成 ID 失敗";
    } else {
      if (data.value && data.value.id) {
        generatedIds.value.push({ id: data.value.id, copied: false });
      } else {
        error.value = "生成 ID 失敗，回應不正確";
      }
    }
  } catch (err) {
    error.value = "生成 ID 時發生錯誤";
    console.error(err);
  } finally {
    loading.value = false;
    if (copyOnGenerate.value && generatedIds.value.length) {
      copyToClipboard(generatedIds.value[generatedIds.value.length - 1].id);
    }
  }
};

const copyToClipboard = async (id: string) => {
  try {
    const string = copyUrl.value ? `${window.location.origin}/card/${id}` : id;
    await navigator.clipboard.writeText(string);
    const index = generatedIds.value.findIndex((item) => item.id === id);
    if (index !== -1) {
      generatedIds.value[index].copied = true;
    }
  } catch (err) {
    alert("無法複製 ID");
    console.error(err);
  }
};
</script>

<style>
/* 如果有其他自定義樣式，可以在這裡添加 */
</style>
