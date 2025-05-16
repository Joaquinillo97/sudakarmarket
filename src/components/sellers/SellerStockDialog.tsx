
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import CardGrid from "@/components/cards/CardGrid";
import { Seller, SellerCard } from "@/types/sellers";

interface SellerStockDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  seller: Seller | null;
  cards: SellerCard[] | undefined;
  isLoading: boolean;
}

const SellerStockDialog = ({ 
  isOpen, 
  onOpenChange, 
  seller, 
  cards, 
  isLoading 
}: SellerStockDialogProps) => {
  if (!seller) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Stock de {seller.username}</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="text-center py-10">Cargando cartas...</div>
        ) : cards && cards.length > 0 ? (
          <CardGrid cards={cards} />
        ) : (
          <div className="text-center py-10">Este vendedor no tiene cartas para vender actualmente.</div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SellerStockDialog;
