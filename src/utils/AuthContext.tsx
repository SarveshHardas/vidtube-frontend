import { createContext, useContext, useState, useEffect } from "react";
import { getCurrentUser } from "../api/homefeed.api";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [currentUser, setCurrentUser] = useState<any>(null);

  const fetchUser = async () => {
    try {
      const res = await getCurrentUser();
      setCurrentUser(res.data.data);
    } catch {
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);