
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-6 mt-12">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">MTG Argentina</h3>
            <p className="text-sm text-muted-foreground">
              Marketplace comunitario para jugadores de Magic: The Gathering en Argentina
            </p>
          </div>
          <div>
            <h4 className="text-base font-medium mb-3">Explorar</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/cards" className="text-muted-foreground hover:text-foreground">
                  Cartas disponibles
                </Link>
              </li>
              <li>
                <Link to="/sellers" className="text-muted-foreground hover:text-foreground">
                  Vendedores
                </Link>
              </li>
              <li>
                <Link to="/wishlists" className="text-muted-foreground hover:text-foreground">
                  Wishlists públicas
                </Link>
              </li>
              <li>
                <Link to="/precios" className="text-muted-foreground hover:text-foreground">
                  Precios de referencia
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-medium mb-3">Recursos</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/moxfield" className="text-muted-foreground hover:text-foreground">
                  Importar desde Moxfield
                </Link>
              </li>
              <li>
                <Link to="/ayuda" className="text-muted-foreground hover:text-foreground">
                  Guía de uso
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-muted-foreground hover:text-foreground">
                  Preguntas frecuentes
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-medium mb-3">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground">
                  Términos de uso
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-muted-foreground hover:text-foreground">
                  Política de privacidad
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MTG Argentina. Todos los derechos reservados.</p>
          <p className="mt-1">
            Magic: The Gathering y todos los nombres relacionados son marcas registradas de Wizards of the Coast LLC.
            Este sitio no está afiliado con Wizards of the Coast.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
