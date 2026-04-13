import { Pin, Star, Tag, Trash2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import {
  selectNote,
  togglePin,
  toggleFavorite,
  deleteNote,
} from '../../features/notes/notesSlice';
import type { Note } from '../../types';

const COLOR_MAP: Record<string, string> = {
  default: 'transparent',
  red: '#ff4d4d22',
  orange: '#ff9f4322',
  yellow: '#ffd04322',
  green: '#4ade8022',
  blue: '#60a5fa22',
  purple: '#c084fc22',
  pink: '#f472b622',
};

const COLOR_BORDER: Record<string, string> = {
  default: '',
  red: '#ff4d4d',
  orange: '#ff9f43',
  yellow: '#ffd043',
  green: '#4ade80',
  blue: '#60a5fa',
  purple: '#c084fc',
  pink: '#f472b6',
};

interface Props {
  note: Note;
  viewMode: 'grid' | 'list';
}

export default function NoteCard({ note, viewMode }: Props) {
  const dispatch = useAppDispatch();
  const { selectedNoteId, categories } = useAppSelector((s) => s.notes);
  const isSelected = selectedNoteId === note.id;
  const category = categories.find((c) => c.id === note.category);

  const preview = note.content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .trim()
    .slice(0, viewMode === 'list' ? 100 : 120);

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(note.updatedAt));

  return (
    <div
      className={`note-card ${isSelected ? 'selected' : ''} view-${viewMode}`}
      style={{
        background: COLOR_MAP[note.color] || 'transparent',
        borderLeft:
          note.color !== 'default'
            ? `3px solid ${COLOR_BORDER[note.color]}`
            : undefined,
      }}
      onClick={() => dispatch(selectNote(note.id))}
    >
      <div className="note-card-header">
        <h3 className="note-title">{note.title || 'Untitled'}</h3>
        <div className="note-card-actions">
          {note.isPinned && <Pin size={12} className="icon-pin" />}
          {note.isFavorite && <Star size={12} className="icon-star" />}
        </div>
      </div>

      {viewMode === 'grid' && preview && (
        <p className="note-preview">
          {preview}
          {preview.length >= 120 ? '…' : ''}
        </p>
      )}

      <div className="note-meta">
        {category && (
          <span className="note-category" style={{ color: category.color }}>
            {category.icon} {category.name}
          </span>
        )}
        <span className="note-date">{formattedDate}</span>
      </div>

      {note.tags.length > 0 && viewMode === 'grid' && (
        <div className="note-tags">
          {note.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="note-tag">
              <Tag size={10} /> {tag}
            </span>
          ))}
          {note.tags.length > 3 && (
            <span className="note-tag">+{note.tags.length - 3}</span>
          )}
        </div>
      )}

      <div className="note-hover-actions">
        <button
          className={`hover-btn ${note.isPinned ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(togglePin(note.id));
          }}
          title="Pin"
        >
          <Pin size={13} />
        </button>
        <button
          className={`hover-btn ${note.isFavorite ? 'active-star' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleFavorite(note.id));
          }}
          title="Favorite"
        >
          <Star size={13} />
        </button>
        <button
          className="hover-btn danger"
          onClick={(e) => {
            e.stopPropagation();
            dispatch(deleteNote(note.id));
          }}
          title="Delete"
        >
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  );
}
