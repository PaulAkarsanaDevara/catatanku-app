import { KEYS } from "../constants";
import type { Category, Note, SortBy, Theme, ViewMode } from "../types";
import { defaultCategories } from "./defaultCategories";

export const storage = {
  getNotes: (): Note[] => {
    try {
      const data = localStorage.getItem(KEYS.NOTES);
      return data ? JSON.parse(data) : [];
     }  catch {
        return [];
    }
  },
  saveNotes: (notes: Note[]) => {
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  },
  getCategories: (): Category[] => {
    try {
      const data = localStorage.getItem(KEYS.CATEGORIES);
      return data ? JSON.parse(data) : defaultCategories;
    } catch {
      return defaultCategories;
    }
  },
  saveCategories: (categories: Category[]) => {
    localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(categories));
  },
  getTheme: (): Theme => {
    return (localStorage.getItem(KEYS.THEME) as Theme) || 'dark';
  },
  saveTheme: (theme: Theme) => {
    localStorage.setItem(KEYS.THEME, theme);
  },
  getViewMode: (): ViewMode => {
    return (localStorage.getItem(KEYS.VIEW_MODE) as ViewMode) || 'grid';
  },
  saveViewMode: (mode: ViewMode) => {
    localStorage.setItem(KEYS.VIEW_MODE, mode);
  },
  getSortBy: (): SortBy => {
    return (localStorage.getItem(KEYS.SORT_BY) as SortBy) || 'updatedAt'
  },
  saveSortBy: (sort: SortBy) => {
    localStorage.setItem(KEYS.SORT_BY, sort);
  }
}
