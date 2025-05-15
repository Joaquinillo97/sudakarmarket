
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { Menu, User, LogOut } from "lucide-react";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";
import { useAuth } from "@/hooks/use-auth";

const Navbar = () => {
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, isAuthenticated, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  // Define public navigation links (visible to all users)
  const publicNavItems = [
    { label: "Cartas", path: "/cards" },
    { label: "Vendedores", path: "/sellers" },
  ];

  // Define protected navigation links (visible only to authenticated users)
  const protectedNavItems = [
    { label: "Mi Colección", path: "/collection" },
    { label: "Wishlist", path: "/wishlist" },
    { label: "Mi Perfil", path: "/profile" },
  ];

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
            {/* Always show public nav items */}
            {publicNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="text-sm font-magic hover:text-mtg-orange transition-colors"
              >
                {item.label}
              </Link>
            ))}
            
            {/* Conditionally show protected items */}
            {isAuthenticated && protectedNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="text-sm font-magic hover:text-mtg-orange transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        <div className="flex items-center gap-4">
          <div className="relative hidden md:block w-64">
            <SearchAutocomplete />
          </div>

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  {user?.username || 'Mi cuenta'}
                </DropdownMenuLabel>
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
                <DropdownMenuItem onClick={handleSignOut} className="text-red-500 flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  Cerrar sesión
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" asChild>
              <Link to="/auth">Iniciar sesión</Link>
            </Button>
          )}
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
            {/* Always show public nav items in mobile menu */}
            {publicNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="px-2 py-1.5 text-sm font-magic rounded-md hover:bg-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {/* Conditionally show protected items in mobile menu */}
            {isAuthenticated && protectedNavItems.map((item) => (
              <Link 
                key={item.path}
                to={item.path} 
                className="px-2 py-1.5 text-sm font-magic rounded-md hover:bg-secondary"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            
            {isAuthenticated ? (
              <Button 
                variant="outline" 
                className="mt-2 w-full" 
                onClick={() => {
                  handleSignOut();
                  setIsMenuOpen(false);
                }}
              >
                Cerrar sesión
              </Button>
            ) : (
              <Button 
                variant="outline" 
                className="mt-2 w-full" 
                asChild
                onClick={() => setIsMenuOpen(false)}
              >
                <Link to="/auth">Iniciar sesión</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
