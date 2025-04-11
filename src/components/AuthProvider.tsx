// AuthProvider.tsx
import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { registerAccessTokenUpdater } from "../hooks/tokenManager";
import { initUserData, reissueAccessToken } from "../api/api";
import { setAccessTokenGlobal } from "../hooks/tokenManager";
import axios from "axios";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // AuthProvider 내부
const [accessToken, setAccessToken] = useState<string | null>(null);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const skipPaths = ['/login', '/signup'];
  const currentPath = window.location.pathname;
  registerAccessTokenUpdater(setAccessToken); //getAccessTokenGolbal에 getAccessToken을 등록

  if (skipPaths.includes(currentPath)) {
    setIsLoading(false); // 바로 로딩 끝 처리
    return;
  }

  // 만약 새로고침 및 기타 이유로 인해 Application이 재실행되었을 경우
  // RefreshToken을 이용하여 AccessToken을 재발급
  const tryRestoreAccessToken = async () => {
    try {
          const response = await reissueAccessToken();
          const accessToken = response.data.accessToken;
          setAccessTokenGlobal(accessToken);

          const userData = await initUserData();
          console.log(userData);

        } catch (error) {
          // 자동 로그인 실패 시 처리 
          if(axios.isAxiosError(error)) {
            console.log(error.response?.data)
            let message = error.response?.data?.details;
            alert(message);
            setAccessTokenGlobal(null);
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