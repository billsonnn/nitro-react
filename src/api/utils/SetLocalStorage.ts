export const SetLocalStorage = <T>(key: string, value: T) => window.localStorage.setItem(key, JSON.stringify(value));
