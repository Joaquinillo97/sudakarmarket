import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface SignUpFormProps {
  onSwitchToLogin: () => void;
}

const SignUpForm = ({ onSwitchToLogin }: SignUpFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // Validate username
      if (!username.trim()) {
        throw new Error("El nombre de usuario es requerido");
      }
      await signUp(email, password, username);
      onSwitchToLogin(); // Switch to login form after successful signup
    } catch (error: any) {
      const errorMsg = error.message || "Ocurrió un error durante la autenticación";
      setErrorMessage(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
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
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
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

        {errorMessage && (
          <div className="text-sm text-red-500">{errorMessage}</div>
        )}

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
          aria-disabled={isSubmitting}
        >
          {isSubmitting && <Loader className="mr-2 h-4 w-4 animate-spin" />}
          Registrarme
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>
          ¿Ya tienes una cuenta?{" "}
          <button
            type="button"
            className="font-medium text-mtg-orange hover:underline"
            onClick={onSwitchToLogin}
            disabled={isSubmitting}
          >
            Iniciar sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default SignUpForm;