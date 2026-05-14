import { useTheme } from '../../theme/ThemeContext';

export function NavTab({ id, label, desc, icon, active, onClick }) {
  const t = useTheme();
  return (
    <button onClick={onClick} style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '0 24px',
      height: '100%',
      background: 'none',
      border: 'none',
      borderBottom: active ? `2px solid ${t.blue}` : '2px solid transparent',
      color: active ? t.text : t.textMuted,
      cursor: 'pointer',
      fontFamily: "'DM Sans', 'Outfit', sans-serif",
      fontSize: 13,
      fontWeight: active ? 600 : 400,
      letterSpacing: '0.01em',
      transition: 'all .15s',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: 15, opacity: active ? 1 : 0.5 }}>{icon}</span>
      {label}
    </button>
  );
}
