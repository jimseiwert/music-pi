import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function GET() {
  try {
    const { data: history, error } = await supabase
      .from('play_history')
      .select(`
        *,
        song:songs (
          title,
          artist
        )
      `)
      .order('played_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching play history:', error)
    return NextResponse.json({ error: 'Failed to fetch play history' }, { status: 500 })
  }
} 