import { useTheme } from '../theme/ThemeContext';
import { SectionLabel } from './UI/SectionLabel';

export function DataPreview({ data, columns }) {
  const t = useTheme();
  if (!data.length) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <SectionLabel>Data Preview — {data.length.toLocaleString()} rows</SectionLabel>
      <div style={{ overflowX: 'auto', border: `1px solid ${t.border}`, borderRadius: 4 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
          <thead>
            <tr>{columns.map(c => (
              <th key={c} style={{
                padding: '10px 14px',
                background: t.surfaceAlt,
                color: t.textMuted,
                textAlign: 'left',
                borderBottom: `1px solid ${t.border}`,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                fontSize: 10,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontFamily: "'DM Mono', monospace",
              }}>{c}</th>
            ))}</tr>
          </thead>
          <tbody>
            {data.slice(0, 10).map((row, i) => (
              <tr key={i} style={{ background: i % 2 === 0 ? t.surface : t.surfaceAlt }}>
                {columns.map(c => (
                  <td key={c} style={{
                    padding: '8px 14px',
                    borderBottom: `1px solid ${t.border}`,
                    color: t.text,
                    whiteSpace: 'nowrap',
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    fontSize: 12,
                    fontFamily: "'DM Mono', monospace",
                  }} title={String(row[c] ?? '')}>{String(row[c] ?? '')}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {data.length > 10 && (
        <div style={{ color: t.textMuted, fontSize: 11, marginTop: 8, fontFamily: "'DM Mono', monospace", letterSpacing: '0.06em' }}>
          + {(data.length - 10).toLocaleString()} additional rows not shown
        </div>
      )}
    </div>
  );
}
