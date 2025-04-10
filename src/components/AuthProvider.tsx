// AuthProvider.tsx
import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { registerAccessTokenUpdater } from "../hooks/tokenManager";
import { reissueAccessToken } from "../api/api";
import { setAccessTokenGlobal } from "../hooks/tokenManager";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // AuthProvider 내부
const [accessToken, setAccessToken] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  registerAccessTokenUpdater(setAccessToken); //getAccessTokenGolbal에 getAccessToken을 등록

  // 만약 새로고침 및 기타 이유로 인해 Application이 재실행되었을 경우
  // RefreshToken을 이용하여 AccessToken을 재발급
  const tryRestoreAccessToken = async () => {
    try {
          const response = await reissueAccessToken();
          const accessToken = response.data.accessToken;
          setAccessTokenGlobal(accessToken);
        } catch (error) {
          // 자동 로그인 실패 시 처리(RefreshToken 만료 등)
          if(axios.isAxiosError(error)) {
            let message = error.response?.data?.details;
            alert(message);
            console.warn("자동 로그인 실패");
          }
        } finally {
          setIsLoading(false);
        }
    }
    tryRestoreAccessToken();
}, []);

  return (
    <AuthContext.Provider value={{ accessToken, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};