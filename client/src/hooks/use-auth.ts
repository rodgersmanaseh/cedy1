import { useState, useEffect, createContext, useContext } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface User {
  id: number;
  username: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check for stored auth token on mount
    const token = localStorage.getItem("authToken");
    const userData = localStorage.getItem("userData");
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userData");
      }
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async ({ username, password }: { username: string; password: string }) => {
      const response = await apiRequest("POST", "/api/auth/login", { username, password });
      return response.json();
    },
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem("authToken", data.token);
      localStorage.setItem("userData", JSON.stringify(data.user));
    },
    onError: (error) => {
      throw error;
    }
  });

  const login = async (username: string, password: string) => {
    setIsLoading(true);
    try {
      await loginMutation.mutateAsync({ username, password });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading: isLoading || loginMutation.isPending }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    // For components that don't have AuthProvider, return a simple implementation
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem("authToken");
      const userData = localStorage.getItem("userData");
      
      if (token && userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (error) {
          localStorage.removeItem("authToken");
          localStorage.removeItem("userData");
        }
      }
    }, []);

    const loginMutation = useMutation({
      mutationFn: async ({ username, password }: { username: string; password: string }) => {
        const response = await apiRequest("POST", "/api/auth/login", { username, password });
        return response.json();
      },
      onSuccess: (data) => {
        setUser(data.user);
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userData", JSON.stringify(data.user));
      }
    });

    const login = async (username: string, password: string) => {
      setIsLoading(true);
      try {
        await loginMutation.mutateAsync({ username, password });
      } finally {
        setIsLoading(false);
      }
    };

    const logout = () => {
      setUser(null);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userData");
    };

    return { user, login, logout, isLoading: isLoading || loginMutation.isPending };
  }
  
  return context;
}
