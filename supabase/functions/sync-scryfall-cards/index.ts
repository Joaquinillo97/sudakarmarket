
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

interface ScryfallSet {
  id: string
  code: string
  name: string
  card_count: number
  released_at: string
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

    console.log('Starting sequential Scryfall card synchronization by sets...')

    // Parse request body for parameters
    const requestBody = await req.text()
    let requestParams = {}
    try {
      if (requestBody) {
        requestParams = JSON.parse(requestBody)
      }
    } catch (e) {
      // If JSON parsing fails, use empty params
    }

    const { 
      maxSetsToProcess = 10,
      continueSync = false
    } = requestParams as {
      maxSetsToProcess?: number
      continueSync?: boolean
    }

    // Get all sets from Scryfall first
    console.log('Fetching all sets from Scryfall...')
    const allSets = await fetchScryfallSets()
    
    // Check which sets we have in our database and their completion status
    console.log('Checking set completion status in database...')
    const setCompletionStatus = await checkSetCompletionStatus(supabase, allSets)
    
    // Filter sets that need processing
    const setsToProcess = allSets.filter(set => {
      const status = setCompletionStatus.get(set.code)
      if (!status) {
        // Set not in database at all
        return set.card_count > 0
      }
      
      if (!continueSync && status.isComplete) {
        // Set is complete and we're not forcing continuation
        return false
      }
      
      // Process if incomplete or if we're continuing sync
      return set.card_count > 0
    })

    const completeSets = Array.from(setCompletionStatus.values()).filter(s => s.isComplete).length
    const incompleteSets = Array.from(setCompletionStatus.values()).filter(s => !s.isComplete).length

    console.log(`Total sets available: ${allSets.length}`)
    console.log(`Complete sets in database: ${completeSets}`)
    console.log(`Incomplete sets in database: ${incompleteSets}`)
    console.log(`Sets to process: ${setsToProcess.length}`)
    console.log(`Processing first ${Math.min(maxSetsToProcess, setsToProcess.length)} sets...`)

    let totalCardsProcessed = 0
    let setsProcessed = 0

    // Process sets sequentially
    for (const set of setsToProcess.slice(0, maxSetsToProcess)) {
      const status = setCompletionStatus.get(set.code)
      const existingCount = status ? status.currentCount : 0
      
      console.log(`\n--- Processing set: ${set.name} (${set.code}) - ${existingCount}/${set.card_count} cards ---`)

      try {
        const cardsProcessed = await processSingleSetSequential(supabase, set)
        totalCardsProcessed += cardsProcessed
        setsProcessed++
        
        console.log(`✅ Completed set ${set.code}. Cards processed: ${cardsProcessed}`)

        // Add delay between sets to be respectful to Scryfall
        if (setsProcessed < maxSetsToProcess) {
          console.log('Waiting 500ms before next set...')
          await new Promise(resolve => setTimeout(resolve, 500))
        }

      } catch (error) {
        console.error(`❌ Error processing set ${set.code}:`, error)
        // Continue with next set instead of failing completely
        continue
      }
    }

    // Get final count of cards in database
    const { count: finalCount, error: countError } = await supabase
      .from('cards')
      .select('*', { count: 'exact', head: true })

    const totalCardsInDB = finalCount || 0

    console.log(`\n🎉 Synchronization batch completed!`)
    console.log(`- Sets processed in this batch: ${setsProcessed}`)
    console.log(`- Cards added in this batch: ${totalCardsProcessed}`)
    console.log(`- Total cards now in database: ${totalCardsInDB}`)

