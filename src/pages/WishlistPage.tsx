
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CardGrid from "@/components/cards/CardGrid";
import UserMatches from "@/components/matches/UserMatches";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import { ImportIcon, SearchIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useUserWishlist } from "@/hooks/use-wishlist";
import { useWishlistMatches } from "@/hooks/use-matches";

const WishlistPage = () => {
  const { isAuthenticated } = useAuth();
  const { data: wishlistCards = [], isLoading: isLoadingWishlist } = useUserWishlist();
  const { data: matches = [], isLoading: isLoadingMatches } = useWishlistMatches();

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
                Debes iniciar sesión para ver tu wishlist
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
            <h1 className="text-3xl font-bold">Mi Wishlist</h1>
            <p className="text-muted-foreground">Cartas que estás buscando</p>
          </div>
          
          <div className="flex gap-3">
            <Button variant="outline" size="sm" disabled>
              <ImportIcon className="mr-2 h-4 w-4" />
              Importar de Moxfield
            </Button>
            <Button size="sm" asChild>
              <Link to="/cards">
                <SearchIcon className="mr-2 h-4 w-4" />
                Buscar cartas
              </Link>
            </Button>
          </div>
        </div>
        
        {/* Match alerts */}
        <UserMatches matches={matches} isLoading={isLoadingMatches} />

        {/* Wishlist cards */}
        <div>
          <h2 className="text-xl font-semibold mb-4">
            Cartas en tu wishlist ({wishlistCards.length})
          </h2>
          {wishlistCards.length === 0 && !isLoadingWishlist ? (
            <Card className="bg-muted">
              <CardContent className="flex flex-col items-center justify-center py-12">
                <p className="text-muted-foreground text-center mb-4">
                  No tienes cartas en tu wishlist. ¡Agrega algunas para empezar!
                </p>
                <Button asChild>
                  <Link to="/cards">
                    <SearchIcon className="mr-2 h-4 w-4" />
                    Buscar cartas
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <CardGrid cards={wishlistCards} isLoading={isLoadingWishlist} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default WishlistPage;
