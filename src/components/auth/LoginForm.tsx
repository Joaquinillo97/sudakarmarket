import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface LoginFormProps {
  onSwitchToSignUp: () => void;
  onSwitchToForgotPassword: () => void;
}

const LoginForm = ({ onSwitchToSignUp, onSwitchToForgotPassword }: LoginFormProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signIn(email, password);
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
          Iniciar sesión
        </Button>
      </form>

      <div className="text-center text-sm space-y-2">
        <button
          type="button"
          className="text-sm text-mtg-orange hover:underline"
          onClick={onSwitchToForgotPassword}
          disabled={isSubmitting}
        >
          ¿Olvidaste tu contraseña?
        </button>
        
        <p>
          ¿No tienes una cuenta?{" "}
          <button
            type="button"
            className="font-medium text-mtg-orange hover:underline"
            onClick={onSwitchToSignUp}
            disabled={isSubmitting}
          >
            Registrarme
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;