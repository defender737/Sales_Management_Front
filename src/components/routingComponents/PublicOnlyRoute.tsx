// components/PublicOnlyRoute.tsx
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../stores/UseAuthStore';

//엑세스 토큰이 있는 경우 메인 페이지로 리다이렉트
const PublicOnlyRoute = () => {
  const {accessToken,isLoading} = useAuthStore();
  console.log(accessToken)

  if(isLoading) {
    return null;
  }
  return accessToken ? <Navigate to="/" replace /> : <Outlet />;
};

export default PublicOnlyRoute;