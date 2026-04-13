import { useEffect, useState } from 'react';
import { useAppSelector } from './../hooks/redux';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../features/notes/NoteEditor';
import NoteList from '../features/notes/NoteList';
import { storage } from '../utils/storage';
import Onboarding from '../components/Onboarding';
import '../styles/App.css';
import '../styles/onboarding.css';

export default function App() {
  const theme = useAppSelector((s) => s.notes.theme);
  const [showOnboarding, setShowOnboarding] = useState(
    !storage.isOnboardingDone(),
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <>
      {showOnboarding && (
        <Onboarding onComplete={() => setShowOnboarding(false)} />
      )}
      <div
        className="app-layout"
        style={{ visibility: showOnboarding ? 'hidden' : 'visible' }}
      >
        <Sidebar />
        <NoteList />
        <NoteEditor />
      </div>
    </>
  );
}
