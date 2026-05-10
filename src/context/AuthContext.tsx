import { useState, type ReactNode } from "react";
import { jwtDecode } from "jwt-decode";
import { AuthContext, type AuthUser } from "./auth-context";

interface DecodedJwtPayload {
  sub: string;
  email: string;
  given_name: string;
  role: string;
  [key: string]: unknown;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setIsLoggedIn(false);
    window.location.assign("/login");
  };

  const getUserFromToken = (token: string): AuthUser => {
    const decoded = jwtDecode<DecodedJwtPayload>(token);
    const { sub, email, given_name, role, ...rest } = decoded;
    return {
      sub,
      email,
      given_name,
      role,
      ...rest,
    };
  };

  const [user, setUser] = useState<AuthUser | null>(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return null;
    }

    try {
      const userData = getUserFromToken(token);
      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error("Token decoderen mislukt", error);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(() =>
    Boolean(localStorage.getItem("token")),
  );

  const login = (token: string) => {
    localStorage.setItem("token", token);
    try {
      const userData = getUserFromToken(token);
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      setIsLoggedIn(true);
    } catch (error) {
      console.error("Token decoderen mislukt", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
