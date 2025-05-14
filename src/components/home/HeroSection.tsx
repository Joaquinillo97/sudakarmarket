
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
// Import the image directly using ES module imports
import blackLotusImage from "/images/black-lotus.png";

const HeroSection = () => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageSrc, setImageSrc] = useState("");

  useEffect(() => {
    // Try different approaches to load the image
    // Approach 1: Set a base URL prefix
    const baseUrl = import.meta.env.BASE_URL || "";
    console.log("Base URL:", baseUrl);
    
    // Approach 2: Direct import (already done above)
    console.log("Direct import path:", blackLotusImage);
    
    // Approach 3: Standard path with logging
    const standardPath = "/images/black-lotus.png";
    console.log("Attempting to load image from:", standardPath);
    
    // Approach 4: Relative path
    const relativePath = "./images/black-lotus.png";
    console.log("Attempting with relative path:", relativePath);

    // Try to determine which path works
    const img = new Image();
    img.src = blackLotusImage; // Try the imported version first
    
    img.onload = () => {
      console.log("Image loaded successfully using direct import");
      setImageSrc(blackLotusImage);
      setImageLoaded(true);
    };
    
    img.onerror = () => {
      console.error("Failed to load image using direct import, trying with base URL");
      const imgWithBase = new Image();
      imgWithBase.src = baseUrl + "images/black-lotus.png";
      
      imgWithBase.onload = () => {
        console.log("Image loaded successfully with base URL");
        setImageSrc(baseUrl + "images/black-lotus.png");
        setImageLoaded(true);
      };
      
      imgWithBase.onerror = () => {
        console.error("Failed with base URL, trying standard path");
        const imgStandard = new Image();
        imgStandard.src = standardPath;
        
        imgStandard.onload = () => {
          console.log("Image loaded with standard path");
          setImageSrc(standardPath);
          setImageLoaded(true);
        };
        
        imgStandard.onerror = () => {
          console.error("All image loading attempts failed");
          setImageError(true);
        };
      };
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
                  {imageLoaded && (
                    <img
                      src={imageSrc}
                      alt="Black Lotus"
                      className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-300"
                      style={{ 
                        filter: "drop-shadow(0px 0px 30px rgba(120, 0, 170, 0.8))",
                      }}
                      onError={(e) => {
                        console.error("Failed to load Black Lotus image in the render phase");
                        setImageError(true);
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
