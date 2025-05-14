import { toast } from "@/components/ui/sonner";

// Interfaz para la respuesta de la carta de Scryfall
interface ScryfallCardResponse {
  id: string;
  name: string;
  image_uris?: {
    small: string;
    normal: string;
    large: string;
    png: string;
    art_crop: string;
    border_crop: string;
  };
  card_faces?: Array<{
    image_uris?: {
      small: string;
      normal: string;
      large: string;
      png: string;
      art_crop: string;
      border_crop: string;
    };
  }>;
}

// Lista de cartas Power Nine con sus códigos de set para Alpha (LEA)
export const POWER_NINE = [
  { name: "Black Lotus", set: "lea" },
  { name: "Ancestral Recall", set: "lea" },
  { name: "Time Walk", set: "lea" },
  { name: "Mox Pearl", set: "lea" },
  { name: "Mox Sapphire", set: "lea" },
  { name: "Mox Jet", set: "lea" },
  { name: "Mox Ruby", set: "lea" },
  { name: "Mox Emerald", set: "lea" },
  { name: "Timetwister", set: "lea" }
];

// Lista de las 10 cartas más solicitadas (basadas en wishlists)
export const TOP_CARDS = [
  { name: "Ragavan, Nimble Pilferer", set: "mh2" },
  { name: "Solitude", set: "mh2" },
  { name: "Force of Negation", set: "mh1" },
  { name: "Urza's Saga", set: "mh2" },
  { name: "Wrenn and Six", set: "mh1" },
  { name: "Mishra's Bauble", set: "2xm" },
  { name: "Murktide Regent", set: "mh2" },
  { name: "Esper Sentinel", set: "mh2" },
  { name: "Omnath, Locus of Creation", set: "znr" },
  { name: "Endurance", set: "mh2" }
];

// Función para obtener la imagen de una carta por su nombre exacto
export const getCardImageByExactName = async (
  cardName: string, 
  setCode?: string,
  imageSize: 'small' | 'normal' | 'large' | 'png' | 'art_crop' | 'border_crop' = 'large'
): Promise<string | null> => {
  try {
    let url = `https://api.scryfall.com/cards/named?exact=${encodeURIComponent(cardName)}`;
    
    // Agregar el código del set si está disponible
    if (setCode) {
      url += `&set=${setCode}`;
    }
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: ScryfallCardResponse = await response.json();
    
    // Obtener la URL de la imagen
    if (data.image_uris && data.image_uris[imageSize]) {
      return data.image_uris[imageSize];
    } 
    // Para cartas de doble cara
    else if (data.card_faces && data.card_faces[0]?.image_uris) {
      return data.card_faces[0].image_uris[imageSize];
    }
    
    throw new Error("No image found in the response");
  } catch (error) {
    console.error(`Error fetching ${cardName} image:`, error);
    toast.error(`No se pudo cargar la imagen de ${cardName}`);
    return null;
  }
};

// Función para obtener la imagen de una carta por su ID de Scryfall
export const getCardImageById = async (
  cardId: string,
  imageSize: 'small' | 'normal' | 'large' | 'png' | 'art_crop' | 'border_crop' = 'large'
): Promise<string | null> => {
  try {
    const response = await fetch(`https://api.scryfall.com/cards/${cardId}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data: ScryfallCardResponse = await response.json();
    
    // Obtener la URL de la imagen
    if (data.image_uris && data.image_uris[imageSize]) {
      return data.image_uris[imageSize];
    } 
    // Para cartas de doble cara
    else if (data.card_faces && data.card_faces[0]?.image_uris) {
      return data.card_faces[0].image_uris[imageSize];
    }
    
    throw new Error("No image found in the response");
  } catch (error) {
    console.error(`Error fetching card image for ID ${cardId}:`, error);
    toast.error("No se pudo cargar la imagen de la carta");
    return null;
  }
};

// Función para cargar todas las imágenes de Power Nine
export const loadPowerNineImages = async (): Promise<{name: string, image: string | null}[]> => {
  const results = await Promise.all(
    POWER_NINE.map(async (card) => {
      const image = await getCardImageByExactName(card.name, card.set);
      return { name: card.name, image };
    })
  );
  
  // Filtrar las cartas que no pudieron cargarse
  return results.filter(card => card.image !== null);
};

// Nueva función para cargar las 10 cartas más solicitadas
export const loadTopRequestedCards = async (): Promise<{name: string, image: string | null}[]> => {
  try {
    const results = await Promise.all(
      TOP_CARDS.map(async (card) => {
        const image = await getCardImageByExactName(card.name, card.set);
        return { name: card.name, image };
      })
    );
    
    // Filtrar las cartas que no pudieron cargarse
    return results.filter(card => card.image !== null);
  } catch (error) {
    console.error("Error cargando las cartas más solicitadas:", error);
    toast.error("Error al cargar las cartas más solicitadas");
    return [];
  }
};

// Nota: Para futuras integraciones, aquí agregaríamos funciones para otras operaciones con la API de Scryfall
