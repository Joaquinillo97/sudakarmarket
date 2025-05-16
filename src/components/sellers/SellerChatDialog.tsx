
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ChatInterface from "@/components/chat/ChatInterface";
import { Seller } from "@/types/sellers";

interface SellerChatDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  seller: Seller | null;
}

const SellerChatDialog = ({ isOpen, onOpenChange, seller }: SellerChatDialogProps) => {
  if (!seller) return null;
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange} modal={false}>
      <DialogContent className="sm:max-w-md p-0">
        <ChatInterface 
          seller={{
            id: seller.id,
            name: seller.username || seller.name || '',
            avatar: seller.avatar_url || seller.avatar || ''
          }} 
          onClose={() => onOpenChange(false)} 
        />
      </DialogContent>
    </Dialog>
  );
};

export default SellerChatDialog;
