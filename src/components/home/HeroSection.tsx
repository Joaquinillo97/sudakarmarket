
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { toast } from "@/components/ui/sonner";
import { loadPowerNineImages, POWER_NINE } from "@/services/scryfallImages";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem, 
  CarouselNext, 
  CarouselPrevious 
} from "@/components/ui/carousel";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronRight, ChevronLeft } from "lucide-react";

const HeroSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [powerNineCards, setPowerNineCards] = useState<{ name: string; image: string | null }[]>([]);
  const [api, setApi] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  // Load Power Nine images
  useEffect(() => {
    const fetchPowerNine = async () => {
      try {
        setLoading(true);
        console.log("Fetching Power Nine images from Scryfall API");
        const cards = await loadPowerNineImages();
        
        if (cards.length > 0) {
          console.log(`Successfully loaded ${cards.length} Power Nine card images`);
          setPowerNineCards(cards);
          toast.success("¡Cartas Power Nine cargadas correctamente!");
        } else {
          throw new Error("No se pudieron cargar las cartas Power Nine");
        }
      } catch (error) {
        console.error("Error cargando las cartas Power Nine:", error);
        setError(true);
        toast.error("Error al cargar las imágenes de Power Nine");
      } finally {
        setLoading(false);
      }
    };

    fetchPowerNine();
  }, []);

  // Autoplay carousel
  useEffect(() => {
    if (!api || !autoplay) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api, autoplay]);

  // Update current index when sliding
  useEffect(() => {
    if (!api) return;

    api.on('select', () => {
      setCurrentIndex(api.selectedScrollSnap());
    });

    return () => {
      api.off('select');
    };
  }, [api]);

  // Get background gradient based on card index
  const getCardBackground = (index: number) => {
    const backgrounds = [
      'bg-gradient-to-b from-black to-mtg-orange/30', // Black Lotus
      'bg-gradient-to-b from-mtg-blue/50 to-mtg-blue/10', // Ancestral Recall
      'bg-gradient-to-b from-mtg-blue/50 to-mtg-blue/10', // Time Walk
      'bg-gradient-to-b from-mtg-white/50 to-mtg-white/10', // Mox Pearl
      'bg-gradient-to-b from-mtg-blue/50 to-mtg-blue/10', // Mox Sapphire 
      'bg-gradient-to-b from-mtg-black/50 to-mtg-black/10', // Mox Jet
      'bg-gradient-to-b from-mtg-red/50 to-mtg-red/10',  // Mox Ruby
      'bg-gradient-to-b from-mtg-green/50 to-mtg-green/10', // Mox Emerald
      'bg-gradient-to-b from-mtg-blue/50 to-mtg-blue/10' // Timetwister
    ];
    
    return backgrounds[index % backgrounds.length];
  };

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
            <div className={`w-full max-w-md mx-auto ${getCardBackground(currentIndex)} rounded-lg p-6`}>
              {loading ? (
                <div className="w-full h-80 flex items-center justify-center">
                  <div className="h-16 w-16 rounded-full border-4 border-t-transparent border-mtg-orange animate-spin"></div>
                </div>
              ) : error ? (
                <div className="w-full h-80 flex flex-col items-center justify-center">
                  <span className="text-mtg-orange text-2xl font-magic">Power Nine</span>
                  <span className="text-white text-sm mt-2">Imágenes no disponibles</span>
                </div>
              ) : (
                <div 
                  className="relative"
                  onMouseEnter={() => setAutoplay(false)}
                  onMouseLeave={() => setAutoplay(true)}
                >
                  <Carousel
                    setApi={setApi}
                    className="w-full"
                    opts={{ loop: true }}
                  >
                    <CarouselContent>
                      {powerNineCards.map((card, index) => (
                        <CarouselItem key={card.name}>
                          <HoverCard>
                            <HoverCardTrigger>
                              <div className="flex flex-col items-center">
                                <div className="relative w-64 h-88 overflow-hidden rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300">
                                  <img
                                    src={card.image!}
                                    alt={card.name}
                                    className="w-full h-full object-contain transform rotate-3 hover:rotate-0 transition-transform duration-500"
                                    style={{ 
                                      filter: "drop-shadow(0px 0px 20px rgba(120, 0, 170, 0.7))",
                                    }}
                                  />
                                </div>
                                <p className="mt-4 text-white text-lg font-magic">{card.name}</p>
                              </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-80 bg-black/80 border-mtg-orange text-white">
                              <div className="flex flex-col">
                                <span className="text-lg font-magic text-mtg-orange">{card.name}</span>
                                <p className="text-sm mt-2">Una de las legendarias Power Nine, las cartas más poderosas y valiosas de Magic: The Gathering.</p>
                                <p className="text-xs mt-2 text-mtg-orange/80">Alpha Edition (1993)</p>
                              </div>
                            </HoverCardContent>
                          </HoverCard>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="-left-6 bg-black/50 hover:bg-black/80 border-mtg-orange text-mtg-orange">
                      <ChevronLeft className="h-5 w-5" />
                    </CarouselPrevious>
                    <CarouselNext className="-right-6 bg-black/50 hover:bg-black/80 border-mtg-orange text-mtg-orange">
                      <ChevronRight className="h-5 w-5" />
                    </CarouselNext>
                  </Carousel>
                  
                  {/* Indicador de cartas */}
                  <div className="flex justify-center mt-4 gap-1">
                    {powerNineCards.map((_, index) => (
                      <button
                        key={index}
                        className={`h-2 rounded-full transition-all ${
                          currentIndex === index ? 'w-4 bg-mtg-orange' : 'w-2 bg-gray-500/50'
                        }`}
                        onClick={() => api?.scrollTo(index)}
                      />
                    ))}
                  </div>
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
