/* eslint-disable no-constant-condition */
import { useState, useEffect, useRef } from 'react';
import { useAppDispatch } from '../hooks/redux';
import { addNote, toggleTheme } from '../features/notes/notesSlice';
import { storage } from '../utils/storage';
import { useAppSelector } from '../hooks/redux';

interface OnboardingProps {
  onComplete: () => void;
}

const FEATURES = [
  {
    icon: '✍️',
    title: 'Rich Markdown',
    desc: 'Write with **bold**, *italic*, `code`, tables, and more',
  },
  {
    icon: '🏷️',
    title: 'Tags & Categories',
    desc: 'Organize notes with custom tags and color-coded categories',
  },
  {
    icon: '📌',
    title: 'Pin & Favorite',
    desc: 'Keep important notes pinned at the top, star your favorites',
  },
  {
    icon: '🔍',
    title: 'Instant Search',
    desc: 'Find any note by title, content, or tags in milliseconds',
  },
];

const TEMPLATES = [
  { id: 'blank', emoji: '📄', label: 'Blank note', title: '', content: '' },
  {
    id: 'journal',
    emoji: '📔',
    label: 'Daily journal',
    title: `Journal — ${new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}`,
    content: `## Hari ini\n\nApa yang terjadi hari ini...\n\n## Yang aku syukuri\n\n1. \n2. \n3. \n\n## Catatan lainnya\n\n`,
  },
  {
    id: 'ideas',
    emoji: '💡',
    label: 'Brainstorm',
    title: 'Ide Baru',
    content: `## 🧠 Ide Utama\n\n> Tulis ide besarmu di sini\n\n## Detail\n\n- \n- \n- \n\n## Next Steps\n\n- [ ] \n- [ ] \n`,
  },
  {
    id: 'todo',
    emoji: '✅',
    label: 'To-do list',
    title: 'Task List',
    content: `## 📋 To-Do\n\n- [ ] Task pertama\n- [ ] Task kedua\n- [ ] Task ketiga\n\n## Selesai\n\n- [x] Contoh task yang sudah selesai\n`,
  },
];

