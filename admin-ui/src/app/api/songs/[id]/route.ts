import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!
)

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the song to find the file path
    const { data: song, error: fetchError } = await supabase
      .from('songs')
      .select('file_path')
      .eq('id', params.id)
      .single()

    if (fetchError) throw fetchError

    // Delete the file from storage
    const fileName = song.file_path.split('/').pop()
    const { error: deleteError } = await supabase.storage
      .from('music-files')
      .remove([fileName!])

    if (deleteError) throw deleteError

    // Delete the song record
    const { error: songError } = await supabase
      .from('songs')
      .delete()
      .eq('id', params.id)

    if (songError) throw songError

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting song:', error)
    return NextResponse.json({ error: 'Failed to delete song' }, { status: 500 })
  }
} 