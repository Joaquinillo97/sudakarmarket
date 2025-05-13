
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { User, Search, Heart, Coffee } from "lucide-react";

const ActionBanners = () => {
  const actions = [
    {
      title: "¡Publicá tu bulk y encontrá compradores!",
      icon: <User className="h-8 w-8" />,
      link: "/inventory",
      buttonText: "Cargar mis cartas",
      bgColor: "bg-gradient-to-r from-mtg-blue to-mtg-green"
    },
    {
      title: "¡Buscá y filtrá miles de cartas disponibles!",
      icon: <Search className="h-8 w-8" />,
      link: "/cards",
      buttonText: "Explorar cartas",
      bgColor: "bg-gradient-to-r from-mtg-green to-mtg-red"
    },
    {
      title: "¡Agregá cartas a tu wishlist y hacé match!",
      icon: <Heart className="h-8 w-8" />,
      link: "/wishlist",
      buttonText: "Mi wishlist",
      bgColor: "bg-gradient-to-r from-mtg-red to-mtg-blue"
    },
    {
      title: "¡Ayudanos a mantener la comunidad!",
      icon: <Coffee className="h-8 w-8" />,
      link: "/donate",
      buttonText: "Hacer una donación",
      bgColor: "bg-gradient-to-r from-mtg-blue to-mtg-red"
    }
  ];

  return (
    <section className="py-10">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 sm:grid-cols-2">
          {actions.map((action, index) => (
            <div 
              key={index} 
              className={`rounded-xl p-6 text-white shadow-lg ${action.bgColor} hover:opacity-95 transition-opacity`}
            >
              <div className="flex items-center gap-4">
                <div className="p-2 bg-white/20 rounded-full">
                  {action.icon}
                </div>
                <h3 className="text-xl font-bold">{action.title}</h3>
              </div>
              
              <div className="mt-4 text-right">
                <Button 
                  variant="secondary" 
                  size="lg"
                  asChild
                  className="font-bold text-black bg-white hover:bg-white/90"
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
