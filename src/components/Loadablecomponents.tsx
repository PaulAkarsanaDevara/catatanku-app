import loadable from '@loadable/component';
import {
  SidebarSkeleton,
  NoteListSkeleton,
  NoteEditorSkeleton,
  OnboardingSkeleton,
} from './Skeleton';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const LoadableSidebar = loadable(
  () => delay(0).then(() => import('./Sidebar')),
  { fallback: <SidebarSkeleton /> },
);

export const LoadableNoteList = loadable(
  () => delay(0).then(() => import('../features/notes/NoteList')),
  { fallback: <NoteListSkeleton /> },
);

export const LoadableNoteEditor = loadable(
  () => delay(0).then(() => import('../features/notes/NoteEditor')),
  { fallback: <NoteEditorSkeleton /> },
);

export const LoadableOnboarding = loadable(
  () => delay(0).then(() => import('./Onboarding')),
  { fallback: <OnboardingSkeleton /> },
);
