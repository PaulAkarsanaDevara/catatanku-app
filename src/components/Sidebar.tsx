import { useState } from 'react';
import {
  StickyNote,
  Search,
  Plus,
  Tag,
  Star,
  Pin,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  Trash2,
  LayoutGrid,
  List,
  SortAsc,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { useAllTags } from '../hooks/useNotes';
import {
  addNote,
  setSearchQuery,
  setSelectedCategory,
  setSelectedTag,
  toggleTheme,
  setSortBy,
  setViewMode,
} from '../features/notes/notesSlice';
import type { SortBy } from '../types';

export default function Sidebar() {
  const dispatch = useAppDispatch();
  const {
    categories,
    selectedCategory,
    selectedTag,
    searchQuery,
    theme,
    sortBy,
    viewMode,
    notes,
  } = useAppSelector((s) => s.notes);
  const allTags = useAllTags();
  const [showCategories, setShowCategories] = useState(true);
  const [showTags, setShowTags] = useState(true);

  const pinnedCount = notes.filter((n) => n.isPinned).length;
  const favoriteCount = notes.filter((n) => n.isFavorite).length;

  const sortOptions: { value: SortBy; label: string }[] = [
    { value: 'updatedAt', label: 'Last Modified' },
    { value: 'createdAt', label: 'Date Created' },
    { value: 'title', label: 'Title A–Z' },
  ];

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">
          <StickyNote size={18} />
        </div>
        <span className="logo-text">CATATANKU</span>
        <div className="sidebar-actions">
          <button
            className="icon-btn"
            onClick={() =>
              dispatch(setViewMode(viewMode === 'grid' ? 'list' : 'grid'))
            }
            title="Toggle view"
          >
            {viewMode === 'grid' ? (
              <List size={16} />
            ) : (
              <LayoutGrid size={16} />
            )}
          </button>
          <button
            className="icon-btn"
            onClick={() => dispatch(toggleTheme())}
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <Search size={14} className="search-icon" />
        <input
          className="search-input"
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        />
      </div>

      {/* New Note */}
      <button className="new-note-btn" onClick={() => dispatch(addNote({}))}>
        <Plus size={16} /> New Note
      </button>

      {/* Quick filters */}
      <nav className="nav-section">
        <button
          className={`nav-item ${!selectedCategory && !selectedTag ? 'active' : ''}`}
          onClick={() => {
            dispatch(setSelectedCategory(null));
            dispatch(setSelectedTag(null));
          }}
        >
          <StickyNote size={15} /> All Notes
          <span className="nav-count">{notes.length}</span>
        </button>
        <button
          className={`nav-item ${selectedCategory === '__pinned__' ? 'active' : ''}`}
          onClick={() => {
            dispatch(setSelectedCategory('__pinned__'));
            dispatch(setSelectedTag(null));
          }}
        >
          <Pin size={15} /> Pinned
          <span className="nav-count">{pinnedCount}</span>
        </button>
        <button
          className={`nav-item ${selectedCategory === '__favorites__' ? 'active' : ''}`}
          onClick={() => {
            dispatch(setSelectedCategory('__favorites__'));
            dispatch(setSelectedTag(null));
          }}
        >
          <Star size={15} /> Favorites
          <span className="nav-count">{favoriteCount}</span>
        </button>
        <button
          className={`nav-item ${selectedCategory === '__trash__' ? 'active' : ''}`}
          onClick={() => {
            dispatch(setSelectedCategory('__trash__'));
            dispatch(setSelectedTag(null));
          }}
        >
          <Trash2 size={15} /> Trash
        </button>
      </nav>

      {/* Categories */}
      <div className="section-group">
        <button
          className="section-header"
          onClick={() => setShowCategories(!showCategories)}
        >
          {showCategories ? (
            <ChevronDown size={13} />
          ) : (
            <ChevronRight size={13} />
          )}
          Categories
        </button>
        {showCategories && (
          <div className="section-items">
            {categories.map((cat) => {
              const count = notes.filter((n) => n.category === cat.id).length;
              return (
                <button
                  key={cat.id}
                  className={`nav-item ${selectedCategory === cat.id ? 'active' : ''}`}
                  onClick={() => {
                    dispatch(setSelectedCategory(cat.id));
                    dispatch(setSelectedTag(null));
                  }}
                >
                  <span className="cat-dot" style={{ background: cat.color }} />
                  {cat.icon} {cat.name}
                  <span className="nav-count">{count}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Tags */}
      {allTags.length > 0 && (
        <div className="section-group">
          <button
            className="section-header"
            onClick={() => setShowTags(!showTags)}
          >
            {showTags ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            Tags
          </button>
          {showTags && (
            <div className="tags-list">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  className={`tag-chip ${selectedTag === tag ? 'active' : ''}`}
                  onClick={() => {
                    dispatch(setSelectedTag(selectedTag === tag ? null : tag));
                    dispatch(setSelectedCategory(null));
                  }}
                >
                  <Tag size={11} /> {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sort */}
      <div className="sort-section">
        <SortAsc size={13} />
        <select
          className="sort-select"
          value={sortBy}
          onChange={(e) => dispatch(setSortBy(e.target.value as SortBy))}
        >
          {sortOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}
