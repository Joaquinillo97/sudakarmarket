import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useAddToInventory } from "@/hooks/use-inventory";
import { getCardByName, getAllPrintings } from "@/services/scryfall";
import { useToast } from "@/hooks/use-toast";
import SearchAutocomplete from "@/components/search/SearchAutocomplete";
import { Database } from "@/integrations/supabase/types";

type CardCondition = Database["public"]["Enums"]["card_condition"];
type CardLanguage = Database["public"]["Enums"]["card_language"];

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

const conditions = [
  { value: "NM", label: "Near Mint (NM)" },
  { value: "SP", label: "Slightly Played (SP)" },
  { value: "MP", label: "Moderately Played (MP)" },
  { value: "HP", label: "Heavily Played (HP)" },
  { value: "DMG", label: "Damaged (DMG)" },
];

const languages = [
  { value: "Inglés", label: "Inglés" },
  { value: "Español", label: "Español" },
  { value: "Portugués", label: "Portugués" },
  { value: "Japonés", label: "Japonés" },
  { value: "Coreano", label: "Coreano" },
  { value: "Ruso", label: "Ruso" },
  { value: "Chino Simplificado", label: "Chino Simplificado" },
  { value: "Chino Tradicional", label: "Chino Tradicional" },
  { value: "Alemán", label: "Alemán" },
  { value: "Francés", label: "Francés" },
  { value: "Italiano", label: "Italiano" },
];

const AddInventoryDialog = () => {
  const [open, setOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<SelectedCard | null>(null);
  const [selectedSet, setSelectedSet] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [condition, setCondition] = useState<CardCondition>("NM");
  const [language, setLanguage] = useState<CardLanguage>("Inglés");
  const [price, setPrice] = useState<number>(0);
  const [forTrade, setForTrade] = useState(false);
  const [notes, setNotes] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const addToInventoryMutation = useAddToInventory();
  const { toast } = useToast();

  const handleCardSearch = async (cardName: string) => {
    if (!cardName.trim()) return;
    setIsLoading(true);
    console.log(`🔍 Starting search for: "${cardName}"`);
    
    try {
      // Buscar la carta por nombre exacto
      console.log('📥 Fetching card by exact name...');
      const card = await getCardByName(cardName);
      console.log('✅ Found card:', card.name);

      // Obtener todas las ediciones de esta carta
      console.log('📚 Fetching all printings...');
      const printings = await getAllPrintings(card.name);
      console.log(`📊 Total printings found: ${printings.length}`);
      
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
      
      console.log(`🎯 Card data prepared with ${cardData.sets.length} sets`);
      setSelectedCard(cardData);
      
      // Set default price from card data if available
      if (card.prices?.usd) {
        setPrice(Math.round(parseFloat(card.prices.usd) * 100)); // Convert to cents
      }
    } catch (error) {
      console.error('❌ Error fetching card:', error);
      toast({
        title: "Error",
        description: "No se pudo encontrar la carta",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToInventory = async () => {
    if (!selectedCard || !selectedSet) return;

    const selectedSetData = selectedCard.sets.find(s => s.set_id === selectedSet);
    if (!selectedSetData) return;

    try {
      await addToInventoryMutation.mutateAsync({
        card_id: selectedSetData.card_id,
        quantity,
        condition,
        language,
        price,
        for_trade: forTrade,
        notes: notes.trim() || undefined
      });

      // Reset form and close
      handleReset();
      setOpen(false);
    } catch (error) {
      console.error('Error adding to inventory:', error);
    }
  };

  const handleReset = () => {
    setSelectedCard(null);
    setSelectedSet("");
    setQuantity(1);
    setCondition("NM");
    setLanguage("Inglés");
    setPrice(0);
    setForTrade(false);
    setNotes("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Agregar carta
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Agregar carta al inventario</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {!selectedCard ? (
            <div className="flex flex-col items-center justify-start pt-4 pb-16 px-0">
              <label className="block text-sm font-medium mb-4 text-center">
                Buscar carta
              </label>
              <div className="w-full max-w-md">
                <SearchAutocomplete 
                  onSearch={handleCardSearch} 
                  placeholder="Escribe el nombre de la carta..." 
                  className="w-full" 
                />
              </div>
              {isLoading && (
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Buscando carta y todas sus ediciones...
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
                      <p className="text-sm leading-relaxed">{selectedCard.text}</p>
                      {selectedCard.power && selectedCard.toughness && (
                        <p className="text-sm font-medium">
                          {selectedCard.power}/{selectedCard.toughness}
                        </p>
                      )}
                      <div className="bg-muted p-2 rounded">
                        <p className="text-xs font-medium text-muted-foreground">
                          Ediciones encontradas: {selectedCard.sets.length}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="set-select">Seleccionar edición</Label>
                  <Select value={selectedSet} onValueChange={setSelectedSet}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una edición" />
                    </SelectTrigger>
                    <SelectContent>
                      {selectedCard.sets.map(set => (
                        <SelectItem key={set.set_id} value={set.set_id}>
                          {set.set_name} (#{set.collector_number})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="quantity">Cantidad</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>

                <div>
                  <Label htmlFor="condition">Condición</Label>
                  <Select value={condition} onValueChange={(value) => setCondition(value as CardCondition)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {conditions.map(cond => (
                        <SelectItem key={cond.value} value={cond.value}>
                          {cond.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={language} onValueChange={(value) => setLanguage(value as CardLanguage)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map(lang => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="price">Precio (pesos argentinos)</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="1"
                    value={price}
                    onChange={(e) => setPrice(Math.max(0, parseInt(e.target.value) || 0))}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="for-trade"
                    checked={forTrade}
                    onCheckedChange={setForTrade}
                  />
                  <Label htmlFor="for-trade">Disponible para intercambio</Label>
                </div>
              </div>

              <div>
                <Label htmlFor="notes">Notas (opcional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Agregar notas sobre la carta..."
                />
              </div>

              <div className="flex gap-3">
                <Button 
                  onClick={handleAddToInventory} 
                  disabled={!selectedSet || addToInventoryMutation.isPending}
                  className="flex-1"
                >
                  {addToInventoryMutation.isPending ? "Agregando..." : "Agregar al inventario"}
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

export default AddInventoryDialog;