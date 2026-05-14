import { useTheme } from '../../theme/ThemeContext';
import { FieldLabel } from '../UI/FieldLabel';
import { Select } from '../UI/Select';

export function ChartConfig({ columns, x, y, type, onX, onY, onType }) {
  const t = useTheme();
  return (
    <div style={{
      display: 'flex',
      gap: 16,
      flexWrap: 'wrap',
      alignItems: 'flex-end',
      padding: '16px 20px',
      background: t.surfaceAlt,
      borderBottom: `1px solid ${t.border}`,
      marginBottom: 0,
    }}>
      <div style={{ flex: '1 1 160px' }}>
        <FieldLabel>X Axis</FieldLabel>
        <Select value={x} onChange={e => onX(e.target.value)}>
          {columns.map(c => <option key={c}>{c}</option>)}
        </Select>
      </div>
      <div style={{ flex: '1 1 160px' }}>
        <FieldLabel>Y Axis — Numeric</FieldLabel>
        <Select value={y} onChange={e => onY(e.target.value)}>
          {columns.map(c => <option key={c}>{c}</option>)}
        </Select>
      </div>
      <div style={{ flex: '0 0 150px' }}>
        <FieldLabel>Visualization</FieldLabel>
        <Select value={type} onChange={e => onType(e.target.value)}>
          <option value="bar">Bar Chart</option>
          <option value="line">Line Chart</option>
          <option value="pie">Pie Chart</option>
        </Select>
      </div>
    </div>
  );
}
