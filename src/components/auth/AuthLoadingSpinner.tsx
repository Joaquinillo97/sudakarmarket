import { Loader } from "lucide-react";

const AuthLoadingSpinner = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <Loader className="h-10 w-10 animate-spin text-mtg-orange" />
        <p className="text-lg">Cargando...</p>
      </div>
    </div>
  );
};

export default AuthLoadingSpinner;