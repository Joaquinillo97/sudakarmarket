
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { getCardImageByExactName } from "@/services/scryfallImages";

const HeroSection = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [blackLotusImage, setBlackLotusImage] = useState("");

  useEffect(() => {
    const loadBlackLotus = async () => {
      try {
        console.log("Fetching Black Lotus from Scryfall API");
        // Intentar cargar Black Lotus de Alpha (LEA)
        const imageUrl = await getCardImageByExactName("Black Lotus", "lea");
        
        if (imageUrl) {
          console.log("Black Lotus image URL:", imageUrl);
          setBlackLotusImage(imageUrl);
        } else {
          throw new Error("No se pudo obtener la imagen del Black Lotus");
        }
      } catch (error) {
        console.error("Error en la carga del Black Lotus:", error);
        setImageError(true);
      }
    };

    loadBlackLotus();
  }, []);

  return (
    <section className="bg-gradient-to-b from-background to-muted py-12 md:py-20">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-magic tracking-tight sm:text-4xl md:text-5xl text-white">
                <span className="text-mtg-orange">
                  ¡Intercambiá cartas de Magic
                </span>{" "}
                con jugadores de toda Argentina!
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" asChild className="text-lg font-magic">
                <Link to="/cards">¡Buscá tu carta!</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="text-lg font-magic">
                <Link to="/collection">¡Importá tu colección!</Link>
              </Button>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <div className="relative w-full h-72 flex items-center justify-center">
              {imageError ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-mtg-orange text-2xl font-magic">Black Lotus</span>
                  <span className="text-white text-sm mt-2">Imagen no disponible</span>
                </div>
              ) : (
                <div className="w-60 h-80 relative">
                  {!blackLotusImage && !imageError && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-mtg-orange animate-spin"></div>
                    </div>
                  )}
                  {blackLotusImage && (
                    <img
                      src={blackLotusImage}
                      alt="Black Lotus"
                      className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
                      style={{ 
                        filter: "drop-shadow(0px 0px 30px rgba(120, 0, 170, 0.8))",
                      }}
                      onLoad={() => {
                        console.log("Black Lotus image loaded successfully in render phase");
                        setImageLoaded(true);
                        toast.success("¡Black Lotus cargado correctamente!");
                      }}
                      onError={(e) => {
                        console.error("Failed to load Black Lotus image in the render phase");
                        setImageError(true);
                        toast.error("Error al cargar la imagen del Black Lotus");
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
