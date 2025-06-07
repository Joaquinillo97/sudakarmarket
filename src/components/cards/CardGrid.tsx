
import { useState } from "react";
import CardItem from "./CardItem";

interface Card {
  id: string;
  name: string;
  set: string;
  imageUrl: string;
  price: number;
  seller?: {
    id: string;
    name: string;
    rating: number;
  };
  condition: string;
  language: string;
  color?: string;
}

interface CardGridProps {
  cards: Card[];
  isLoading?: boolean;
  isWishlistView?: boolean;
}

const CardGrid = ({ cards, isLoading = false, isWishlistView = false }: CardGridProps) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {isLoading ? (
        // Loading skeletons
        Array.from({ length: 10 }).map((_, i) => (
          <div 
            key={i} 
            className="bg-muted rounded-lg animate-pulse-slow h-[320px]"
          />
        ))
      ) : cards.length === 0 ? (
        <div className="col-span-full text-center py-12">
          <p className="text-muted-foreground">No se encontraron cartas con esos criterios</p>
        </div>
      ) : (
        cards.map((card) => (
          <CardItem key={card.id} {...card} isWishlistView={isWishlistView} />
        ))
      )}
    </div>
  );
};

export default CardGrid;
