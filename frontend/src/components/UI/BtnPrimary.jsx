import { useTheme } from '../../theme/ThemeContext';

export function BtnPrimary({ children, style, ...props }) {
  const t = useTheme();
  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        padding: '9px 20px',
        background: t.btnPrimary,
        color: '#fff',
        border: 'none',
        borderRadius: 4,
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.04em',
        cursor: 'pointer',
        fontFamily: "'DM Sans', 'Outfit', sans-serif",
        textTransform: 'uppercase',
        transition: 'background 0.15s',
        ...style,
      }}
      onMouseEnter={e => e.target.style.background = t.btnPrimaryHov}
      onMouseLeave={e => e.target.style.background = t.btnPrimary}
      {...props}
    >{children}</button>
  );
}
