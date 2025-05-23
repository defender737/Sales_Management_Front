import { create } from 'zustand';
import { initUser } from '../types/types';

type AuthState = {
    accessToken: string | null;
    user: initUser | null;
    isLoading: boolean;
    setAccessToken: (token: string | null) => void;
    setUser: (user: initUser | null) => void;
    setIsLoading: (loading: boolean) => void;
    restoreAuth: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: null,
    user: null,
    isLoading: true,
    setAccessToken: (token) => set({ accessToken: token }),
    setUser: (user) => set({ user }),
    setIsLoading: (isLoading) => set({ isLoading }),
    restoreAuth: async () => Promise.resolve(),
}));

export const getAccessToken = () => useAuthStore.getState().accessToken;
export const setAccessToken = (token: string | null) => useAuthStore.getState().setAccessToken(token);