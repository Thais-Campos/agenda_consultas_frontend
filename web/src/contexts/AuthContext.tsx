import { createContext, useState, ReactNode } from "react";

type AuthContextType = {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
};

type AuthProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType>(
  {} as AuthContextType
);

export function AuthProvider({ children }: AuthProviderProps) {
  const [token, setToken] = useState<string | null>(null);

  function login(token: string) {
    setToken(token);
    localStorage.setItem("token", token);
  }

  function logout() {
    setToken(null);
    localStorage.removeItem("token");
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