    // Check if there are more sets to process
    const remainingSets = setsToProcess.length - maxSetsToProcess
    const hasMoreSets = remainingSets > 0

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: hasMoreSets 
          ? `Batch completed! Processed ${setsProcessed} sets with ${totalCardsProcessed} cards. ${remainingSets} sets remaining.`
          : `Synchronization completed! Processed ${setsProcessed} sets with ${totalCardsProcessed} cards.`,
        totalCards: totalCardsInDB,
        setsProcessed: setsProcessed,
        cardsThisRun: totalCardsProcessed,
        status: hasMoreSets ? 'in_progress' : 'completed',
        remainingSets: remainingSets,
        completeSets: completeSets,
        incompleteSets: incompleteSets
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('❌ Sync error:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Helper functions

async function fetchScryfallSets(): Promise<ScryfallSet[]> {
  console.log('Fetching sets from Scryfall API...')
  const response = await fetch(`${SCRYFALL_API_BASE}/sets`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sets: ${response.status}`)
  }

  const data = await response.json()
  
  // Filter for paper sets and sort by release date (oldest first for consistent processing)
  const filteredSets = data.data
    .filter((set: any) => 
      set.set_type !== 'token' && 
      set.set_type !== 'memorabilia' && 
      set.card_count > 0
    )
    .sort((a: any, b: any) => a.released_at.localeCompare(b.released_at))

  console.log(`Found ${filteredSets.length} valid sets to potentially process`)
  return filteredSets
}

async function checkSetCompletionStatus(supabase: any, allSets: ScryfallSet[]): Promise<Map<string, { currentCount: number, expectedCount: number, isComplete: boolean }>> {
  // Get count of cards per set in our database
  const { data: setCounts, error } = await supabase
    .from('cards')
    .select('set_code')
    .order('set_code')

  if (error) {
    console.error('Error fetching set counts:', error)
    throw error
  }

  // Count cards per set
  const setCountMap = new Map<string, number>()
  setCounts?.forEach((card: any) => {
    const currentCount = setCountMap.get(card.set_code) || 0
    setCountMap.set(card.set_code, currentCount + 1)
  })

  // Create completion status map
  const completionStatus = new Map<string, { currentCount: number, expectedCount: number, isComplete: boolean }>()
  
  allSets.forEach(set => {
    const currentCount = setCountMap.get(set.code) || 0
    const expectedCount = set.card_count
    const isComplete = currentCount >= expectedCount
    
    completionStatus.set(set.code, {
      currentCount,
      expectedCount,
      isComplete
    })

    if (currentCount > 0) {
      console.log(`Set ${set.code}: ${currentCount}/${expectedCount} cards (${isComplete ? 'COMPLETE' : 'INCOMPLETE'})`)
    }
  })

  return completionStatus
}

async function processSingleSetSequential(supabase: any, set: ScryfallSet): Promise<number> {
  let totalProcessed = 0
  let nextPageUrl = `${SCRYFALL_API_BASE}/cards/search?q=set:${set.code}&order=set`
  
  while (nextPageUrl) {
    console.log(`  Fetching page for set ${set.code}, cards processed so far: ${totalProcessed}`)
    
    // Fetch data from Scryfall with conservative rate limiting
    const response = await fetch(nextPageUrl)
    
    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited, wait longer and retry
        console.log('  Rate limited, waiting 2 seconds...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }
      if (response.status === 404) {
        console.log(`  No cards found for set ${set.code}`)
        break
      }
      throw new Error(`Scryfall API error: ${response.status}`)
    }

    const data: ScryfallResponse = await response.json()
    
    if (data.data.length === 0) {
      console.log(`  No more cards found for set ${set.code}`)
      break
    }
    
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
      console.error('  Database error:', error)
      throw error
    }

    totalProcessed += cardsToInsert.length
    console.log(`  ✅ Processed ${cardsToInsert.length} cards from set ${set.code} (Total: ${totalProcessed})`)

    // Check if there are more pages
    nextPageUrl = data.has_more ? data.next_page : null
    
    // Add conservative delay between requests (150ms)
    if (nextPageUrl) {
      await new Promise(resolve => setTimeout(resolve, 150))
    }
  }

  return totalProcessed
}
