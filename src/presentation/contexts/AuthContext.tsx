import { useState, useCallback, type ReactNode } from "react";
import { AuthService } from "../../services";
import { AuthContext } from "../hooks/useAuth";

const authService = new AuthService();

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState(() => authService.getCurrentUser());
  const [isLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    const profile = await authService.login(username, password);
    setUser(profile);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: user !== null,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
