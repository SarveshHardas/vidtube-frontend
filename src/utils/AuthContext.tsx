import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/homefeed.api";
import { logoutUser } from "../api/auth.api";
import { isAuthenticated } from "./tokenUtils";

interface AuthContextType {
  currentUser: any;
  setCurrentUser: (user: any) => void;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setCurrentUser(res.data.data);
    } catch {
      setCurrentUser(null);
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch {
    } finally {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, fetchUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};