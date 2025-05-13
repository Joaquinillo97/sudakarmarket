
import { useState } from "react";
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

// Mock collection data
const MOCK_COLLECTION_DATA = [
  {
    id: "1",
    name: "Lightning Bolt",
    set: "Beta",
    imageUrl: "https://cards.scryfall.io/normal/front/c/e/ce711943-c1a1-43a0-8b89-8d169cfb8e06.jpg?1628801721",
    quantity: 2,
    condition: "LP",
    language: "Inglés",
    price: 25000,
    forTrade: true,
    color: "red",
    seller: { id: "self", name: "Mi colección", rating: 5 }
  },
  {
    id: "2",
    name: "Sol Ring",
    set: "Commander 2021",
    imageUrl: "https://cards.scryfall.io/normal/front/4/c/4cbc6901-6a4a-4d0a-83ea-7eefa3b35021.jpg?1625979257",
    quantity: 1,
    condition: "NM",
    language: "Español",
    price: 3500,
    forTrade: false,
    color: "colorless",
    seller: { id: "self", name: "Mi colección", rating: 5 }
  },
  {
    id: "3",
    name: "Birds of Paradise",
    set: "Fourth Edition",
    imageUrl: "https://cards.scryfall.io/normal/front/f/e/feefe9f0-24a6-461c-9ef1-86c5a6f33b83.jpg?1594681430",
    quantity: 4,
    condition: "MP",
    language: "Inglés",
    price: 8000,
    forTrade: true,
    color: "green",
    seller: { id: "self", name: "Mi colección", rating: 5 }
  },
  {
    id: "4",
    name: "Counterspell",
    set: "Tempest",
    imageUrl: "https://cards.scryfall.io/normal/front/1/9/1920dae4-fb92-4f19-ae4b-eb3276b8dac7.jpg?1628801663",
    quantity: 3,
    condition: "EX",
    language: "Inglés",
    price: 1200,
    forTrade: true,
    color: "blue",
    seller: { id: "self", name: "Mi colección", rating: 5 }
  },
  {
    id: "5",
    name: "Llanowar Elves",
    set: "Alpha",
    imageUrl: "https://cards.scryfall.io/normal/front/7/3/73542493-cd0b-4bb7-a5b8-8f889c76e4d6.jpg?1605281272",
    quantity: 1,
    condition: "HP",
    language: "Inglés",
    price: 15000,
    forTrade: false,
    color: "green",
    seller: { id: "self", name: "Mi colección", rating: 5 }
  },
  {
    id: "6",
    name: "Swords to Plowshares",
    set: "Ice Age",
    imageUrl: "https://cards.scryfall.io/normal/front/0/9/09d3bd04-53f9-4bfd-b244-bb04f0d5a0f3.jpg?1559591605",
    quantity: 2,
    condition: "NM",
    language: "Español",
    price: 4500,
    forTrade: true,
    color: "white",
    seller: { id: "self", name: "Mi colección", rating: 5 }
  },
  {
    id: "7",
    name: "Dark Ritual",
    set: "Revised Edition",
    imageUrl: "https://cards.scryfall.io/normal/front/e/b/eb168156-0120-4716-9f7c-a04716673b7c.jpg?1559591584",
    quantity: 3,
    condition: "MP",
    language: "Inglés",
    price: 2200,
    forTrade: true,
    color: "black",
    seller: { id: "self", name: "Mi colección", rating: 5 }
  },
  {
    id: "8",
    name: "Shock",
    set: "Onslaught",
    imageUrl: "https://cards.scryfall.io/normal/front/e/d/edc80177-3809-47e1-a7d4-c9aec300892c.jpg?1562942342",
    quantity: 4,
    condition: "NM",
    language: "Inglés",
    price: 600,
    forTrade: false,
    color: "red",
    seller: { id: "self", name: "Mi colección", rating: 5 }
  }
];

const CollectionView = () => {
  const [view, setView] = useState<"table" | "gallery">("table");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"name" | "price" | "set">("name");
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleForTradeToggle = (cardId: string, newValue: boolean) => {
    // In a real app, update the database
    toast({
      title: newValue ? "Carta disponible para intercambio" : "Carta no disponible para intercambio",
      description: `Has ${newValue ? "activado" : "desactivado"} la carta para intercambios`,
      duration: 3000,
    });
  };

  const handleDeleteCard = () => {
    // In a real app, delete from database
    setIsDeleteDialogOpen(false);
    toast({
      title: "Carta eliminada",
      description: `${selectedCard?.name} ha sido eliminada de tu colección`,
      duration: 3000,
    });
  };

  const handleEdit = (card: any) => {
    setSelectedCard(card);
    setIsDetailsDialogOpen(true);
  };

  const handleDelete = (card: any) => {
    setSelectedCard(card);
    setIsDeleteDialogOpen(true);
  };

  // Filter cards based on search term
  const filteredCards = MOCK_COLLECTION_DATA.filter(card =>
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
            <Button variant="destructive" onClick={handleDeleteCard}>
              Eliminar
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
                {/* In a real app, these would be editable fields */}
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
                <Button>
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
