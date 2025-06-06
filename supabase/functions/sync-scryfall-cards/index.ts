
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

interface SyncProgress {
  id: string
  current_set_code?: string
  current_page?: string
  sets_completed: string[]
  total_cards_processed: number
  last_updated: string
  status: 'running' | 'completed' | 'error'
  error_message?: string
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

    console.log('Starting improved Scryfall card synchronization...')

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
      resumeFromSet, 
      maxSetsPerRun = 5, 
      maxCardsPerSet = 1000 
    } = requestParams as {
      resumeFromSet?: string
      maxSetsPerRun?: number
      maxCardsPerSet?: number
    }

    // Create sync_progress table if it doesn't exist
    await createSyncProgressTable(supabase)

    // Get or create sync progress record
    let syncProgress = await getSyncProgress(supabase)
    
    if (!syncProgress) {
      syncProgress = await createSyncProgress(supabase)
    }

    console.log('Current sync progress:', syncProgress)

    // If sync is already completed, return status
    if (syncProgress.status === 'completed') {
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Synchronization already completed',
          totalCards: syncProgress.total_cards_processed,
          status: 'completed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update status to running
    await updateSyncProgress(supabase, {
      ...syncProgress,
      status: 'running',
      last_updated: new Date().toISOString()
    })

    // Get all sets from Scryfall
    console.log('Fetching sets from Scryfall...')
    const sets = await fetchScryfallSets()
    
    // Filter out sets that are already completed
    const pendingSets = sets.filter(set => 
      !syncProgress!.sets_completed.includes(set.code) &&
      set.card_count > 0 // Only process sets with cards
    )

    console.log(`Found ${pendingSets.length} pending sets to process`)

    // Process sets in batches
    let setsProcessed = 0
    let totalCardsThisRun = 0

    for (const set of pendingSets) {
      if (setsProcessed >= maxSetsPerRun) {
        console.log(`Reached maximum sets per run (${maxSetsPerRun}). Stopping.`)
        break
      }

      console.log(`Processing set: ${set.name} (${set.code}) - ${set.card_count} cards`)

      try {
        const cardsProcessed = await processSingleSet(supabase, set, maxCardsPerSet)
        
        // Mark set as completed
        syncProgress.sets_completed.push(set.code)
        syncProgress.total_cards_processed += cardsProcessed
        totalCardsThisRun += cardsProcessed
        
        // Update progress
        await updateSyncProgress(supabase, {
          ...syncProgress,
          current_set_code: set.code,
          last_updated: new Date().toISOString()
        })

        setsProcessed++
        console.log(`Completed set ${set.code}. Cards processed: ${cardsProcessed}`)

        // Add delay between sets to be respectful to Scryfall
        await new Promise(resolve => setTimeout(resolve, 200))

      } catch (error) {
        console.error(`Error processing set ${set.code}:`, error)
        
        // Update progress with error
        await updateSyncProgress(supabase, {
          ...syncProgress,
          status: 'error',
          error_message: `Error processing set ${set.code}: ${error.message}`,
          last_updated: new Date().toISOString()
        })

        return new Response(
          JSON.stringify({ 
            success: false, 
            error: `Error processing set ${set.code}: ${error.message}`,
            totalProcessedThisRun: totalCardsThisRun
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        )
      }
    }

    // Check if all sets are completed
    const allSetsCompleted = pendingSets.length === 0 || 
      syncProgress.sets_completed.length >= sets.length

    if (allSetsCompleted) {
      await updateSyncProgress(supabase, {
        ...syncProgress,
        status: 'completed',
        last_updated: new Date().toISOString()
      })

      console.log('Synchronization completed!')
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Synchronization completed successfully!',
          totalCards: syncProgress.total_cards_processed,
          status: 'completed'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Batch completed. Processed ${setsProcessed} sets with ${totalCardsThisRun} cards`,
        totalCards: syncProgress.total_cards_processed,
        setsProcessed: setsProcessed,
        cardsThisRun: totalCardsThisRun,
        status: 'in_progress',
        nextBatchAvailable: true
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})

// Helper functions

async function createSyncProgressTable(supabase: any) {
  const { error } = await supabase.rpc('create_sync_progress_table_if_not_exists')
  if (error && !error.message.includes('already exists')) {
    // Create table using a simple insert/select approach since we can't execute raw SQL
    try {
      await supabase.from('sync_progress').select('id').limit(1)
    } catch (e) {
      console.log('sync_progress table does not exist, will track progress in memory for this run')
    }
  }
}

async function getSyncProgress(supabase: any): Promise<SyncProgress | null> {
  try {
    const { data, error } = await supabase
      .from('sync_progress')
      .select('*')
      .eq('id', 'scryfall_sync')
      .single()
    
    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('Error fetching sync progress:', error)
      return null
    }
    
    return data
  } catch (e) {
    // Table might not exist, return null to create new progress
    return null
  }
}

async function createSyncProgress(supabase: any): Promise<SyncProgress> {
  const newProgress: SyncProgress = {
    id: 'scryfall_sync',
    sets_completed: [],
    total_cards_processed: 0,
    last_updated: new Date().toISOString(),
    status: 'running'
  }

  try {
    const { data, error } = await supabase
      .from('sync_progress')
      .insert(newProgress)
      .select()
      .single()
    
    if (error) {
      console.error('Error creating sync progress:', error)
      // Return the progress object anyway to continue
      return newProgress
    }
    
    return data
  } catch (e) {
    // If table doesn't exist, return the progress object to continue
    console.log('Using in-memory progress tracking')
    return newProgress
  }
}

async function updateSyncProgress(supabase: any, progress: SyncProgress) {
  try {
    const { error } = await supabase
      .from('sync_progress')
      .upsert(progress)
    
    if (error) {
      console.error('Error updating sync progress:', error)
    }
  } catch (e) {
    console.log('Could not update sync progress in database, continuing...')
  }
}

async function fetchScryfallSets(): Promise<ScryfallSet[]> {
  const response = await fetch(`${SCRYFALL_API_BASE}/sets`)
  
  if (!response.ok) {
    throw new Error(`Failed to fetch sets: ${response.status}`)
  }

  const data = await response.json()
  
  // Filter for paper sets and sort by release date (oldest first for consistent processing)
  return data.data
    .filter((set: any) => 
      set.set_type !== 'token' && 
      set.set_type !== 'memorabilia' && 
      set.card_count > 0
    )
    .sort((a: any, b: any) => a.released_at.localeCompare(b.released_at))
}

async function processSingleSet(supabase: any, set: ScryfallSet, maxCards: number): Promise<number> {
  let totalProcessed = 0
  let nextPageUrl = `${SCRYFALL_API_BASE}/cards/search?q=set:${set.code}&order=set`
  
  while (nextPageUrl && totalProcessed < maxCards) {
    console.log(`Fetching page for set ${set.code}, cards processed: ${totalProcessed}`)
    
    // Fetch data from Scryfall with conservative rate limiting
    const response = await fetch(nextPageUrl)
    
    if (!response.ok) {
      if (response.status === 429) {
        // Rate limited, wait longer and retry
        console.log('Rate limited, waiting 2 seconds...')
        await new Promise(resolve => setTimeout(resolve, 2000))
        continue
      }
      throw new Error(`Scryfall API error: ${response.status}`)
    }

    const data: ScryfallResponse = await response.json()
    
    if (data.data.length === 0) {
      console.log(`No cards found for set ${set.code}`)
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
      console.error('Database error:', error)
      throw error
    }

    totalProcessed += cardsToInsert.length
    console.log(`Processed ${cardsToInsert.length} cards from set ${set.code} (Total: ${totalProcessed})`)

    // Check if there are more pages
    nextPageUrl = data.has_more ? data.next_page : null
    
    // Add conservative delay between requests (100ms)
    if (nextPageUrl) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  return totalProcessed
}
