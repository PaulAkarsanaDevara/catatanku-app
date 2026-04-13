export type NoteColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' |  'blue' | 'purple' | 'pink'

export interface Note {
  id: string
  title: string
  content: string
  category: string
  tags: string[]
  color: NoteColor
  isPinned: boolean
  isFavorite: boolean
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
}

export type SortBy = 'updatedAt' | 'createdAt' | 'title'
export type ViewMode = 'grid' | 'list'
export type Theme = 'dark' | 'light'
export type MobilePanel = 'list' | 'editor' | 'sidebar'
export interface NoteState {
  notes: Note[]
  categories: Category[]
  selectedNoteId: string | null
  searchQuery: string
  selectedCategory: string | null
  selectedTag: string | null
  sortBy: SortBy
  viewMode: ViewMode
  theme: Theme
  isEditing: boolean
  mobilePanel: MobilePanel
  sidebarOpen: boolean
}