import { useTheme } from '../../theme/ThemeContext';

export function BtnSecondary({ children, style, ...props }) {
  const t = useTheme();
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '9px 20px',
        background: 'transparent',
        color: t.textMuted,
        border: `1px solid ${t.border}`,
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        fontFamily: "'DM Sans', 'Outfit', sans-serif",
        textTransform: 'uppercase',
        transition: 'all 0.15s',
        ...style,
      }}
      {...props}
    >{children}</button>
  );
}
