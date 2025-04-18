import { useApiRequest } from './useApiRequest';
import { initUserData } from '../api/api';
import { useAuthStore } from '../stores/useAuthStore';

export const useFetchCurrentUser = () => {
    const { setUser } = useAuthStore();
  
    const { request, loading, success } = useApiRequest(
      () => initUserData(),
      (response) => {
        setUser(response.data);
      },
      (msg) => alert(msg)
    );
  
    return { fetchCurrentUser: request, loading, success };
  };