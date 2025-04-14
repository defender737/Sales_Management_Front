// src/hooks/useAuthInitializer.ts

import { useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../stores/UseAuthStore';
import { reissueAccessToken, initUserData } from '../api/api';

export function UseAuthInitializer() {
  const { setIsLoading, setAccessToken, setUser } = useAuthStore();

  useEffect(() => {
    const skipPaths = ['/signup'];
    const currentPath = window.location.pathname;

    if (skipPaths.includes(currentPath)) {
      setIsLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await reissueAccessToken();
        const token = res.data.accessToken;
        setAccessToken(token);
        const userRes = await initUserData();
        setUser(userRes.data);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const message = error.response?.data?.details;
          if(currentPath !== '/login' && currentPath !== '/Login') alert(message);
          setAccessToken(null);
          setUser(null);
          console.warn('자동 로그인 실패');
        }
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);
}