import { useEffect } from 'react';
import { useAppSelector } from './../hooks/redux';
import Sidebar from '../components/Sidebar';
import NoteEditor from '../features/notes/NoteEditor';
import NoteList from '../features/notes/NoteList';
import '../styles/App.css';

export default function App() {
  const theme = useAppSelector((s) => s.notes.theme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="app-layout">
      <Sidebar />
      <NoteList />
      <NoteEditor />
    </div>
  );
}
