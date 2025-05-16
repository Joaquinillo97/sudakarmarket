
import { Seller } from "@/types/sellers";
import SellerCard from "./SellerCard";

interface SellersListProps {
  sellers: Seller[] | undefined;
  isLoading: boolean;
  onViewStock: (sellerId: string) => void;
  onChatClick: (seller: Seller) => void;
}

const SellersList = ({ sellers, isLoading, onViewStock, onChatClick }: SellersListProps) => {
  if (isLoading) {
    return <div className="text-center py-10">Cargando vendedores...</div>;
  }
  
  if (!sellers || sellers.length === 0) {
    return (
      <div className="text-center py-10">
        {sellers ? 'No se encontraron vendedores.' : 'Por favor, inicia sesión para ver los vendedores.'}
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {sellers.map((seller) => (
        <SellerCard 
          key={seller.id} 
          seller={seller} 
          onViewStock={onViewStock}
          onChatClick={onChatClick}
        />
      ))}
    </div>
  );
};

export default SellersList;
