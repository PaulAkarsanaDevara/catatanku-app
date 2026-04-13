import React from 'react';
import '../styles/skeleton.css';

/* Shared helper */
function S({
  w,
  h,
  className = '',
  style,
}: {
  w: string | number;
  h: string | number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`skel ${className}`}
      style={{
        ...style,
        width: typeof w === 'number' ? `${w}px` : w,
        height: typeof h === 'number' ? `${h}px` : h,
      }}
    />
  );
}

export function SidebarSkeleton() {
  return (
    <div className="skel-sidebar">
      <div className="skel-sidebar-logo">
        <S w={30} h={30} className="skel-circle" />
        <S w={70} h={16} />
      </div>
      <S w="100%" h={34} />
      <S w="100%" h={34} />
      <div className="skel-sidebar-nav">
        {[100, 80, 85, 70].map((w, i) => (
          <S key={i} w={`${w}%`} h={28} />
        ))}
      </div>
      <div className="skel-sidebar-section">
        <S w="50%" h={14} />
        {[95, 85, 90, 80, 88].map((w, i) => (
          <S key={i} w={`${w}%`} h={28} />
        ))}
      </div>
      <div className="skel-sidebar-section">
        <S w="40%" h={14} />
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: 4, paddingLeft: 8 }}
        >
          {[60, 50, 70, 45, 55].map((w, i) => (
            <S key={i} w={w} h={22} className="skel-circle" />
          ))}
        </div>
      </div>
    </div>
  );
}

export function NoteListSkeleton() {
  return (
    <div className="skel-notelist">
      <div className="skel-notelist-header">
        <S w={90} h={16} />
        <S w={50} h={12} />
      </div>
      <div className="skel-notelist-grid">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="skel-note-card"
            style={{ opacity: 1 - i * 0.1 }}
          >
            <S w="85%" h={13} />
            <S w="65%" h={13} />
            <S w="100%" h={10} />
            <S w="80%" h={10} />
            <S w="50%" h={10} />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginTop: 4,
              }}
            >
              <S w={60} h={10} />
              <S w={50} h={10} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NoteEditorSkeleton() {
  return (
    <div className="skel-editor">
      <div className="skel-editor-toolbar">
        {[28, 28, 28, 28].map((s, i) => (
          <S key={i} w={s} h={s} />
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          {[80, 70, 28].map((w, i) => (
            <S key={i} w={w} h={28} />
          ))}
        </div>
      </div>
      <div className="skel-editor-body">
        <S w="70%" h={32} />
        <div style={{ display: 'flex', gap: 16 }}>
          <S w={140} h={14} />
          <S w={110} h={14} />
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
          {[60, 70, 55].map((w, i) => (
            <S key={i} w={w} h={22} />
          ))}
        </div>
        <div
          style={{
            marginTop: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {[100, 85, 92, 78, 88, 95, 60, 82, 70, 90].map((w, i) => (
            <S key={i} w={`${w}%`} h={14} style={{ opacity: 1 - i * 0.07 }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OnboardingSkeleton() {
  return (
    <div className="skel-onboarding">
      <div className="skel-onboarding-card">
        <S w={80} h={80} className="skel-circle" />
        <S w="65%" h={32} />
        <S w="80%" h={14} />
        <S w="70%" h={14} />
        <S w={160} h={44} style={{ marginTop: 8, borderRadius: 12 }} />
      </div>
    </div>
  );
}

export function TranslatePanelSkeleton() {
  return (
    <div className="skel-translate">
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <S w={120} h={16} />
        <S w={24} h={24} />
      </div>
      <div style={{ display: 'flex', gap: 4 }}>
        {[1, 1, 1].map((_, i) => (
          <S key={i} w="33%" h={28} />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <S w="45%" h={34} />
        <S w={16} h={16} />
        <S w="45%" h={34} />
      </div>
      <S w="100%" h={36} />
    </div>
  );
}
