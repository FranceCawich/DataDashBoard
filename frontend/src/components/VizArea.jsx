import { useTheme } from '../theme/ThemeContext';
import { SectionLabel } from './UI/SectionLabel';
import { ChartConfig } from './Charts/ChartConfig';
import { ChartRenderer } from './Charts/ChartRenderer';
import { DataPreview } from './DataPreview';
import { toChartData } from '../utils/helpers';

export function VizArea({ data, columns, x, y, type, setX, setY, setType }) {
  const t = useTheme();
  if (!data.length) return null;

  return (
    <div style={{ marginTop: 32 }}>
      <SectionLabel>Visualization</SectionLabel>
      <div style={{ border: `1px solid ${t.border}`, borderRadius: 4, overflow: 'hidden' }}>
        <ChartConfig columns={columns} x={x} y={y} type={type} onX={setX} onY={setY} onType={setType} />
        <div style={{ padding: '24px 20px', background: t.surface }}>
          <ChartRenderer data={toChartData(data, x, y)} type={type} />
        </div>
      </div>
      <DataPreview data={data} columns={columns} />
    </div>
  );
}
