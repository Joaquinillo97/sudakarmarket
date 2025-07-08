import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

const PasswordResetForm = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    try {
      // Validate passwords match
      if (password !== confirmPassword) {
        throw new Error("Las contraseñas no coinciden");
      }
      if (password.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }
      await updatePassword(password);
      setSuccessMessage("Contraseña actualizada exitosamente");
      setTimeout(() => {
        navigate("/", { replace: true });
      }, 2000);
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
          <Label htmlFor="password">Nueva contraseña</Label>
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
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar contraseña</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
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
          Actualizar contraseña
        </Button>
      </form>

      <div className="text-center text-sm">
        <p>
          <button
            type="button"
            className="font-medium text-mtg-orange hover:underline"
            onClick={() => navigate("/auth")}
            disabled={isSubmitting}
          >
            Volver al inicio de sesión
          </button>
        </p>
      </div>
    </div>
  );
};

export default PasswordResetForm;