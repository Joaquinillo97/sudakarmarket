
import { useState, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { signIn, signUp, resetPassword, isAuthenticated, isLoading: authLoading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  console.log("AuthPage rendered", { isAuthenticated, authLoading });

  // Check for redirect state
  useEffect(() => {
    // Reset states when form type changes
    setErrorMessage("");
    setSuccessMessage("");
  }, [isSignUp, isForgotPassword]);

  // If we're already authenticated, redirect to the home page
  // or to the page the user was trying to access before authentication
  useEffect(() => {
    if (isAuthenticated) {
      console.log("User is authenticated, redirecting");
      const from = location.state?.from || "/";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, location.state, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      if (isForgotPassword) {
        await resetPassword(email);
        setSuccessMessage("Se ha enviado un correo para restablecer tu contraseña");
      } else if (isSignUp) {
        // Validate username
        if (!username.trim()) {
          throw new Error("El nombre de usuario es requerido");
        }
        await signUp(email, password, username);
        setIsSignUp(false); // Switch to login form after successful signup
      } else {
        await signIn(email, password);
        // Don't need to navigate here - the auth state change will trigger a redirect
      }
    } catch (error: any) {
      const errorMsg = error.message || "Ocurrió un error durante la autenticación";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleForgotPassword = () => {
    setIsForgotPassword(!isForgotPassword);
    setErrorMessage("");
    setSuccessMessage("");
  };

  // Show a global loading state if the auth system is still initializing
  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center space-y-4">
          <Loader className="h-10 w-10 animate-spin text-mtg-orange" />
          <p className="text-lg">Cargando...</p>
        </div>
      </div>
    );
  }

  // If we're already authenticated but still on this page, redirect
  if (isAuthenticated) {
    return null; // Return null while the useEffect handles redirection
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold font-magic">
            {isForgotPassword 
              ? "Recuperar contraseña" 
              : isSignUp 
                ? "Crear cuenta" 
                : "Iniciar sesión"}
          </h1>
          <p className="text-muted-foreground">
            {isForgotPassword
              ? "Ingresa tu correo electrónico para recuperar tu contraseña"
              : isSignUp
                ? "Regístrate para acceder a todas las funcionalidades"
                : "Ingresa tus credenciales para acceder a tu cuenta"}
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isForgotPassword && isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                required
              />
            </div>
            {!isForgotPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Contraseña</Label>
                </div>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            )}

            {errorMessage && (
              <div className="text-sm text-red-500">{errorMessage}</div>
            )}

            {successMessage && (
              <div className="text-sm text-green-500">{successMessage}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              aria-disabled={isSubmitting}
            >
              {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isForgotPassword 
                ? "Recuperar contraseña" 
                : isSignUp 
                  ? "Registrarme" 
                  : "Iniciar sesión"}
            </Button>
          </form>

          <div className="text-center text-sm space-y-2">
            {!isForgotPassword && (
              <button
                type="button"
                className="text-sm text-mtg-orange hover:underline"
                onClick={handleToggleForgotPassword}
                disabled={isSubmitting}
              >
                ¿Olvidaste tu contraseña?
              </button>
            )}
            
            {isForgotPassword ? (
              <p>
                <button
                  type="button"
                  className="font-medium text-mtg-orange hover:underline"
                  onClick={handleToggleForgotPassword}
                  disabled={isSubmitting}
                >
                  Volver al inicio de sesión
                </button>
              </p>
            ) : isSignUp ? (
              <p>
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  className="font-medium text-mtg-orange hover:underline"
                  onClick={() => setIsSignUp(false)}
                  disabled={isSubmitting}
                >
                  Iniciar sesión
                </button>
              </p>
            ) : (
              <p>
                ¿No tienes una cuenta?{" "}
                <button
                  type="button"
                  className="font-medium text-mtg-orange hover:underline"
                  onClick={() => setIsSignUp(true)}
                  disabled={isSubmitting}
                >
                  Registrarme
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
