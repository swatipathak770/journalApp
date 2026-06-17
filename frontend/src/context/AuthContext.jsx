import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { AuthContext } from "./auth";

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("journal_token"));
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("journal_user");

    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [isCheckingSession, setIsCheckingSession] = useState(Boolean(token));

  const login = useCallback((jwtToken, username) => {
    const nextUser = { username };

    localStorage.setItem("journal_token", jwtToken);
    localStorage.setItem("journal_user", JSON.stringify(nextUser));
    setToken(jwtToken);
    setUser(nextUser);
    setIsCheckingSession(false);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("journal_token");
    localStorage.removeItem("journal_user");
    setToken(null);
    setUser(null);
    setIsCheckingSession(false);
  }, []);

  useEffect(() => {
    window.addEventListener("journal:unauthorized", logout);

    return () => window.removeEventListener("journal:unauthorized", logout);
  }, [logout]);

  useEffect(() => {
    if (!token) {
      return;
    }

    const verifySession = async () => {
      try {
        await api.get("/users");
      } catch {
        logout();
      } finally {
        setIsCheckingSession(false);
      }
    };

    verifySession();
  }, [logout, token]);

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      isCheckingSession,
      login,
      logout,
    }),
    [isCheckingSession, login, logout, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
