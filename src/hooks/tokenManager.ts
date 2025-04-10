// src/hooks/tokenManager.ts

let accessToken: string | null = null;
let updateAccessTokenInContext: ((token: string | null) => void) | null = null;

export const setAccessTokenGlobal = (token: string | null) => {
  accessToken = token;
  if (updateAccessTokenInContext) {
    updateAccessTokenInContext(token); //setAccessToken(token);
  }
};

export const getAccessTokenGlobal = () => accessToken;

export const registerAccessTokenUpdater = (updater: (token: string | null) => void) => {
  updateAccessTokenInContext = updater;
};