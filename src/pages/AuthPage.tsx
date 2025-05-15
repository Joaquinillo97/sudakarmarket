
import { useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton";

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signIn, signUp, isAuthenticated } = useAuth();

  // Redirect if already logged in
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      if (isSignUp) {
        // Validate username
        if (!username.trim()) {
          throw new Error("El nombre de usuario es requerido");
        }
        await signUp(email, password, username);
      } else {
        await signIn(email, password);
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Ocurrió un error durante la autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-6 rounded-lg border border-border bg-card p-6 shadow-lg">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold font-magic">
            {isSignUp ? "Crear cuenta" : "Iniciar sesión"}
          </h1>
          <p className="text-muted-foreground">
            {isSignUp
              ? "Regístrate para acceder a todas las funcionalidades"
              : "Ingresa tus credenciales para acceder a tu cuenta"}
          </p>
        </div>

        <div className="space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username">Nombre de usuario</Label>
                <Input
                  id="username"
                  placeholder="Nombre de usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
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
                disabled={isLoading}
                required
              />
            </div>
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
                disabled={isLoading}
                required
              />
            </div>

            {errorMessage && (
              <div className="text-sm text-red-500">{errorMessage}</div>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-disabled={isLoading}
            >
              {isLoading && <Loader className="mr-2 h-4 w-4 animate-spin" />}
              {isSignUp ? "Registrarme" : "Iniciar sesión"}
            </Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">o</span>
            </div>
          </div>

          <GoogleSignInButton />

          <div className="text-center text-sm">
            {isSignUp ? (
              <p>
                ¿Ya tienes una cuenta?{" "}
                <button
                  type="button"
                  className="font-medium text-mtg-orange hover:underline"
                  onClick={() => setIsSignUp(false)}
                  disabled={isLoading}
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
                  disabled={isLoading}
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
