import { useTheme } from '../../theme/ThemeContext';

export function SectionLabel({ children }) {
  const t = useTheme();
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.14em',
      textTransform: 'uppercase',
      color: t.textMuted,
      marginBottom: 12,
      fontFamily: "'DM Mono', 'Fira Code', monospace",
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    }}>
      <span style={{ display: 'inline-block', width: 16, height: 1, background: t.textDim }} />
      {children}
      <span style={{ flex: 1, height: 1, background: t.border }} />
    </div>
  );
}