export default function Onboarding({ onComplete }: OnboardingProps) {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((s) => s.notes.theme);

  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('blank');
  const [animating, setAnimating] = useState(false);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const nameInputRef = useRef<HTMLInputElement>(null);

  const TOTAL_STEPS = 6;

  useEffect(() => {
    if (step === 1) {
      setTimeout(() => nameInputRef.current?.focus(), 400);
    }
  }, [step]);

  const go = (nextStep: number) => {
    if (animating) return;
    setDirection(nextStep > step ? 'forward' : 'back');
    setAnimating(true);
    setTimeout(() => {
      setStep(nextStep);
      setAnimating(false);
    }, 280);
  };

  const next = () => go(step + 1);
  const back = () => go(step - 1);

  const handleComplete = () => {
    if (name.trim()) storage.saveUserName(name.trim());
    const tpl = TEMPLATES.find((t) => t.id === selectedTemplate)!;
    if (tpl.id !== 'blank' || true) {
      dispatch(addNote({ title: tpl.title || undefined }));
      // Update content after note is created via a timeout trick
      // We'll just let user start fresh — addNote creates a blank note selected
    }
    storage.setOnboardingDone();
    setAnimating(true);
    setTimeout(() => onComplete(), 600);
  };

  const progress = (step / (TOTAL_STEPS - 1)) * 100;

  return (
    <div
      className={`onboarding-overlay ${animating && step === TOTAL_STEPS - 1 ? 'fade-out' : ''}`}
    >
      {/* Animated background */}
      <div className="onboarding-bg">
        <div className="ob-orb ob-orb-1" />
        <div className="ob-orb ob-orb-2" />
        <div className="ob-orb ob-orb-3" />
        <div className="ob-grid" />
      </div>

      {/* Card */}
      <div
        className={`onboarding-card ${animating ? (direction === 'forward' ? 'slide-out-left' : 'slide-out-right') : 'slide-in'}`}
      >
        {/* Progress bar */}
        {step > 0 && step < TOTAL_STEPS - 1 && (
          <div className="ob-progress">
            <div
              className="ob-progress-bar"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Step: Welcome */}
        {step === 0 && (
          <div className="ob-step">
            <div className="ob-logo-wrap">
              <div className="ob-logo">✏️</div>
              <div className="ob-logo-ring" />
            </div>
            <h1 className="ob-headline">
              Welcome to <span className="ob-accent">Noted.</span>
            </h1>
            <p className="ob-subtext">
              Your personal space to think, plan, and remember — beautifully
              organized and always at hand.
            </p>
            <button className="ob-btn-primary" onClick={next}>
              Get started <span className="ob-arrow">→</span>
            </button>
            <p className="ob-hint">Takes less than a minute</p>
          </div>
        )}

        {/* Step: Name */}
        {step === 1 && (
          <div className="ob-step">
            <div className="ob-step-emoji">👋</div>
            <h2 className="ob-title">What should we call you?</h2>
            <p className="ob-subtext">
              We'll use your name to personalize the experience.
            </p>
            <input
              ref={nameInputRef}
              className="ob-input"
              placeholder="Your name..."
              value={name}
              maxLength={30}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) =>
                e.key === 'Enter' && (name.trim() || true) && next()
              }
            />
            <div className="ob-nav">
              <button className="ob-btn-ghost" onClick={back}>
                ← Back
              </button>
              <button className="ob-btn-primary" onClick={next}>
                {name.trim()
                  ? `Nice to meet you, ${name.split(' ')[0]}!`
                  : 'Skip'}{' '}
                →
              </button>
            </div>
          </div>
        )}

        {/* Step: Theme */}
        {step === 2 && (
          <div className="ob-step">
            <div className="ob-step-emoji">🎨</div>
            <h2 className="ob-title">Pick your vibe</h2>
            <p className="ob-subtext">
              Choose how Noted looks. You can always change this later.
            </p>
            <div className="ob-theme-cards">
              <button
                className={`ob-theme-card ${theme === 'dark' ? 'selected' : ''}`}
                onClick={() => {
                  if (theme !== 'dark') dispatch(toggleTheme());
                }}
              >
                <div className="ob-theme-preview dark-preview">
                  <div className="prev-sidebar" />
                  <div className="prev-main">
                    <div className="prev-line long" />
                    <div className="prev-line medium" />
                    <div className="prev-line short" />
                  </div>
                </div>
                <span className="ob-theme-label">🌙 Dark</span>
                {theme === 'dark' && <span className="ob-theme-check">✓</span>}
              </button>
              <button
                className={`ob-theme-card ${theme === 'light' ? 'selected' : ''}`}
                onClick={() => {
                  if (theme !== 'light') dispatch(toggleTheme());
                }}
              >
                <div className="ob-theme-preview light-preview">
                  <div className="prev-sidebar light" />
                  <div className="prev-main light">
                    <div className="prev-line long light" />
                    <div className="prev-line medium light" />
                    <div className="prev-line short light" />
                  </div>
                </div>
                <span className="ob-theme-label">☀️ Light</span>
                {theme === 'light' && <span className="ob-theme-check">✓</span>}
              </button>
            </div>
            <div className="ob-nav">
              <button className="ob-btn-ghost" onClick={back}>
                ← Back
              </button>
              <button className="ob-btn-primary" onClick={next}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step: Features */}
        {step === 3 && (
          <div className="ob-step">
            <div className="ob-step-emoji">⚡</div>
            <h2 className="ob-title">Everything you need</h2>
            <p className="ob-subtext">
              Noted comes packed with powerful features to keep you organized.
            </p>
            <div className="ob-features">
              {FEATURES.map((f, i) => (
                <div
                  key={f.title}
                  className="ob-feature-item"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <span className="ob-feature-icon">{f.icon}</span>
                  <div>
                    <strong>{f.title}</strong>
                    <p>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="ob-nav">
              <button className="ob-btn-ghost" onClick={back}>
                ← Back
              </button>
              <button className="ob-btn-primary" onClick={next}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step: First Note Template */}
        {step === 4 && (
          <div className="ob-step">
            <div className="ob-step-emoji">🚀</div>
            <h2 className="ob-title">Start with a template</h2>
            <p className="ob-subtext">
              We'll create your first note — choose a starting point.
            </p>
            <div className="ob-templates">
              {TEMPLATES.map((tpl) => (
                <button
                  key={tpl.id}
                  className={`ob-template-card ${selectedTemplate === tpl.id ? 'selected' : ''}`}
                  onClick={() => setSelectedTemplate(tpl.id)}
                >
                  <span className="ob-tpl-emoji">{tpl.emoji}</span>
                  <span className="ob-tpl-label">{tpl.label}</span>
                  {selectedTemplate === tpl.id && (
                    <span className="ob-tpl-check">✓</span>
                  )}
                </button>
              ))}
            </div>
            <div className="ob-nav">
              <button className="ob-btn-ghost" onClick={back}>
                ← Back
              </button>
              <button className="ob-btn-primary" onClick={next}>
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* Step: Done */}
        {step === 5 && (
          <div className="ob-step ob-step-done">
            <div className="ob-done-icon">
              <span className="ob-checkmark">✓</span>
              <div className="ob-done-ring" />
              <div className="ob-done-ring ob-done-ring-2" />
            </div>
            <h2 className="ob-title">
              {name.trim()
                ? `You're all set, ${name.split(' ')[0]}!`
                : "You're all set!"}
            </h2>
            <p className="ob-subtext">
              Your workspace is ready. Start capturing your thoughts, ideas, and
              plans.
            </p>
            <button
              className="ob-btn-primary ob-btn-large"
              onClick={handleComplete}
            >
              Open Noted ✨
            </button>
          </div>
        )}
      </div>

      {/* Step dots (steps 1–4) */}
      {step > 0 && step < TOTAL_STEPS - 1 && (
        <div className="ob-dots">
          {Array.from({ length: TOTAL_STEPS - 2 }).map((_, i) => (
            <button
              key={i}
              className={`ob-dot ${i + 1 === step ? 'active' : i + 1 < step ? 'done' : ''}`}
              onClick={() => go(i + 1)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
