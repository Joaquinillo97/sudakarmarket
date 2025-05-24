
import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import CardGrid from "@/components/cards/CardGrid";
import { Grid2X2, List, Pencil, Trash } from "lucide-react";

const CollectionView = () => {
  const [view, setView] = useState<"table" | "gallery">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"name" | "price" | "set">("name");
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  // Fetch user's collection from database
  const { data: collectionData = [], isLoading } = useQuery({
    queryKey: ['userCollection', user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data, error } = await supabase
        .from('user_inventory')
        .select(`
          *,
          cards:card_id(*)
        `)
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      return data.map((item) => ({
        id: item.id,
        name: item.cards?.name || 'Carta sin nombre',
        set: item.cards?.set_name || 'Set desconocido',
        imageUrl: item.cards?.image_uri || '',
        quantity: item.quantity,
        condition: item.condition,
        language: item.language,
        price: item.price,
        forTrade: item.for_trade,
        color: "colorless", // Default color
        seller: { id: user.id, name: "Mi colección", rating: 5 },
        cardId: item.card_id,
      }));
    },
    enabled: !!user?.id && isAuthenticated
  });

  // Mutation to update for_trade status
  const updateForTradeMutation = useMutation({
    mutationFn: async ({ inventoryId, forTrade }: { inventoryId: string, forTrade: boolean }) => {
      const { error } = await supabase
        .from('user_inventory')
        .update({ for_trade: forTrade })
        .eq('id', inventoryId)
        .eq('user_id', user?.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCollection', user?.id] });
    }
  });

  // Mutation to delete card from collection
  const deleteCardMutation = useMutation({
    mutationFn: async (inventoryId: string) => {
      const { error } = await supabase
        .from('user_inventory')
        .delete()
        .eq('id', inventoryId)
        .eq('user_id', user?.id);
        
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userCollection', user?.id] });
      setIsDeleteDialogOpen(false);
      toast({
        title: "Carta eliminada",
        description: `${selectedCard?.name} ha sido eliminada de tu colección`,
        duration: 3000,
      });
    }
  });

  const handleForTradeToggle = (cardId: string, newValue: boolean) => {
    updateForTradeMutation.mutate({ inventoryId: cardId, forTrade: newValue });
    toast({
      title: newValue ? "Carta disponible para intercambio" : "Carta no disponible para intercambio",
      description: `Has ${newValue ? "activado" : "desactivado"} la carta para intercambios`,
      duration: 3000,
    });
  };

  const handleDeleteCard = () => {
    if (selectedCard?.id) {
      deleteCardMutation.mutate(selectedCard.id);
    }
  };

  const handleEdit = (card: any) => {
    setSelectedCard(card);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (card: any) => {
    setSelectedCard(card);
    setIsDeleteDialogOpen(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Debes iniciar sesión para ver tu colección</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p>Cargando tu colección...</p>
      </div>
    );
  }

  // Filter cards based on search term
  const filteredCards = collectionData.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.set.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort cards based on sort order
  const sortedCards = [...filteredCards].sort((a, b) => {
    if (sortOrder === "price") return a.price - b.price;
    if (sortOrder === "set") return a.set.localeCompare(b.set);
    return a.name.localeCompare(b.name);
  });

  // Totals
  const totalCards = sortedCards.reduce((sum, card) => sum + card.quantity, 0);
  const totalValue = sortedCards.reduce((sum, card) => sum + (card.price * card.quantity), 0);
  const tradeCount = sortedCards.filter(card => card.forTrade).length;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar cartas por nombre o edición..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="flex gap-2 justify-between sm:justify-start">
          <Select
            value={sortOrder}
            onValueChange={(value) => setSortOrder(value as "name" | "price" | "set")}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Ordenar por" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Nombre</SelectItem>
              <SelectItem value="price">Precio</SelectItem>
              <SelectItem value="set">Edición</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex">
            <Button
              variant={view === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("table")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "gallery" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("gallery")}
              className="rounded-l-none"
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <div className="bg-muted rounded-lg p-3">
          <p className="text-muted-foreground">Total cartas</p>
          <p className="text-2xl font-bold">{totalCards}</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-muted-foreground">Valor total</p>
          <p className="text-2xl font-bold">${totalValue.toLocaleString()}</p>
        </div>
        <div className="bg-muted rounded-lg p-3">
          <p className="text-muted-foreground">Para intercambio</p>
          <p className="text-2xl font-bold">{tradeCount}</p>
        </div>
      </div>

      {sortedCards.length > 0 ? (
        view === "table" ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Edición</TableHead>
                  <TableHead>Cant.</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Idioma</TableHead>
                  <TableHead className="text-right">Precio (ARS)</TableHead>
                  <TableHead>Para trade</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedCards.map((card) => (
                  <TableRow key={card.id}>
                    <TableCell className="font-medium">{card.name}</TableCell>
                    <TableCell>{card.set}</TableCell>
                    <TableCell>{card.quantity}</TableCell>
                    <TableCell>{card.condition}</TableCell>
                    <TableCell>{card.language}</TableCell>
                    <TableCell className="text-right">${card.price.toLocaleString()}</TableCell>
                    <TableCell>
                      <Switch
                        checked={card.forTrade}
                        onCheckedChange={(checked) => handleForTradeToggle(card.id, checked)}
                        aria-label={`Toggle availability of ${card.name}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEdit(card)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDelete(card)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <CardGrid cards={sortedCards} />
        )
      ) : (
        <div className="text-center py-12 bg-muted/30 rounded-lg">
          <h3 className="text-lg font-medium">No se encontraron cartas</h3>
          <p className="text-muted-foreground">
            No hay cartas que coincidan con tu búsqueda o tu colección está vacía
          </p>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar esta carta?</DialogTitle>
          </DialogHeader>
          <p>
            ¿Estás seguro que deseas eliminar <strong>{selectedCard?.name}</strong> de tu colección? Esta acción no se puede deshacer.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCard}
              disabled={deleteCardMutation.isPending}
            >
              {deleteCardMutation.isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Card Details Dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar carta</DialogTitle>
          </DialogHeader>
          {selectedCard && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Card className="col-span-1 p-1">
                  <img 
                    src={selectedCard.imageUrl}
                    alt={selectedCard.name}
                    className="rounded-sm w-full h-auto"
                  />
                </Card>
                <div className="col-span-3">
                  <h3 className="font-bold">{selectedCard.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedCard.set}</p>
                </div>
              </div>
              
              <div className="grid gap-2">
                <p className="text-sm">
                  <span className="text-muted-foreground">Cantidad:</span> {selectedCard.quantity}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Estado:</span> {selectedCard.condition}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Idioma:</span> {selectedCard.language}
                </p>
                <p className="text-sm">
                  <span className="text-muted-foreground">Precio:</span> ${selectedCard.price.toLocaleString()}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-sm">Disponible para intercambio</span>
                  <Switch checked={selectedCard.forTrade} />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-4">
                <Button variant="outline" onClick={() => setIsDetailsDialogOpen(false)}>
                  Cerrar
                </Button>
                <Button disabled>
                  Guardar cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CollectionView;
