
// Types for Scryfall API responses
export interface ScryfallCard {
  id: string;
  name: string;
  set_name: string;
  set: string;
  set_id: string;
  collector_number: string;
  rarity: string;
  oracle_text?: string;
  mana_cost?: string;
  type_line?: string;
  power?: string;
  toughness?: string;
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
  colors: string[];
  color_identity: string[];
  lang: string;
  prices: {
    usd: string | null;
    usd_foil: string | null;
    eur: string | null;
    eur_foil: string | null;
  };
}

export interface ScryfallListResponse {
  object: string;
  total_cards: number;
  has_more: boolean;
  next_page?: string;
  data: ScryfallCard[];
}

export interface ScryfallError {
  status: number;
  code: string;
  details: string;
}
