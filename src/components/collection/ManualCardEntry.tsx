
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { getAutocompleteSuggestions } from "@/services/scryfall";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

// Card conditions
const CARD_CONDITIONS = [
  { label: "Mint (M)", value: "M" },
  { label: "Near Mint (NM)", value: "NM" },
  { label: "Excellent (EX)", value: "EX" },
  { label: "Good (GD)", value: "GD" },
  { label: "Light Played (LP)", value: "LP" },
  { label: "Played (PL)", value: "PL" },
  { label: "Poor (PR)", value: "PR" },
];

// Card languages
const CARD_LANGUAGES = [
  { label: "Español", value: "es" },
  { label: "Inglés", value: "en" },
  { label: "Italiano", value: "it" },
  { label: "Francés", value: "fr" },
  { label: "Alemán", value: "de" },
  { label: "Portugués", value: "pt" },
  { label: "Japonés", value: "jp" },
  { label: "Coreano", value: "kr" },
  { label: "Ruso", value: "ru" },
  { label: "Chino Simplificado", value: "cs" },
  { label: "Chino Tradicional", value: "ct" },
];

// Form validation schema
const cardFormSchema = z.object({
  name: z.string().min(2, "El nombre es requerido"),
  set: z.string().min(1, "La edición es requerida"),
  language: z.string().min(1, "El idioma es requerido"),
  condition: z.string().min(1, "La condición es requerida"),
  quantity: z.coerce.number().min(1, "La cantidad mínima es 1"),
  price: z.coerce.number().min(0, "El precio no puede ser negativo"),
  forTrade: z.boolean().default(true),
});

type CardFormValues = z.infer<typeof cardFormSchema>;

interface ManualCardEntryProps {
  onSuccess: () => void;
}

const ManualCardEntry = ({ onSuccess }: ManualCardEntryProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filteredCards, setFilteredCards] = useState<string[]>([]);
  const [cardSets, setCardSets] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { user } = useAuth();

  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardFormSchema),
    defaultValues: {
      name: "",
      set: "",
      language: "es",
      condition: "NM",
      quantity: 1,
      price: 0,
      forTrade: true,
    },
  });

  // Filter cards based on input
  const handleNameChange = async (value: string) => {
    if (value.length >= 2) {
      try {
        const suggestions = await getAutocompleteSuggestions(value);
        setFilteredCards(suggestions);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Error fetching card suggestions:", error);
      }
    } else {
      setFilteredCards([]);
      setShowSuggestions(false);
    }
  };

  const selectSuggestion = (card: string) => {
    form.setValue("name", card);
    setShowSuggestions(false);
    
    // Fetch sets that contain this card
    // In a real implementation, we would query Scryfall for sets containing this card
    // For now, we'll just close the suggestions
  };

  const onSubmit = async (data: CardFormValues) => {
    if (!user) {
      toast.error("Debes iniciar sesión para agregar cartas");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // First check if the card exists in our database
      let { data: existingCard, error: cardError } = await supabase
        .from('cards')
        .select('id')
        .eq('name', data.name)
        .eq('set_name', data.set)
        .single();
        
      let cardId;
      
      if (cardError || !existingCard) {
        // Card doesn't exist yet, we should fetch it from Scryfall and insert it
        // This is a simplified version - in a real app, you'd call Scryfall API
        
        // For now, just create a placeholder card
        const { data: newCard, error: insertError } = await supabase
          .from('cards')
          .insert({
            name: data.name,
            set_name: data.set,
            set_code: 'unknown', // In a real app, get this from Scryfall
            collector_number: '1', // In a real app, get this from Scryfall
            rarity: 'common', // In a real app, get this from Scryfall
          })
          .select('id')
          .single();
          
        if (insertError) {
          throw insertError;
        }
        
        cardId = newCard.id;
      } else {
        cardId = existingCard.id;
      }
      
      // Now add the card to the user's inventory
      const { error: inventoryError } = await supabase
        .from('user_inventory')
        .insert({
          user_id: user.id,
          card_id: cardId,
          quantity: data.quantity,
          condition: data.condition,
          language: data.language,
          price: data.price,
          for_trade: data.forTrade
        });
        
      if (inventoryError) {
        throw inventoryError;
      }
      
      toast.success("Carta agregada correctamente");
      onSuccess();
      
    } catch (error) {
      console.error("Error adding card:", error);
      toast.error("Error al agregar la carta");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agregar Carta Manualmente</CardTitle>
        <CardDescription>Cargá los detalles de tu carta para agregarla a tu colección</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Nombre de la Carta</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          handleNameChange(e.target.value);
                        }}
                        placeholder="Ej: Lightning Bolt"
                        autoComplete="off"
                      />
                    </FormControl>
                    {showSuggestions && filteredCards.length > 0 && (
                      <div className="absolute z-10 mt-1 w-full bg-background shadow-lg rounded-md border">
                        <ul className="max-h-60 overflow-auto py-1">
                          {filteredCards.map((card, index) => (
                            <li
                              key={index}
                              className="px-3 py-2 hover:bg-accent cursor-pointer text-sm"
                              onClick={() => selectSuggestion(card)}
                            >
                              {card}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="set"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Edición</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          placeholder="Ej: Commander Legends"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="language"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Idioma</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona el idioma" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CARD_LANGUAGES.map((language) => (
                            <SelectItem key={language.value} value={language.value}>{language.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condición</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la condición" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {CARD_CONDITIONS.map((condition) => (
                            <SelectItem key={condition.value} value={condition.value}>
                              {condition.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cantidad</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (ARS)</FormLabel>
                    <FormControl>
                      <Input type="number" min="0" step="100" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="forTrade"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <div className="space-y-0.5">
                      <FormLabel>Disponible para intercambio</FormLabel>
                      <p className="text-sm text-muted-foreground">
                        Esta carta aparecerá en tu perfil público para intercambios
                      </p>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <CardFooter className="px-0">
              <Button 
                type="submit" 
                className="w-full md:w-auto" 
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Agregando...
                  </>
                ) : (
                  "Agregar a mi colección"
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ManualCardEntry;
