export const useCardData = async (id: string, onLoad: void) => {
  const { data, refresh } = await useAsyncData(async () => {
    const { data, error } = await useFetch<{
      id: string;
      nth: number;
      user: {
        id: string;
        name: string;
        email: string;
      } | null;
    }>(`https://nuk-gdg.henry0725.workers.dev/queryCard/${id}`);

    if (error.value) {
      console.error(error);
      showError(error.value);
      throw new Error("無法取得資料");
    }

    return {
      id: data.value?.id,
      nth: data.value?.nth.toString().padStart(6, "0"),
      user: data.value?.user,
    };
  });

  const saveData = async (
    user: {
      name: string;
      email: string;
    } | null,
  ) => {
    if (!user) {
      throw new Error("無效的使用者資料");
    }

    if (!user.name || !user.email) {
      throw new Error("請填寫姓名與 Email");
    }
    const { data, error } = await useFetch(`https://nuk-gdg.henry0725.workers.dev/initCard/${id}`, {
      method: "POST",
      body: JSON.stringify(user),
      mode: "cors",
    });
    if (error.value) {
      console.error(error);
      throw new Error("無法儲存資料");
    }
    await refresh();
  };

  const wasRegistered = computed(() => {
    return data.value?.user !== null;
  });

  return {
    data,
    saveData,
    wasRegistered,
  };
};
