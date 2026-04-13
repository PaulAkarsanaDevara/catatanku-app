import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { v4 as uuidv4 } from 'uuid'
import type { Note,Category, SortBy, ViewMode, NoteColor, NoteState } from '../../types'
import { storage } from '../../utils/storage'

const initialState: NoteState = {
  notes: storage.getNotes(),
  categories: storage.getCategories(),
  selectedNoteId: null,
  searchQuery: '',
  selectedCategory: null,
  selectedTag: null,
  sortBy: storage.getSortBy(),
  viewMode: storage.getViewMode(),
  theme: storage.getTheme(),
  isEditing: false
}

const notesSlice = createSlice({
  name: 'notes',
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<{ title?: string; category?: string }>) => {
      const now = new Date().toISOString()
      const newNote: Note = {
        id: uuidv4(),
        title: action.payload.title || 'Untitled Note',
        content: '',
        category: action.payload.category || state.selectedCategory || '',
        tags: [],
        color: 'default',
        isPinned: false,
        isFavorite: false,
        createdAt: now,
        updatedAt: now
      }

      state.notes.unshift(newNote)
      state.selectedNoteId = newNote.id
      state.isEditing = true
      storage.saveNotes(state.notes)
    },
    updateNote: (state, action: PayloadAction<Partial<Note> & { id: string}>) => {
      const index = state.notes.findIndex(n => n.id === action.payload.id)
      if(index !== -1) {
        state.notes[index] = {
          ...state.notes[index],
          ...action.payload,
          updatedAt: new Date().toISOString(),
        }
        
        storage.saveNotes(state.notes)
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter(n => n.id !== action.payload)
      if(state.selectedNoteId === action.payload) {
        state.selectedNoteId = state.notes[0]?.id || null
        state.isEditing = false
      }
      
      storage.saveNotes(state.notes)
    },
    togglePin: (state, action: PayloadAction<string>) => {
      const note = state.notes.find(n => n.id === action.payload)
      if(note) {
        note.isPinned = !note.isPinned
        note.updatedAt = new Date().toISOString()
        storage.saveNotes(state.notes)
      }
    },
    toggleFavorite: (state, action: PayloadAction<string>) => {
      const note = state.notes.find(n => n.id === action.payload)
      if(note) {
        note.isFavorite = !note.isFavorite
        note.updatedAt = new Date().toISOString()
        storage.saveNotes(state.notes)
      }
    },
    setNoteColor: (state, action: PayloadAction<{ id: string; color: NoteColor }>) => {
      const note = state.notes.find(n => n.id === action.payload.id)
      if (note) {
        note.color = action.payload.color
        storage.saveNotes(state.notes)
      }
    },
    addTag: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const note = state.notes.find(n => n.id === action.payload.id)
      if (note && !note.tags.includes(action.payload.tag)) {
        note.tags.push(action.payload.tag)
        note.updatedAt = new Date().toISOString()
        storage.saveNotes(state.notes)
      }
    },
    removeTag: (state, action: PayloadAction<{ id: string; tag: string }>) => {
      const note = state.notes.find(n => n.id === action.payload.id)
      if (note) {
        note.tags = note.tags.filter(t => t !== action.payload.tag)
        note.updatedAt = new Date().toISOString()
        storage.saveNotes(state.notes)
      }
    },
    selectNote: (state, action: PayloadAction<string | null>) => {
      state.selectedNoteId = action.payload
      state.isEditing = false
    },
    setEditing: (state, action: PayloadAction<boolean>) => {
      state.isEditing = action.payload
    },
 
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
 
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
      state.selectedNoteId = null
      state.isEditing = false
    },
 
    setSelectedTag: (state, action: PayloadAction<string | null>) => {
      state.selectedTag = action.payload
    },

    setSortBy: (state, action: PayloadAction<SortBy>) => {
      state.sortBy = action.payload
      storage.saveSortBy(action.payload)
    },
 
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload
      storage.saveViewMode(action.payload)
    },
 
    toggleTheme: (state) => {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      storage.saveTheme(state.theme)
    },
 
    addCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload)
      storage.saveCategories(state.categories)
    },
 
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(c => c.id !== action.payload)
      if (state.selectedCategory === action.payload) {
        state.selectedCategory = null
      }
      storage.saveCategories(state.categories)
    },
  }
})

export const {
  addNote, updateNote, deleteNote,
  togglePin, toggleFavorite, setNoteColor,
  addTag, removeTag,
  selectNote, setEditing,
  setSearchQuery, setSelectedCategory, setSelectedTag,
  setSortBy, setViewMode, toggleTheme,
  addCategory, deleteCategory,
} = notesSlice.actions

export default notesSlice.reducer