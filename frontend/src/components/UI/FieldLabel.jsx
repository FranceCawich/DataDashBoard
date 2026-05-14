import { useTheme } from '../../theme/ThemeContext';

export function FieldLabel({ children }) {
  const t = useTheme();
  return (
    <div style={{
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: t.textMuted,
      marginBottom: 6,
      fontFamily: "'DM Mono', 'Fira Code', monospace",
    }}>{children}</div>
  );
}
