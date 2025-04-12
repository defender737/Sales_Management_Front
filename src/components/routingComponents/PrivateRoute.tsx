// components/PrivateRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/UseAuthStore';

// 엑세스 토큰이 없는 경우 로그인 페이지로 리다이렉트
const PrivateRoute = () => {
  const {accessToken, isLoading} = useAuthStore();
  if(isLoading) {
    return null;
  }

  return accessToken ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;