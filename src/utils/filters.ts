
import { ScryfallCard } from "@/services/scryfall";

// Apply price filter to a list of cards
export function applyPriceFilter(
  cards: ScryfallCard[], 
  priceRange: [number, number] = [0, 100000]
): ScryfallCard[] {
  if (!priceRange || (priceRange[0] <= 0 && priceRange[1] >= 100000)) {
    return cards; // No filtering needed
  }

  const [minPrice, maxPrice] = priceRange;
  // Convert to USD for comparison with Scryfall prices
  const minUsd = minPrice / 1000; // Assuming 1 USD = 1000 ARS
  const maxUsd = maxPrice / 1000;
  
  console.log(`Filtering prices from ${minUsd} to ${maxUsd} USD`);
  
  const filteredCards = cards.filter(card => {
    // Get the card price in USD (using usd or usd_foil)
    const cardPriceUsd = parseFloat(card.prices.usd || card.prices.usd_foil || '0');
    const withinRange = cardPriceUsd >= minUsd && cardPriceUsd <= maxUsd;
    
    // Log each card's price assessment for debugging
    if (!withinRange && cardPriceUsd > 0) {
      console.log(`Card "${card.name}" price ${cardPriceUsd} USD is outside range [${minUsd}, ${maxUsd}]`);
    }
    
    return withinRange;
  });
  
  console.log(`Cards after price filtering: ${filteredCards.length}`);
  return filteredCards;
}
