import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

interface ForgotPasswordFormProps {
  onBackToLogin: () => void;
}

const ForgotPasswordForm = ({ onBackToLogin }: ForgotPasswordFormProps) => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { resetPassword } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      await resetPassword(email);
      setSuccessMessage("Se ha enviado un correo para restablecer tu contraseña");
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
          Recuperar contraseña
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>
          <button
            type="button"
            className="font-medium text-mtg-orange hover:underline"
            onClick={onBackToLogin}
            disabled={isSubmitting}
          >
            Volver al inicio de sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;