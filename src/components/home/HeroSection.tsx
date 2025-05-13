
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-gradient-to-b from-background to-muted py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                <span className="bg-gradient-to-r from-mtg-blue via-mtg-red to-mtg-green bg-clip-text text-transparent">
                  ¡Intercambiá cartas de Magic
                </span>{" "}
                con jugadores de toda Argentina!
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" asChild className="text-lg">
                <Link to="/cards">¡Buscá tu carta!</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg">
                <Link to="/import">¡Importá tu colección!</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative hidden md:flex">
              <div className="absolute -left-4 top-0 h-72 w-56 rotate-6 transform rounded-2xl bg-mtg-blue opacity-40"></div>
              <div className="absolute -right-4 top-6 h-72 w-56 -rotate-6 transform rounded-2xl bg-mtg-red opacity-40"></div>
              <div className="relative h-72 w-56 overflow-hidden rounded-2xl shadow-lg">
                <img
                  alt="Magic Card"
                  className="h-full w-full object-cover"
                  src="https://cards.scryfall.io/art_crop/front/a/5/a5356b11-e505-4838-aecb-327689eeead1.jpg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
