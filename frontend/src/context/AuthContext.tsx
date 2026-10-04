import { createContext } from "react";
import type { User } from "../types/UserType";

export type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
