import { useMemo } from 'react'
import { useAppSelector } from './redux'
import type { Note } from '../types'

export const useFilteredNotes = (): Note[] => {
  const { notes, searchQuery, selectedCategory, selectedTag, sortBy } = useAppSelector(s => s.notes)

  return useMemo(() => {
    let filtered = [...notes]

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(q) ||
        n.content.toLowerCase().includes(q) ||
        n.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    if (selectedCategory) {
      filtered = filtered.filter(n => n.category === selectedCategory)
    }

    if (selectedTag) {
      filtered = filtered.filter(n => n.tags.includes(selectedTag))
    }

    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1
      if (sortBy === 'title') return a.title.localeCompare(b.title)
      return new Date(b[sortBy]).getTime() - new Date(a[sortBy]).getTime()
    })

    return filtered
  }, [notes, searchQuery, selectedCategory, selectedTag, sortBy])
}

export const useAllTags = (): string[] => {
  const notes = useAppSelector(s => s.notes.notes)
  return useMemo(() => {
    const tagSet = new Set<string>()
    notes.forEach(n => n.tags.forEach(t => tagSet.add(t)))
    return Array.from(tagSet).sort()
  }, [notes])
}

export const useSelectedNote = () => {
  const { notes, selectedNoteId } = useAppSelector(s => s.notes)
  return useMemo(() => notes.find(n => n.id === selectedNoteId) || null, [notes, selectedNoteId])
}