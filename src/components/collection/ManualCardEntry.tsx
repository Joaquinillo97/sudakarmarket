
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Plus, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";

const ManualCardEntry = () => {
  const [formData, setFormData] = useState({
    cardName: "",
    cardSet: "",
    quantity: 1,
    condition: "NM",
    language: "Español",
    price: 0,
    forTrade: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para agregar cartas",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Temporarily disable manual entry functionality
      toast({
        title: "Funcionalidad deshabilitada",
        description: "La entrada manual está temporalmente deshabilitada",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error adding card:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar la carta a tu colección",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Plus className="h-5 w-5" />
          Agregar carta manualmente
        </CardTitle>
        <CardDescription>
          Agrega una carta específica a tu colección
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Esta funcionalidad está temporalmente deshabilitada mientras se actualiza el sistema.
          </AlertDescription>
        </Alert>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="card-name" className="block text-sm font-medium">
                Nombre de la carta
              </label>
              <Input
                id="card-name"
                value={formData.cardName}
                onChange={(e) => handleInputChange("cardName", e.target.value)}
                placeholder="Ej: Lightning Bolt"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="card-set" className="block text-sm font-medium">
                Edición
              </label>
              <Input
                id="card-set"
                value={formData.cardSet}
                onChange={(e) => handleInputChange("cardSet", e.target.value)}
                placeholder="Ej: Streets of New Capenna"
                disabled
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="quantity" className="block text-sm font-medium">
                Cantidad
              </label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={formData.quantity}
                onChange={(e) => handleInputChange("quantity", parseInt(e.target.value))}
                disabled
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="condition" className="block text-sm font-medium">
                Estado
              </label>
              <Select
                value={formData.condition}
                onValueChange={(value) => handleInputChange("condition", value)}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NM">Near Mint (NM)</SelectItem>
                  <SelectItem value="SP">Slightly Played (SP)</SelectItem>
                  <SelectItem value="MP">Moderately Played (MP)</SelectItem>
                  <SelectItem value="HP">Heavily Played (HP)</SelectItem>
                  <SelectItem value="DMG">Damaged (DMG)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="language" className="block text-sm font-medium">
                Idioma
              </label>
              <Select
                value={formData.language}
                onValueChange={(value) => handleInputChange("language", value)}
                disabled
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona idioma" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Español">Español</SelectItem>
                  <SelectItem value="Inglés">Inglés</SelectItem>
                  <SelectItem value="Portugués">Portugués</SelectItem>
                  <SelectItem value="Japonés">Japonés</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label htmlFor="price" className="block text-sm font-medium">
                Precio (ARS)
              </label>
              <Input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleInputChange("price", parseFloat(e.target.value))}
                placeholder="0.00"
                disabled
              />
            </div>
          </div>

          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Agregando..." : "Agregar a mi colección"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ManualCardEntry;
