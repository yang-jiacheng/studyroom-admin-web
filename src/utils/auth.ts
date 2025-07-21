import { useStorage } from '@vueuse/core';
import type { TokenPair } from "@/api/auth/type.ts";

export const TokenKey = 'selfStudyAdminToken';

export const RefreshTokenKey = 'refreshToken';

const tokenStorage = useStorage<null | TokenPair>(
  TokenKey,
  null,
  localStorage,
  {
    serializer: {
      read: (v: string) => {
        try {
          return JSON.parse(v);
        } catch {
          return null;
        }
      },
      write: (v: TokenPair | null) => JSON.stringify(v)
    }
  }
);

export const getAccessToken = () => {
  return tokenStorage.value?.accessToken;
};

export const getRefreshToken = () => {
  return tokenStorage.value?.refreshToken;
};

export const setToken = (tokenPair: TokenPair) => {
  tokenStorage.value = tokenPair;
};

export const removeToken = () => {
  tokenStorage.value = null;
};
