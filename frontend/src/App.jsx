import { useState } from 'react';
import { ThemeCtx, makeTokens } from './theme/ThemeContext';
import { NavTab } from './components/UI/NavTab';
import { DBPanel } from './components/Panels/DBPanel';
import { JSONPanel } from './components/Panels/JSONPanel';
import { CSVPanel } from './components/Panels/CSVPanel';

export default function App() {
  const [isDark, setIsDark] = useState(false);
  const [source, setSource] = useState('db');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const t = makeTokens(isDark);

  const sources = [
    { id: 'db', icon: '⬡', label: 'DATABASE', desc: 'MySQL, PostgreSQL, SQLite' },
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
          padding: '0 16px',
          height: 52,
          borderBottom: `1px solid ${t.border}`,
          background: t.surface,
          flexShrink: 0,
        }}>
          {/* Sidebar toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{
              padding: '6px 10px',
              background: 'transparent',
              border: `1px solid ${t.border}`,
              borderRadius: 4,
              color: t.textMuted,
              cursor: 'pointer',
              fontSize: 14,
              fontFamily: "'DM Mono', monospace",
              letterSpacing: '0.06em',
              transition: 'all .15s',
            }}
          >{sidebarOpen ? '«' : '»'}</button>

          {/* Wordmark */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, marginLeft: 24 }}>
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
            }}>v1</div>
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

        {/* ── Main layout with sidebar ── */}
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          {/* Sidebar */}
          {sidebarOpen && (
            <div style={{
              width: 200,
              borderRight: `1px solid ${t.border}`,
              background: t.sidebar,
              padding: '24px 0',
              overflowY: 'auto',
              flexShrink: 0,
              transition: 'all .3s',
            }}>
              <div style={{ padding: '0 16px', marginBottom: 24 }}>
                <div style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: t.textMuted,
                  fontFamily: "'DM Mono', monospace",
                }}>Sources</div>
              </div>
              {sources.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSource(s.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    width: '100%',
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontSize: 13,
                    fontFamily: "'DM Sans', sans-serif",
                    cursor: 'pointer',
                    border: 'none',
                    borderLeft: source === s.id ? `3px solid ${t.blue}` : '3px solid transparent',
                    background: source === s.id ? t.blueBg : 'transparent',
                    color: source === s.id ? t.blue : t.textMuted,
                    transition: 'all .15s',
                    fontWeight: source === s.id ? 600 : 400,
                  }}
                >
                  <div style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</div>
                  <div>{s.label}</div>
                </button>
              ))}
            </div>
          )}

          {/* Main content */}
          <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
            {source === 'db' && <DBPanel />}
            {source === 'json' && <JSONPanel />}
            {source === 'csv' && <CSVPanel />}
          </div>
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}