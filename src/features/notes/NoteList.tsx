import { Plus, StickyNote } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { addNote } from '../../features/notes/notesSlice';
import { useFilteredNotes } from '../../hooks/useNotes';
import NoteCard from './NoteCard';

export default function NoteList() {
  const dispatch = useAppDispatch();
  const { viewMode, selectedCategory } = useAppSelector((s) => s.notes);
  const notes = useFilteredNotes();

  // Special filtered views
  const displayNotes =
    selectedCategory === '__pinned__'
      ? notes.filter((n) => n.isPinned)
      : selectedCategory === '__favorites__'
        ? notes.filter((n) => n.isFavorite)
        : notes;

  const getTitle = () => {
    if (selectedCategory === '__pinned__') return 'Pinned';
    if (selectedCategory === '__favorites__') return 'Favorites';
    if (selectedCategory === '__trash__') return 'Trash';
    return 'All Notes';
  };

  return (
    <section className="note-list-panel">
      <div className="list-header">
        <span className="list-title">{getTitle()}</span>
        <span className="list-count">{displayNotes.length} notes</span>
      </div>

      {displayNotes.length === 0 ? (
        <div className="empty-state">
          <StickyNote size={40} className="empty-icon" />
          <p>No notes yet</p>
          <button
            className="empty-new-btn"
            onClick={() => dispatch(addNote({}))}
          >
            <Plus size={14} /> Create one
          </button>
        </div>
      ) : (
        <div className={`notes-${viewMode}`}>
          {displayNotes.map((note) => (
            <NoteCard key={note.id} note={note} viewMode={viewMode} />
          ))}
        </div>
      )}
    </section>
  );
}
