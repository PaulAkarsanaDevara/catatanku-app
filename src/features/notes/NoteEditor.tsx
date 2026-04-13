import { useState, useCallback, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {
  Pin,
  Star,
  Trash2,
  Tag,
  X,
  Eye,
  Edit3,
  Calendar,
  FolderOpen,
  Palette,
  Plus,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { useSelectedNote } from '../../hooks/useNotes';
import {
  updateNote,
  deleteNote,
  togglePin,
  toggleFavorite,
  addTag,
  removeTag,
  setNoteColor,
  setEditing,
} from '../../features/notes/notesSlice';
import type { NoteColor } from '../../types';

const COLORS: { value: NoteColor; hex: string; label: string }[] = [
  { value: 'default', hex: '#374151', label: 'Default' },
  { value: 'red', hex: '#ff4d4d', label: 'Red' },
  { value: 'orange', hex: '#ff9f43', label: 'Orange' },
  { value: 'yellow', hex: '#ffd043', label: 'Yellow' },
  { value: 'green', hex: '#4ade80', label: 'Green' },
  { value: 'blue', hex: '#60a5fa', label: 'Blue' },
  { value: 'purple', hex: '#c084fc', label: 'Purple' },
  { value: 'pink', hex: '#f472b6', label: 'Pink' },
];

export default function NoteEditor() {
  const dispatch = useAppDispatch();
  const note = useSelectedNote();
  const { categories } = useAppSelector((s) => s.notes);
  const [tagInput, setTagInput] = useState('');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const tagInputRef = useRef<HTMLInputElement>(null);

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!note) return;
      dispatch(updateNote({ id: note.id, title: e.target.value }));
    },
    [note, dispatch],
  );

  const handleContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (!note) return;
      dispatch(updateNote({ id: note.id, content: e.target.value }));
    },
    [note, dispatch],
  );

  const handleCategoryChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!note) return;
      dispatch(updateNote({ id: note.id, category: e.target.value }));
    },
    [note, dispatch],
  );

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase().replace(/\s+/g, '-');
    if (note && tag && !note.tags.includes(tag)) {
      dispatch(addTag({ id: note.id, tag }));
      setTagInput('');
    }
  };

  if (!note) {
    return (
      <div className="editor-empty">
        <div className="editor-empty-content">
          <div className="editor-empty-icon">✏️</div>
          <h2>Select a note to edit</h2>
          <p>Choose a note from the list or create a new one</p>
        </div>
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(note.updatedAt));

  return (
    <div className="editor-panel">
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left">
          <button
            className={`tool-btn ${note.isPinned ? 'active' : ''}`}
            onClick={() => dispatch(togglePin(note.id))}
            title={note.isPinned ? 'Unpin' : 'Pin'}
          >
            <Pin size={15} />
          </button>
          <button
            className={`tool-btn ${note.isFavorite ? 'active-star' : ''}`}
            onClick={() => dispatch(toggleFavorite(note.id))}
            title={note.isFavorite ? 'Unfavorite' : 'Favorite'}
          >
            <Star size={15} />
          </button>
          <div className="color-picker-wrap">
            <button
              className="tool-btn"
              onClick={() => setShowColorPicker(!showColorPicker)}
              title="Color"
            >
              <Palette size={15} />
            </button>
            {showColorPicker && (
              <div className="color-picker-dropdown">
                {COLORS.map((c) => (
                  <button
                    key={c.value}
                    className={`color-dot ${note.color === c.value ? 'selected' : ''}`}
                    style={{ background: c.hex }}
                    title={c.label}
                    onClick={() => {
                      dispatch(setNoteColor({ id: note.id, color: c.value }));
                      setShowColorPicker(false);
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="toolbar-right">
          <button
            className={`tool-btn ${previewMode ? 'active' : ''}`}
            onClick={() => setPreviewMode(!previewMode)}
            title={previewMode ? 'Edit mode' : 'Preview mode'}
          >
            {previewMode ? <Edit3 size={15} /> : <Eye size={15} />}
            <span className="tool-label">
              {previewMode ? 'Edit' : 'Preview'}
            </span>
          </button>
          <button
            className="tool-btn danger"
            onClick={() => dispatch(deleteNote(note.id))}
            title="Delete"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* Title */}
      <div className="editor-title-wrap">
        <input
          className="editor-title"
          value={note.title}
          onChange={handleTitleChange}
          onFocus={() => dispatch(setEditing(true))}
          placeholder="Note title..."
        />
      </div>

      {/* Meta row */}
      <div className="editor-meta">
        <div className="meta-item">
          <Calendar size={12} />
          <span>{formattedDate}</span>
        </div>
        <div className="meta-item">
          <FolderOpen size={12} />
          <select
            className="meta-select"
            value={note.category}
            onChange={handleCategoryChange}
          >
            <option value="">No category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tags */}
      <div className="editor-tags">
        {note.tags.map((tag) => (
          <span key={tag} className="editor-tag">
            <Tag size={10} /> {tag}
            <button onClick={() => dispatch(removeTag({ id: note.id, tag }))}>
              <X size={10} />
            </button>
          </span>
        ))}
        <div className="tag-input-wrap">
          <input
            ref={tagInputRef}
            className="tag-input"
            placeholder="Add tag..."
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                handleAddTag();
              }
            }}
          />
          {tagInput && (
            <button className="tag-add-btn" onClick={handleAddTag}>
              <Plus size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="editor-content-wrap">
        {previewMode ? (
          <div className="markdown-preview">
            {note.content ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {note.content}
              </ReactMarkdown>
            ) : (
              <p className="preview-empty">Nothing to preview yet...</p>
            )}
          </div>
        ) : (
          <textarea
            className="editor-textarea"
            value={note.content}
            onChange={handleContentChange}
            onFocus={() => dispatch(setEditing(true))}
            placeholder={`Start writing...\n\nMarkdown is supported:\n# Heading\n**bold** *italic*\n- list item\n\`code\``}
            spellCheck
          />
        )}
      </div>

      {/* Word count */}
      <div className="editor-footer">
        <span>{note.content.split(/\s+/).filter(Boolean).length} words</span>
        <span>{note.content.length} chars</span>
      </div>
    </div>
  );
}
