import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore'

const RedirectRoute = () => {
  const {accessToken} = useAuthStore();

  if (accessToken) {
    //TODO : 데쉬보드 페이지로 리다이렉트되도록 변경
    return <Navigate to="/sales-expenses" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};

export default RedirectRoute;