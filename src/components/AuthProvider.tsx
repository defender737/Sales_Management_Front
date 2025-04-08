// AuthProvider.tsx
import { useState, useEffect } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { registerAccessTokenUpdater } from "../hooks/tokenManager";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  // AuthProvider 내부
const [accessToken, setAccessToken] = useState<string | null>(null);

useEffect(() => {
  registerAccessTokenUpdater(setAccessToken);
}, []);

  return (
    <AuthContext.Provider value={{ accessToken, setAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};