
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Search, Heart, Coffee } from "lucide-react";

const ActionBanners = () => {
  const actions = [
    {
      title: "¡Publicá tu bulk y encontrá compradores!",
      icon: <User className="h-8 w-8" />,
      link: "/collection",
      buttonText: "Cargar mis cartas",
      bgClass: "bg-mtg-orange"
    },
    {
      title: "¡Buscá y filtrá miles de cartas disponibles!",
      icon: <Search className="h-8 w-8" />,
      link: "/cards",
      buttonText: "Explorar cartas",
      bgClass: "bg-mtg-orange"
    },
    {
      title: "¡Agregá cartas a tu wishlist y hacé match!",
      icon: <Heart className="h-8 w-8" />,
      link: "/wishlist",
      buttonText: "Mi wishlist",
      bgClass: "bg-mtg-orange"
    },
    {
      title: "¡Ayudanos a mantener la comunidad!",
      icon: <Coffee className="h-8 w-8" />,
      link: "/donate",
      buttonText: "Hacer una donación",
      bgClass: "bg-mtg-orange"
    }
  ];

  return (
    <section className="py-10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {actions.map((action, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-6 text-white shadow-lg ${action.bgClass} hover:opacity-95 transition-opacity`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-full">
                  {action.icon}
                </div>
                <h3 className="text-xl font-magic">{action.title}</h3>
              </div>
              
              <div className="mt-4 text-right">
                <Button 
                  variant="secondary" 
                  size="lg"
                  asChild
                  className="font-magic text-white bg-black/30 hover:bg-black/40"
                >
                  <Link to={action.link}>{action.buttonText}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ActionBanners;
