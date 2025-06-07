
import { ScryfallCard } from "@/services/scryfall";

// Apply price filter to a list of cards
export function applyPriceFilter(
  cards: ScryfallCard[], 
  priceRange: [number, number] = [0, 1000]
): ScryfallCard[] {
  if (!priceRange || (priceRange[0] <= 0 && priceRange[1] >= 1000)) {
    return cards; // No filtering needed
  }

  const [minPrice, maxPrice] = priceRange;
  // Use USD prices directly
  
  console.log(`Filtering prices from $${minPrice} to $${maxPrice} USD`);
  
  const filteredCards = cards.filter(card => {
    // Get the card price in USD (using usd or usd_foil)
    const cardPriceUsd = parseFloat(card.prices.usd || card.prices.usd_foil || '0');
    const withinRange = cardPriceUsd >= minPrice && cardPriceUsd <= maxPrice;
    
    // Log each card's price assessment for debugging
    if (!withinRange && cardPriceUsd > 0) {
      console.log(`Card "${card.name}" price $${cardPriceUsd} USD is outside range [$${minPrice}, $${maxPrice}]`);
    }
    
    return withinRange;
  });
  
  console.log(`Cards after price filtering: ${filteredCards.length}`);
  return filteredCards;
}
