import { createContext } from "react";

export interface AuthUser {
  sub: string;
  email: string;
  given_name: string;
  role: string;
  nameid?: string;
  userName?: string;
  [key: string]: unknown;
}

export interface AuthContextType {
  isLoggedIn: boolean;
  user: AuthUser | null;
  login: (token: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
