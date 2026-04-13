import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from './../hooks/redux';
import { storage } from '../utils/storage';
import '../styles/App.css';
import '../styles/onboarding.css';
import {
  LoadableNoteEditor,
  LoadableNoteList,
  LoadableOnboarding,
  LoadableSidebar,
} from '../components/Loadablecomponents';
import { Edit3, List, Menu, Plus, StickyNote, X } from 'lucide-react';
import {
  addNote,
  setMobilePanel,
  setSidebarOpen,
} from '../features/notes/notesSlice';

export default function App() {
  const dispatch = useAppDispatch();
  const { theme, mobilePanel, sidebarOpen } = useAppSelector((s) => s.notes);
  const [showOnboarding, setShowOnboarding] = useState(
    !storage.isOnboardingDone(),
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <>
      {showOnboarding && (
        <LoadableOnboarding onComplete={() => setShowOnboarding(false)} />
      )}

      <div
        className="app-layout"
        style={{ visibility: showOnboarding ? 'hidden' : 'visible' }}
      >
        {/* === DESKTOP: normal 3-col grid === */}
        <div className="desktop-layout">
          <LoadableSidebar />
          <LoadableNoteList />
          <LoadableNoteEditor />
        </div>

        {/* === MOBILE: single-panel with drawer === */}
        <div className="mobile-layout">
          {/* Sidebar drawer overlay */}
          {sidebarOpen && (
            <div
              className="mobile-drawer-overlay"
              onClick={() => dispatch(setSidebarOpen(false))}
            />
          )}

          {/* Sidebar drawer */}
          <div className={`mobile-drawer ${sidebarOpen ? 'open' : ''}`}>
            <button
              className="mobile-drawer-close"
              onClick={() => dispatch(setSidebarOpen(false))}
            >
              <X size={18} />
            </button>
            <LoadableSidebar />
          </div>

          {/* Mobile top bar */}
          <div className="mobile-topbar">
            <button
              className="mobile-topbar-btn"
              onClick={() => dispatch(setSidebarOpen(true))}
            >
              <Menu size={20} />
            </button>
            <div className="mobile-topbar-title">
              <StickyNote size={16} />
              <span>CATATANKU</span>
            </div>
            <button
              className="mobile-topbar-btn accent"
              onClick={() => dispatch(addNote({}))}
            >
              <Plus size={20} />
            </button>
          </div>

          {/* Panel content */}
          <div className="mobile-panels">
            <div
              className={`mobile-panel ${mobilePanel === 'list' ? 'active' : mobilePanel === 'editor' ? 'left' : 'right'}`}
            >
              <LoadableNoteList />
            </div>
            <div
              className={`mobile-panel ${mobilePanel === 'editor' ? 'active' : mobilePanel === 'list' ? 'right' : 'left'}`}
            >
              <LoadableNoteEditor />
            </div>
          </div>

          {/* Bottom nav */}
          <nav className="mobile-bottom-nav">
            <button
              className={`mobile-nav-btn ${mobilePanel === 'list' ? 'active' : ''}`}
              onClick={() => dispatch(setMobilePanel('list'))}
            >
              <List size={20} />
              <span>Notes</span>
            </button>
            <button
              className={`mobile-nav-btn ${mobilePanel === 'editor' ? 'active' : ''}`}
              onClick={() => dispatch(setMobilePanel('editor'))}
            >
              <Edit3 size={20} />
              <span>Editor</span>
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}
