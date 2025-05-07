import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/useAuthStore'

export default function RedirectRoute() {
  const {accessToken} = useAuthStore();

  if (accessToken) {
    return <Navigate to="/dashboard" replace />;
  } else {
    return <Navigate to="/login" replace />;
  }
};