import { useTheme } from '../../theme/ThemeContext';

export function Input({ style, ...props }) {
  const t = useTheme();
  return (
    <input
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
        transition: 'border-color 0.15s',
        boxSizing: 'border-box',
        ...style,
      }}
      onFocus={e => e.target.style.borderColor = t.borderActive}
      onBlur={e => e.target.style.borderColor = t.border}
      {...props}
    />
  );
}
