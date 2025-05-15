
import { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the user type
interface User {
  id: string;
  email: string;
  username?: string;
  avatar_url?: string;
}

// Define the auth context type
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // This will be implemented with Supabase
        // For now, just check localStorage for demo purposes
        const userData = localStorage.getItem('mtg-exchange-user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error("Session check failed", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkSession();
  }, []);
  
  // Mock authentication functions - to be replaced with Supabase
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock successful login
      const mockUser = { 
        id: 'mock-user-id', 
        email,
        username: email.split('@')[0]
      };
      setUser(mockUser);
      localStorage.setItem('mtg-exchange-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signUp = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // Mock successful registration
      const mockUser = { 
        id: 'mock-user-id', 
        email,
        username
      };
      setUser(mockUser);
      localStorage.setItem('mtg-exchange-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error("Sign up failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signOut = async () => {
    setIsLoading(true);
    try {
      // Mock sign out
      setUser(null);
      localStorage.removeItem('mtg-exchange-user');
    } catch (error) {
      console.error("Sign out failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      // Mock profile update
      if (user) {
        const updatedUser = { ...user, ...data };
        setUser(updatedUser);
        localStorage.setItem('mtg-exchange-user', JSON.stringify(updatedUser));
      }
    } catch (error) {
      console.error("Profile update failed", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Hook for using the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Wrap the app with this provider in App.tsx
