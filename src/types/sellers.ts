
export interface Seller {
  id: string;
  username: string;
  avatar_url?: string;
  location?: string;
  rating: number;
  matchingCards?: number;
  subscriptionType?: string;
  // Add these properties to make Seller compatible with ChatInterface
  name?: string;
  avatar?: string;
}

export interface SellerCard {
  id: string;
  name: string;
  set: string;
  imageUrl: string;
  price: number;
  seller: {
    id: string;
    name: string;
    rating: number;
  };
  condition: string;
  language: string;
}
