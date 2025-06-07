
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useAddToWishlist } from "@/hooks/use-wishlist";
import { getCardByName, getAllPrintings } from "@/services/scryfall";
import { useToast } from "@/hooks/use-toast";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";

interface SelectedCard {
  id: string;
  name: string;
  imageUrl: string;
  text: string;
  manaCost: string;
  type: string;
  power?: string;
  toughness?: string;
  sets: Array<{
    set_id: string;
    set_name: string;
    collector_number: string;
    card_id: string;
  }>;
}

const AddCardDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const addToWishlistMutation = useAddToWishlist();
  const { toast } = useToast();

  const handleCardSearch = async (cardName: string) => {
    if (!cardName.trim()) return;
    
    setIsLoading(true);
    try {
      // Buscar la carta por nombre exacto
      const card = await getCardByName(cardName);
      
      // Obtener todas las ediciones de esta carta
      const printings = await getAllPrintings(card.name);
      
      const cardData: SelectedCard = {
        id: card.id,
        name: card.name,
        imageUrl: card.image_uris?.normal || card.image_uris?.large || '',
        text: card.oracle_text || 'Sin texto disponible',
        manaCost: card.mana_cost || '',
        type: card.type_line || 'Tipo desconocido',
        power: card.power,
        toughness: card.toughness,
        sets: printings.map(print => ({
          set_id: print.set_id,
          set_name: print.set_name,
          collector_number: print.collector_number,
          card_id: print.id
        }))
      };
      
      setSelectedCard(cardData);
    } catch (error) {
      console.error('Error fetching card:', error);
      toast({
        title: "Error",
        description: "No se pudo encontrar la carta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToWishlist = async () => {
    if (!selectedCard) return;

    if (selectedSet === "all") {
      // Agregar todas las ediciones
      for (const set of selectedCard.sets) {
        try {
          await addToWishlistMutation.mutateAsync(set.card_id);
        } catch (error) {
          console.error('Error adding card from set:', set.set_name, error);
        }
      }
      toast({
        title: "¡Agregadas a wishlist!",
        description: `Se agregaron ${selectedCard.sets.length} ediciones de ${selectedCard.name}`,
      });
    } else {
      // Agregar solo la edición específica
      const selectedSetData = selectedCard.sets.find(s => s.set_id === selectedSet);
      if (selectedSetData) {
        await addToWishlistMutation.mutateAsync(selectedSetData.card_id);
      }
    }

    // Limpiar y cerrar
    setSelectedCard(null);
    setSelectedSet("");
    setOpen(false);
  };

  const handleReset = () => {
    setSelectedCard(null);
    setSelectedSet("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar carta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar carta a wishlist</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedCard ? (
            <div>
              <label className="block text-sm font-medium mb-2">
                Buscar carta
              </label>
              <SearchAutocomplete
                onSearch={handleCardSearch}
                placeholder="Escribe el nombre de la carta..."
                className="w-full"
              />
              {isLoading && (
                <p className="text-sm text-muted-foreground mt-2">
                  Buscando carta...
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <img 
                        src={selectedCard.imageUrl} 
                        alt={selectedCard.name}
                        className="w-48 h-auto rounded"
                      />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h3 className="text-lg font-bold">{selectedCard.name}</h3>
                      {selectedCard.manaCost && (
                        <p className="text-sm text-muted-foreground">
                          {selectedCard.manaCost}
                        </p>
                      )}
                      <p className="text-sm font-medium">{selectedCard.type}</p>
                      <p className="text-sm">{selectedCard.text}</p>
                      {selectedCard.power && selectedCard.toughness && (
                        <p className="text-sm font-medium">
                          {selectedCard.power}/{selectedCard.toughness}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Seleccionar edición
                </label>
                <Select value={selectedSet} onValueChange={setSelectedSet}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una edición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas las ediciones</SelectItem>
                    {selectedCard.sets.map((set) => (
                      <SelectItem key={set.set_id} value={set.set_id}>
                        {set.set_name} (#{set.collector_number})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2">
                <Button 
                  onClick={handleAddToWishlist}
                  disabled={!selectedSet || addToWishlistMutation.isPending}
                  className="flex-1"
                >
                  {addToWishlistMutation.isPending ? "Agregando..." : "Agregar a wishlist"}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  Buscar otra carta
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;
