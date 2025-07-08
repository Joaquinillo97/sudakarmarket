import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CardGrid from "@/components/cards/CardGrid";
import AddInventoryDialog from "@/components/inventory/AddInventoryDialog";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ImportIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserInventory } from "@/hooks/use-inventory";

const InventoryPage = () => {
  const { isAuthenticated } = useAuth();
  const { data: inventoryCards = [], isLoading: isLoadingInventory } = useUserInventory();

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container px-4 md:px-6 py-8">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Acceso requerido</CardTitle>
              <CardDescription>
                Debes iniciar sesión para ver tu inventario
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link to="/auth">Iniciar sesión</Link>
              </Button>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container px-4 md:px-6 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mi Inventario</h1>
            <p className="text-muted-foreground">Cartas que tienes disponibles</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" disabled>
              <ImportIcon className="mr-2 h-4 w-4" />
              Importar de Moxfield
            </Button>
            <AddInventoryDialog />
          </div>
        </div>

        {/* Inventory cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Cartas en tu inventario ({inventoryCards.length})
          </h2>
          {inventoryCards.length === 0 && !isLoadingInventory ? (
            <Card className="bg-muted">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center mb-4">
                  No tienes cartas en tu inventario. ¡Agrega algunas para empezar a vender o intercambiar!
                </p>
                <AddInventoryDialog />
              </CardContent>
            </Card>
          ) : (
            <CardGrid 
              cards={inventoryCards} 
              isLoading={isLoadingInventory} 
              isInventoryView={true} 
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default InventoryPage;