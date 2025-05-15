
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, User } from "lucide-react";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setIsMenuOpen(prev => !prev)}
            >
              <Menu />
            </Button>
          )}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-magic text-xl text-white">
              Sudakarmarket
            </span>
          </Link>
        </div>

        {!isMobile && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cards" className="text-sm font-magic hover:text-mtg-orange transition-colors">
              Cartas
            </Link>
            <Link to="/sellers" className="text-sm font-magic hover:text-mtg-orange transition-colors">
              Vendedores
            </Link>
            <Link to="/collection" className="text-sm font-magic hover:text-mtg-orange transition-colors">
              Mi Colección
            </Link>
            <Link to="/wishlist" className="text-sm font-magic hover:text-mtg-orange transition-colors">
              Wishlist
            </Link>
            <Link to="/profile" className="text-sm font-magic hover:text-mtg-orange transition-colors">
              Mi Perfil
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-64">
            <SearchAutocomplete />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link to="/profile" className="w-full">Perfil</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/collection" className="w-full">Mi colección</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/wishlist" className="w-full">Mi wishlist</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/messages" className="w-full">Mensajes</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Cerrar sesión</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isMobile && isMenuOpen && (
        <div className="container border-t py-3 px-4">
          <div className="relative mb-3">
            <SearchAutocomplete
              placeholder="Buscar cartas..."
              className="w-full"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Link 
              to="/cards" 
              className="px-2 py-1.5 text-sm font-magic rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Cartas
            </Link>
            <Link 
              to="/sellers" 
              className="px-2 py-1.5 text-sm font-magic rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Vendedores
            </Link>
            <Link 
              to="/collection" 
              className="px-2 py-1.5 text-sm font-magic rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Mi Colección
            </Link>
            <Link 
              to="/wishlist" 
              className="px-2 py-1.5 text-sm font-magic rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlist
            </Link>
            <Link 
              to="/profile" 
              className="px-2 py-1.5 text-sm font-magic rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Mi Perfil
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
