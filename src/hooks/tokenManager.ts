// src/hooks/tokenManager.ts

let accessToken: string | null = null;
let updateAccessTokenInContext: ((token: string | null) => void) | null = null;

export const setAccessTokenGlobal = (token: string | null) => {
  accessToken = token;
  if (updateAccessTokenInContext) {
    updateAccessTokenInContext(token); // 👈 상태 업데이트!
  }
};

export const getAccessTokenGlobal = () => accessToken;

export const registerAccessTokenUpdater = (updater: (token: string | null) => void) => {
  updateAccessTokenInContext = updater;
};