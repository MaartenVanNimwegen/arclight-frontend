import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  user: any | null;
  login: (token: string) => void;
  logout: () => void;
}

interface CustomJwtPayload {
  sub: string;
  email: string;
  given_name: string;
  role: string;
  [key: string]: any;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<any | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const decodeAndSetUser = (token: string) => {
    try {
      const decoded = jwtDecode<CustomJwtPayload>(token);

      const userData = {
        sub: decoded.sub,
        email: decoded.email,
        given_name: decoded.given_name,
        role: decoded.role,
      };

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("Token decoderen mislukt", error);
      logout();
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      decodeAndSetUser(token);
      setIsLoggedIn(true);
    }
  }, []);

  const login = (token: string) => {
    localStorage.setItem("token", token);
    decodeAndSetUser(token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth moet binnen AuthProvider gebruikt worden");
  return context;
};
