import React, { createContext, useState, useEffect, ReactNode } from "react";
import apiClient from "./apiClient"; // Replace with your API client
import { useNavigate } from "react-router-dom"; // For redirecting after login/logout

type User = {
  id: string;
  username: string;
  email: string;
};

interface AuthContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;  // Add setUser here
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user data exists in sessionStorage
    const storedUser = sessionStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser)); // Set user if available
    } else {
      // Fetch user data from API if not available
      const fetchUser = async () => {
        try {
          const response = await apiClient.get("/validate", {
            withCredentials: true, // Ensure cookies are sent
          });
          setUser(response.data.user);
          sessionStorage.setItem("user", JSON.stringify(response.data.user)); // Store user data in sessionStorage
        } catch (error) {
          console.error("User not authenticated:", error);
          setUser(null);
        }
      };

      fetchUser();
    }
  }, []); // Run only on initial mount

  const login = () => {
    navigate("/login");
  };

  const logout = () => {
    apiClient.get("/logout").then(() => {
      sessionStorage.removeItem("user"); // Remove user from sessionStorage
      setUser(null); // Set user state to null
    });
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
