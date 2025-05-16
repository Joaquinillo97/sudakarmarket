
import { Box, MapPin, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import StarRating from "./StarRating";
import { Seller } from "@/types/sellers";

interface SellerCardProps {
  seller: Seller;
  onViewStock: (sellerId: string) => void;
  onChatClick: (seller: Seller) => void;
}

const SellerCard = ({ seller, onViewStock, onChatClick }: SellerCardProps) => {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-3 sm:gap-4">
          <Avatar className="h-12 w-12 border">
            <AvatarImage src={seller.avatar_url} alt={seller.username} />
            <AvatarFallback>{seller.username[0]}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="font-medium truncate">{seller.username}</h2>
              {seller.subscriptionType === "premium-store" && (
                <Badge className="bg-yellow-500">Tienda Premium</Badge>
              )}
              {seller.subscriptionType === "premium" && (
                <Badge className="bg-blue-500">Premium</Badge>
              )}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3.5 w-3.5 mr-1" />
              <span>{seller.location || 'Ubicación no especificada'}</span>
            </div>
            
            <div className="mt-2">
              <StarRating rating={seller.rating} />
            </div>
            
            <div className="mt-3 flex flex-wrap gap-2">
              <Button 
                size="sm" 
                variant="outline" 
                className="text-xs h-8"
                onClick={() => onViewStock(seller.id)}
              >
                <Box className="h-3.5 w-3.5 mr-1" />
                Ver stock completo
              </Button>
              
              <Button 
                size="sm" 
                className="text-xs h-8"
                onClick={() => onChatClick(seller)}
              >
                <MessageSquare className="h-3.5 w-3.5 mr-1" />
                Enviar mensaje
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SellerCard;
