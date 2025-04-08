import { createContext } from "react";

export interface AuthContextProps {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);