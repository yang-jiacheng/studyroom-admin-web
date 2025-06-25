import { useStorage } from '@vueuse/core';

export const TokenKey = 'selfStudyAdminToken';

const tokenStorage = useStorage<null | string>(TokenKey, null);

export const getToken = () => tokenStorage.value;

export const setToken = (access_token: string) => (tokenStorage.value = access_token);

export const removeToken = () => (tokenStorage.value = null);
