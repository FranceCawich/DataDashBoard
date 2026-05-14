import { useTheme } from '../../theme/ThemeContext';

export function Select({ style, children, ...props }) {
  const t = useTheme();
  return (
    <select
      style={{
        width: '100%',
        padding: '8px 12px',
        fontSize: 13,
        background: t.inputBg,
        border: `1px solid ${t.border}`,
        color: t.text,
        borderRadius: 4,
        fontFamily: "'DM Mono', 'Fira Code', monospace",
        outline: 'none',
        cursor: 'pointer',
        boxSizing: 'border-box',
        ...style,
      }}
      {...props}
    >{children}</select>
  );
}
