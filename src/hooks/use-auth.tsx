
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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
  resetPassword: (email: string) => Promise<void>;
}

// Create the context with a default value
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Check for existing session on mount and setup auth state listener
  useEffect(() => {
    console.log("AuthProvider initialized");
    let mounted = true;
    
    // Simplify the auth state check to prevent potential deadlocks
    const setupAuth = async () => {
      try {
        // First set up the auth state change listener
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          (event, session) => {
            console.log("Auth state change event:", event);
            
            if (!mounted) return;
            
            if (session) {
              console.log("User from session:", session.user.id);
              // Basic user info from session
              setUser({
                id: session.user.id,
                email: session.user.email || '',
              });
              
              // We'll fetch profile data separately
              if (event === 'SIGNED_IN') {
                setTimeout(() => {
                  fetchUserProfile(session.user.id);
                }, 0);
              }
            } else if (event === 'SIGNED_OUT') {
              setUser(null);
              console.log("User signed out");
            }
          }
        );
        
        // Then check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        console.log("Getting initial session:", session ? "Session found" : "No session");
        
        if (session && mounted) {
          // Set basic user data immediately
          setUser({
            id: session.user.id,
            email: session.user.email || '',
          });
          
          // Fetch additional profile data
          setTimeout(() => {
            fetchUserProfile(session.user.id);
          }, 0);
        }
        
        // Always set loading to false once we've checked
        if (mounted) {
          setIsLoading(false);
        }
        
        // Return cleanup function
        return () => {
          mounted = false;
          if (subscription) {
            subscription.unsubscribe();
          }
        };
      } catch (error) {
        console.error("Auth initialization error:", error);
        if (mounted) setIsLoading(false);
      }
    };
    
    // Execute setup and store cleanup function
    const cleanupPromise = setupAuth();
    
    return () => {
      cleanupPromise.then(cleanup => {
        if (cleanup) cleanup();
      });
    };
  }, []);
  
  // Fetch user profile data from profiles table
  const fetchUserProfile = async (userId: string) => {
    try {
      console.log("Fetching user profile for:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('id, email, username, avatar_url')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        return;
      }
      
      if (profile) {
        console.log("User profile fetched successfully");
        setUser({
          id: profile.id,
          email: profile.email,
          username: profile.username,
          avatar_url: profile.avatar_url
        });
      }
    } catch (error) {
      console.error("Error in fetchUserProfile:", error);
    }
  };
  
  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log("Attempting sign in with email:", email);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Sign in failed:", error.message);
        toast.error("Error al iniciar sesión: " + error.message);
        throw error;
      }
      console.log("Sign in successful");
      toast.success("Inicio de sesión exitoso");
      return;
    } catch (error: any) {
      console.error("Sign in error:", error);
      toast.error("Error al iniciar sesión: " + (error.message || "Error desconocido"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign up with email, password and username
  const signUp = async (email: string, password: string, username: string) => {
    setIsLoading(true);
    try {
      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('profiles')
        .select('username')
        .eq('username', username)
        .maybeSingle();
        
      if (checkError) {
        console.error("Error checking username:", checkError);
      }
        
      if (existingUser) {
        toast.error("El nombre de usuario ya está en uso");
        throw new Error("El nombre de usuario ya está en uso");
      }
      
      // Register user with Supabase Auth
      const { error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) {
        console.error("Sign up error:", error.message);
        toast.error("Error al registrarse: " + error.message);
        throw error;
      }
      console.log("Sign up successful");
      toast.success("Registro exitoso, puedes iniciar sesión");
    } catch (error: any) {
      console.error("Sign up error:", error);
      toast.error("Error al registrarse: " + (error.message || "Error desconocido"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Reset password
  const resetPassword = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth?reset=true`,
      });
      
      if (error) {
        console.error("Password reset failed:", error.message);
        toast.error("Error al enviar el correo: " + error.message);
        throw error;
      }
      
      toast.success("Se ha enviado un correo para restablecer tu contraseña");
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast.error("Error al enviar el correo: " + (error.message || "Error desconocido"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Sign out
  const signOut = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Sign out error:", error.message);
        toast.error("Error al cerrar sesión: " + error.message);
        throw error;
      }
      toast.success("Has cerrado sesión");
    } catch (error: any) {
      console.error("Sign out error:", error);
      toast.error("Error al cerrar sesión: " + (error.message || "Error desconocido"));
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  // Update user profile
  const updateProfile = async (data: Partial<User>) => {
    if (!user) {
      toast.error("Usuario no autenticado");
      throw new Error("Usuario no autenticado");
    }
    
    setIsLoading(true);
    try {
      const updates = {
        ...data,
        updated_at: new Date().toISOString(),
      };
      
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
        
      if (error) {
        console.error("Profile update error:", error.message);
        toast.error("Error al actualizar el perfil: " + error.message);
        throw error;
      }
      
      // Update local state
      setUser(prev => prev ? { ...prev, ...data } : null);
      toast.success("Perfil actualizado correctamente");
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Error al actualizar el perfil: " + (error.message || "Error desconocido"));
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
        resetPassword,
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
