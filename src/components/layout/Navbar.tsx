
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
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { Menu, Search, User } from "lucide-react";

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
            <span className="font-bold text-xl bg-gradient-to-r from-mtg-blue via-mtg-red to-mtg-green bg-clip-text text-transparent">
              MTG Argentina
            </span>
          </Link>
        </div>

        {!isMobile && (
          <div className="hidden md:flex items-center gap-6">
            <Link to="/cards" className="text-sm font-medium hover:underline">
              Cartas
            </Link>
            <Link to="/sellers" className="text-sm font-medium hover:underline">
              Vendedores
            </Link>
            <Link to="/wishlists" className="text-sm font-medium hover:underline">
              Wishlists
            </Link>
            <Link to="/import" className="text-sm font-medium hover:underline">
              Importar
            </Link>
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cartas..."
              className="w-64 pl-8"
            />
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
                <Link to="/inventory" className="w-full">Mi inventario</Link>
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
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar cartas..."
              className="w-full pl-8"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <Link 
              to="/cards" 
              className="px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Cartas
            </Link>
            <Link 
              to="/sellers" 
              className="px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Vendedores
            </Link>
            <Link 
              to="/wishlists" 
              className="px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Wishlists
            </Link>
            <Link 
              to="/import" 
              className="px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary"
              onClick={() => setIsMenuOpen(false)}
            >
              Importar
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
