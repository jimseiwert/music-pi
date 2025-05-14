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
    // Delete all songs in the category first
    const { error: songsError } = await supabase
      .from('songs')
      .delete()
      .eq('category_id', params.id)

    if (songsError) throw songsError

    // Delete the category
    const { error: categoryError } = await supabase
      .from('categories')
      .delete()
      .eq('id', params.id)

    if (categoryError) throw categoryError

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    console.error('Error deleting category:', error)
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
  }
} 