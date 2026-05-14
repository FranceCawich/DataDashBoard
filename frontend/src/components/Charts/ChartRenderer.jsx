import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { useTheme } from '../../theme/ThemeContext';
import { CHART_COLORS } from '../../utils/helpers';

export function ChartRenderer({ data, type }) {
  const t = useTheme();
  
  if (!data.length) return (
    <div style={{ padding: '40px', textAlign: 'center', color: t.textMuted, fontSize: 13, fontFamily: "'DM Mono', monospace" }}>
      No numeric data for the selected Y column
    </div>
  );

  const axis = { 
    tick: { fill: t.textMuted, fontSize: 11, fontFamily: "'DM Mono', monospace" }, 
    axisLine: { stroke: t.border }, 
    tickLine: false 
  };
  const tip = { contentStyle: { background: t.surface, border: `1px solid ${t.border}`, borderRadius: 4, color: t.text, fontSize: 12, fontFamily: "'DM Mono', monospace" } };
  const grid = { strokeDasharray: '2 4', stroke: t.border };
  const cm = { data, margin: { top: 20, right: 32, left: 0, bottom: 8 } };

  if (type === 'line') return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart {...cm}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="name" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tip} />
        <Line type="monotone" dataKey="value" stroke={CHART_COLORS[0]} strokeWidth={2} dot={{ fill: CHART_COLORS[0], r: 3, strokeWidth: 0 }} />
      </LineChart>
    </ResponsiveContainer>
  );

  if (type === 'pie') return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie 
          data={data} 
          dataKey="value" 
          nameKey="name" 
          cx="50%" 
          cy="50%" 
          outerRadius={110} 
          innerRadius={40}
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          labelLine={{ stroke: t.textMuted }}>
          {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
        </Pie>
        <Tooltip {...tip} />
      </PieChart>
    </ResponsiveContainer>
  );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart {...cm}>
        <CartesianGrid {...grid} />
        <XAxis dataKey="name" {...axis} />
        <YAxis {...axis} />
        <Tooltip {...tip} />
        <Bar dataKey="value" fill={CHART_COLORS[0]} radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
