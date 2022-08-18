export const GetLocalStorage = <T>(key: string) => JSON.parse(window.localStorage.getItem(key)) as T ?? null;
