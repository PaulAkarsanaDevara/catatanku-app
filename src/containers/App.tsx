import { useEffect, useState } from 'react';
import { useAppSelector } from './../hooks/redux';
import { storage } from '../utils/storage';
import '../styles/App.css';
import '../styles/onboarding.css';
import {
  LoadableNoteEditor,
  LoadableNoteList,
  LoadableOnboarding,
  LoadableSidebar,
} from '../components/Loadablecomponents';

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
        <LoadableOnboarding onComplete={() => setShowOnboarding(false)} />
      )}
      <div
        className="app-layout"
        style={{ visibility: showOnboarding ? 'hidden' : 'visible' }}
      >
        <LoadableSidebar />
        <LoadableNoteList />
        <LoadableNoteEditor />
      </div>
    </>
  );
}
