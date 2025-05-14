
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    // Precargar la imagen para verificar si existe
    const img = new Image();
    img.src = "/images/black-lotus.jpg"; // Intentamos usar el jpg como alternativa
    img.onload = () => setImageLoaded(true);
    img.onerror = () => {
      // Si falla jpg, intentamos con png
      const imgPng = new Image();
      imgPng.src = "/images/black-lotus.png";
      imgPng.onload = () => setImageLoaded(true);
      imgPng.onerror = () => setImageError(true);
    };
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
                  {!imageLoaded && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-12 w-12 rounded-full border-4 border-t-transparent border-mtg-orange animate-spin"></div>
                    </div>
                  )}
                  {/* Intentamos con una imagen estática */}
                  <img
                    src={imageLoaded ? (new Image().src = "/images/black-lotus.jpg") || "/images/black-lotus.png" : "/images/black-lotus.jpg"}
                    alt="Black Lotus"
                    className={`w-full h-full object-contain transform hover:scale-105 transition-transform duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                    style={{ 
                      filter: "drop-shadow(0px 0px 30px rgba(120, 0, 170, 0.8))",
                    }}
                    onError={(e) => {
                      // Si falla, intentamos con PNG
                      console.log("Error cargando JPG, intentando con PNG");
                      const imgElement = e.target as HTMLImageElement;
                      if (imgElement.src.includes(".jpg")) {
                        imgElement.src = "/images/black-lotus.png";
                      } else {
                        setImageError(true);
                      }
                    }}
                    onLoad={() => {
                      console.log("Imagen cargada correctamente");
                      setImageLoaded(true);
                    }}
                  />
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
