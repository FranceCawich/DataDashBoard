export const API_BASE = 'http://localhost:8000/api';
export const CHART_COLORS = ['#2563EB', '#0891B2', '#7C3AED', '#059669', '#D97706', '#DC2626'];

export function parseCSV(text) {
  const lines = text.trim().split(/\r?\n/);
  const columns = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const data = lines.slice(1).filter(l => l.trim()).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
    const row = {}; columns.forEach((c, i) => { row[c] = vals[i] ?? ''; }); return row;
  });
  return { columns, data };
}

export function toChartData(data, x, y) {
  return data.map(r => ({ name: String(r[x] ?? ''), value: parseFloat(r[y]) })).filter(d => !isNaN(d.value));
}
