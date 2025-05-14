export interface Song {
    id: string
    title: string
    artist?: string
    audioUrl: string
    categoryId: string
  }
  
  export interface Category {
    id: string
    name: string
    songs: Song[]
  }
  
  export interface QuickAction {
    id: string
    name: string
    audioUrl: string
  }
  
  export interface AppData {
    categories: Category[]
    quickActions: QuickAction[]
  }
  