
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Scryfall API base URL
const SCRYFALL_API_BASE = 'https://api.scryfall.com'

interface ScryfallCard {
  id: string
  name: string
  set_name: string
  set: string
  collector_number: string
  image_uris?: {
    normal: string
  }
  card_faces?: Array<{
    image_uris?: {
      normal: string
    }
  }>
}

interface ScryfallResponse {
  object: string
  total_cards: number
  has_more: boolean
  next_page?: string
  data: ScryfallCard[]
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    console.log('Starting Scryfall card synchronization...')

    let totalProcessed = 0
    let nextPageUrl = `${SCRYFALL_API_BASE}/cards/search?q=*&order=set`
    
    while (nextPageUrl) {
      console.log(`Fetching page: ${nextPageUrl}`)
      
      // Fetch data from Scryfall with rate limiting
      const response = await fetch(nextPageUrl)
      
      if (!response.ok) {
        if (response.status === 429) {
          // Rate limited, wait and retry
          console.log('Rate limited, waiting 100ms...')
          await new Promise(resolve => setTimeout(resolve, 100))
          continue
        }
        throw new Error(`Scryfall API error: ${response.status}`)
      }

      const data: ScryfallResponse = await response.json()
      
      // Transform and prepare cards for insertion
      const cardsToInsert = data.data.map(card => {
        // Get image URL, handling cards with multiple faces
        let imageUri = card.image_uris?.normal || ''
        if (!imageUri && card.card_faces && card.card_faces[0]?.image_uris) {
          imageUri = card.card_faces[0].image_uris.normal
        }

        return {
          scryfall_id: card.id,
          name: card.name,
          set_name: card.set_name,
          set_code: card.set,
          image_uri: imageUri,
          collector_number: card.collector_number
        }
      })

      // Insert cards in batch using upsert to handle duplicates
      const { error } = await supabase
        .from('cards')
        .upsert(cardsToInsert, { 
          onConflict: 'scryfall_id',
          ignoreDuplicates: false 
        })

      if (error) {
        console.error('Database error:', error)
        throw error
      }

      totalProcessed += cardsToInsert.length
      console.log(`Processed ${cardsToInsert.length} cards (Total: ${totalProcessed})`)

      // Check if there are more pages
      nextPageUrl = data.has_more ? data.next_page : null
      
      // Add a small delay to respect Scryfall's rate limits
      if (nextPageUrl) {
        await new Promise(resolve => setTimeout(resolve, 50))
      }
    }

    console.log(`Synchronization complete! Total cards processed: ${totalProcessed}`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Successfully synchronized ${totalProcessed} cards`,
        totalProcessed 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Sync error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})
