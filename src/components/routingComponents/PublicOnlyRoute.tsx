// components/PublicOnlyRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore';

//엑세스 토큰이 있는 경우 메인 페이지로 리다이렉트
export default function PublicOnlyRoute() {
  const {accessToken,isLoading} = useAuthStore();
  if(isLoading) {
    return null;
  }
  return accessToken ? <Navigate to="/" replace /> : <Outlet />;
};