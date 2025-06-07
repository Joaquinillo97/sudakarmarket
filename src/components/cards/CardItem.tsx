
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { Heart } from "lucide-react";

interface CardItemProps {
  id: string;
  name: string;
  set: string;
  imageUrl: string;
  price: number;
  seller?: {  // Changed from required to optional
    id: string;
    name: string;
    rating: number;
  };
  condition: string;
  language: string;
  color?: string;
}

const CardItem = ({
  id,
  name,
  set,
  imageUrl,
  price,
  seller,
  condition,
  language,
  color = "colorless"
}: CardItemProps) => {
  const [isLiked, setIsLiked] = useState(false);
  const { toast } = useToast();

  // Decide which color class to apply
  const colorClass = `mtg-${color.toLowerCase()}`;

  const handleWishlistToggle = () => {
    setIsLiked(prev => !prev);
    
    // Show toast notification
    toast({
      title: isLiked ? "Quitada de wishlist" : "¡Agregada a wishlist!",
      description: isLiked 
        ? `${name} fue quitada de tu wishlist` 
        : `${name} fue agregada a tu wishlist`,
      duration: 3000,
    });

    // In a real app, this is where we would call an API to update the user's wishlist
    console.log(`Card ${id} ${isLiked ? 'removed from' : 'added to'} wishlist`);
  };

  return (
    <Card className={`mtg-card overflow-hidden h-full`}>
      <div className={`h-1 ${colorClass}`} />
      <CardHeader className="p-3">
        <div className="flex justify-between items-start">
          <Link 
            to={`/cards/${id}`}
            className="font-medium text-sm hover:text-primary line-clamp-2 min-h-[40px]"
          >
            {name}
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-7 w-7" 
                  onClick={handleWishlistToggle}
                >
                  <Heart 
                    className={`h-4 w-4 ${isLiked ? "fill-red-500 text-red-500" : ""}`} 
                  />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                {isLiked ? "Quitar de wishlist" : "¡Agregar a wishlist!"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <Link to={`/cards/${id}`} className="block mb-3">
          <img 
            src={imageUrl} 
            alt={name} 
            className="w-full h-auto object-contain rounded"
            loading="lazy"
          />
        </Link>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="text-muted-foreground">Set:</div>
          <div className="text-right font-medium">{set}</div>
          
          <div className="text-muted-foreground">Estado:</div>
          <div className="text-right font-medium">{condition}</div>
          
          <div className="text-muted-foreground">Idioma:</div>
          <div className="text-right font-medium">{language}</div>
        </div>
      </CardContent>
      <CardFooter className="p-3 pt-0 flex justify-between items-center">
        {seller ? (
          <Link 
            to={`/sellers/${seller.id}`}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {seller.name}
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground">
            Sin vendedor
          </span>
        )}
        <span className="font-bold">
          ${price.toFixed(2)}
        </span>
      </CardFooter>
    </Card>
  );
};

export default CardItem;
