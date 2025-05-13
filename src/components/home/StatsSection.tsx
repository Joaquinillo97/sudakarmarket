
import { Card, CardContent } from "@/components/ui/card";

const StatsSection = () => {
  const stats = [
    {
      title: "+5,000",
      description: "Cartas disponibles",
    },
    {
      title: "+500",
      description: "Usuarios activos",
    },
    {
      title: "+100",
      description: "Transacciones mensuales",
    },
    {
      title: "5/5",
      description: "Satisfacción de usuarios",
    },
  ];

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-none bg-muted/50">
              <CardContent className="p-6 text-center">
                <h3 className="text-3xl font-bold">{stat.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
