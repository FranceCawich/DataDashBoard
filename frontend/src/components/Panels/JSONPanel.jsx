import { useState } from 'react';
import { useTheme } from '../../theme/ThemeContext';
import { ErrorBanner } from '../UI/ErrorBanner';
import { SectionLabel } from '../UI/SectionLabel';
import { BtnPrimary } from '../UI/BtnPrimary';
import { UploadZone } from '../UploadZone';
import { VizArea } from '../VizArea';

export function JSONPanel() {
  const t = useTheme();
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [type, setType] = useState('bar');
  const [paste, setPaste] = useState('');
  const [error, setError] = useState('');

  const process = (text) => {
    setError('');
    try {
      const p = JSON.parse(text);
      const arr = Array.isArray(p) ? p : p.data ?? Object.values(p)[0];
      if (!Array.isArray(arr) || !arr.length) throw new Error('Expected a JSON array of objects');
      const cols = Object.keys(arr[0]);
      setColumns(cols);
      setData(arr);
      setX(cols[0] ?? '');
      setY(cols[1] ?? '');
    } catch (e) {
      setError('Parse error: ' + e.message);
    }
  };

  return (
    <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
      <ErrorBanner msg={error} />
      <SectionLabel>JSON Source</SectionLabel>
      <UploadZone
        accept=".json"
        multiple={false}
        label="Drop a .json file or click to browse"
        onFiles={files => {
          const r = new FileReader();
          r.onload = e => process(e.target.result);
          r.readAsText(files[0]);
        }}
      />
      <div style={{ textAlign: 'center', fontSize: 11, color: t.textMuted, margin: '16px 0', letterSpacing: '0.1em', textTransform: 'uppercase', fontFamily: "'DM Mono', monospace" }}>
        or paste raw JSON
      </div>
      <textarea
        value={paste}
        onChange={e => setPaste(e.target.value)}
        placeholder='[{"column1": "value", "column2": 123}, ...]'
        style={{
          width: '100%',
          height: 110,
          padding: '10px 14px',
          fontSize: 12,
          fontFamily: "'DM Mono', 'Fira Code', monospace",
          background: t.inputBg,
          border: `1px solid ${t.border}`,
          color: t.text,
          borderRadius: 4,
          resize: 'vertical',
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
      <div style={{ marginTop: 14 }}>
        <BtnPrimary onClick={() => paste && process(paste)}>Load & Explore</BtnPrimary>
      </div>
      <VizArea data={data} columns={columns} x={x} y={y} type={type} setX={setX} setY={setY} setType={setType} />
    </div>
  );
}
