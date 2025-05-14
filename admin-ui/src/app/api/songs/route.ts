import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function GET() {
  try {
    const { data: songs, error } = await supabase
      .from('songs')
      .select('*')
      .order('title')

    if (error) throw error

    return NextResponse.json(songs)
  } catch (error) {
    console.error('Error fetching songs:', error)
    return NextResponse.json({ error: 'Failed to fetch songs' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const artist = formData.get('artist') as string
    const category_id = formData.get('category_id') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Upload file to Supabase storage
    const fileBuffer = await file.arrayBuffer()
    const fileName = `${Date.now()}-${file.name}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('music-files')
      .upload(fileName, fileBuffer)

    if (uploadError) throw uploadError

    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from('music-files')
      .getPublicUrl(fileName)

    // Create song record
    const { data: song, error: songError } = await supabase
      .from('songs')
      .insert([
        {
          title,
          artist,
          category_id: parseInt(category_id),
          file_path: publicUrl,
          is_played: false,
          play_count: 0
        }
      ])
      .select()
      .single()

    if (songError) throw songError

    return NextResponse.json(song, { status: 201 })
  } catch (error) {
    console.error('Error creating song:', error)
    return NextResponse.json({ error: 'Failed to create song' }, { status: 500 })
  }
} 