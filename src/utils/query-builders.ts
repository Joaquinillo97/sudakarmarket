
// Utility function to build Scryfall query from search parameters
export function buildScryfallQuery({
  name = "",
  set = "",
  color = "",
  colorIdentity = "",
  rarity = "",
  language = ""
}: {
  name?: string;
  set?: string;
  color?: string;
  colorIdentity?: string;
  rarity?: string;
  language?: string;
}): string {
  let query = "";
  
  // Name filter - use exact name match if specified
  if (name) {
    // Change to allow partial name matches for better results
    query += `name:"${name}"`;
  }
  
  // Set filter - use set: operator with the set code
  if (set && set !== "all") {
    query += query ? ` set:${set}` : `set:${set}`;
    console.log(`Set filter applied: ${set}`);
  }
  
  // Color filter - use c: operator with the Scryfall color codes
  if (color && color !== "all") {
    // Fix color filter mapping to ensure it works with Scryfall's expected format
    let colorQuery;
    if (color === "M") {
      colorQuery = "multicolor";
    } else if (color === "C") {
      colorQuery = "colorless";
    } else {
      colorQuery = color;
    }
    query += query ? ` c:${colorQuery}` : `c:${colorQuery}`;
    console.log(`Color filter applied: ${color} → ${colorQuery}`);
  }
  
  // Color identity filter - use ci: operator
  if (colorIdentity && colorIdentity !== "all") {
    query += query ? ` ci:${colorIdentity}` : `ci:${colorIdentity}`;
    console.log(`Color identity filter applied: ${colorIdentity}`);
  }
  
  // Rarity filter - use r: operator
  if (rarity && rarity !== "all") {
    query += query ? ` r:${rarity}` : `r:${rarity}`;
    console.log(`Rarity filter applied: ${rarity}`);
  }
  
  // Language filter - use lang: operator
  if (language && language !== "all") {
    query += query ? ` lang:${language}` : `lang:${language}`;
    console.log(`Language filter applied: ${language}`);
  }
  
  // If no query is provided, search for recent cards
  if (!query) {
    query = "year>=2023 order:released";
  }
  
  return query;
}
