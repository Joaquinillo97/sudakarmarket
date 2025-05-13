
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-12 md:py-16 bg-muted">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="space-y-2 max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight">
              ¿Listo para unirte a la comunidad?
            </h2>
            <p className="text-muted-foreground text-lg">
              Crea una cuenta gratuita y comienza a intercambiar cartas con jugadores de todo el país.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" asChild>
              <Link to="/register">Registrarme</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link to="/about">Conocer más</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
