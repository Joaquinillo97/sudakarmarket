
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";

const CTASection = () => {
  const { isAuthenticated } = useAuth();

  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-2 max-w-2xl">
            <h2 className="text-3xl font-magic tracking-tight text-white">
              ¡Hacé match con alguien que busca lo que tenés!
            </h2>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            {isAuthenticated ? (
              <Button size="lg" asChild className="text-lg font-magic">
                <Link to="/collection">Ver mi colección</Link>
              </Button>
            ) : (
              <Button size="lg" asChild className="text-lg font-magic">
                <Link to="/auth">¡Registrarme ahora!</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
