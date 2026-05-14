import { useState } from 'react';
import { ThemeCtx, makeTokens } from './theme/ThemeContext';
import { NavTab } from './components/UI/NavTab';
import { DBPanel } from './components/Panels/DBPanel';
import { JSONPanel } from './components/Panels/JSONPanel';
import { CSVPanel } from './components/Panels/CSVPanel';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [source, setSource] = useState('db');
  const t = makeTokens(isDark);

  const sources = [
    { id: 'db', icon: '⬡', label: 'Database', desc: 'MySQL, PostgreSQL, SQLite' },
    { id: 'json', icon: '{ }', label: 'JSON', desc: 'Upload or paste' },
    { id: 'csv', icon: '≡', label: 'CSV', desc: 'Delimited text files' },
  ];

  return (
    <ThemeCtx.Provider value={t}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        *, *::before, *::after { box-sizing: border-box; }
        html, body, #root { margin: 0; padding: 0; width: 100%; height: 100%; overflow: hidden; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${t.scrollbar}; border-radius: 3px; }
      `}</style>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        background: t.bg,
        color: t.text,
        fontFamily: "'DM Sans', 'Outfit', -apple-system, sans-serif",
        overflow: 'hidden',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>

        {/* ── Top bar ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          height: 52,
          borderBottom: `1px solid ${t.border}`,
          background: t.surface,
          flexShrink: 0,
        }}>
          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 28, height: 28,
              background: t.blue,
              borderRadius: 4,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, color: '#fff', fontWeight: 700,
              fontFamily: "'DM Mono', monospace",
            }}>G</div>
            <span style={{ fontSize: 14, fontWeight: 600, color: t.text, letterSpacing: '-0.01em' }}>DataViews</span>
            <div style={{
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: t.textMuted,
              background: t.surfaceAlt,
              border: `1px solid ${t.border}`,
              padding: '2px 7px',
              borderRadius: 3,
              fontFamily: "'DM Mono', monospace",
            }}>v2</div>
          </div>

          {/* Nav tabs */}
          <div style={{ display: 'flex', height: '100%', alignItems: 'stretch' }}>
            {sources.map(s => (
              <NavTab key={s.id} {...s} active={source === s.id} onClick={() => setSource(s.id)} />
            ))}
          </div>

          {/* Theme toggle */}
          <button
            onClick={() => setIsDark(v => !v)}
            style={{
              padding: '6px 14px',
              background: 'transparent',
              border: `1px solid ${t.border}`,
              borderRadius: 4,
              color: t.textMuted,
              cursor: 'pointer',
              fontSize: 11,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >{isDark ? '◑ Light' : '◐ Dark'}</button>
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {source === 'db' && <DBPanel />}
          {source === 'json' && <JSONPanel />}
          {source === 'csv' && <CSVPanel />}
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}