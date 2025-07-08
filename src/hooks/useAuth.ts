import { useState, useEffect, createContext, useContext } from "react";
import { User, LoginRequest, RegisterRequest } from "@/types/api";
import { apiService } from "@/services/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  error: string | null;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

export const useAuthState = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await apiService.getCurrentUser();
      if (response.success) {
        setUser(response.data);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.login(credentials);
      if (response.success) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.message || "Ошибка входа");
        return false;
      }
    } catch (err) {
      setError("Ошибка сети");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiService.register(userData);
      if (response.success) {
        setUser(response.data.user);
        return true;
      } else {
        setError(response.message || "Ошибка регистрации");
        return false;
      }
    } catch (err) {
      setError("Ошибка сети");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    await apiService.logout();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    error,
  };
};
