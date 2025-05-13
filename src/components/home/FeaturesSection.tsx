
import FeatureCard from "./FeatureCard";
import { Search, Heart, Import, DollarSign, MessageCircle, User } from "lucide-react";

const FeaturesSection = () => {
  const features = [
    {
      title: "Buscador avanzado",
      description: "Encuentra rápidamente la carta que necesitas con filtros de edición, idioma, estado y precio.",
      icon: <Search className="h-6 w-6" />,
    },
    {
      title: "Wishlist personalizada",
      description: "Crea y comparte tu lista de cartas deseadas para que otros vendedores puedan contactarte.",
      icon: <Heart className="h-6 w-6" />,
    },
    {
      title: "Importación desde Moxfield",
      description: "Importa fácilmente tus mazos desde Moxfield y verifica disponibilidad en la comunidad.",
      icon: <Import className="h-6 w-6" />,
    },
    {
      title: "Precios de referencia",
      description: "Consulta precios estimados en pesos argentinos basados en referencias internacionales.",
      icon: <DollarSign className="h-6 w-6" />,
    },
    {
      title: "Mensajería interna",
      description: "Comunícate directamente con otros usuarios para coordinar intercambios o ventas.",
      icon: <MessageCircle className="h-6 w-6" />,
    },
    {
      title: "Perfiles de usuario",
      description: "Gestiona tu inventario, wishlist y reputación desde un único lugar accesible.",
      icon: <User className="h-6 w-6" />,
    },
  ];

  return (
    <section className="py-12 md:py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold tracking-tight mb-2">Características principales</h2>
          <p className="text-muted-foreground">
            Herramientas diseñadas para facilitar el intercambio de cartas en la comunidad
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
