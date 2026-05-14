import { useState } from 'react';
import { ErrorBanner } from '../UI/ErrorBanner';
import { UploadZone } from '../UploadZone';
import { VizArea } from '../VizArea';
import { parseCSV } from '../../utils/helpers';

export function CSVPanel() {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [type, setType] = useState('bar');
  const [error, setError] = useState('');

  const onFiles = (files) => {
    setError('');
    const r = new FileReader();
    r.onload = e => {
      try {
        const { columns: cols, data: d } = parseCSV(e.target.result);
        setColumns(cols);
        setData(d);
        setX(cols[0] ?? '');
        setY(cols[1] ?? '');
      } catch (err) {
        setError('Parse error: ' + err.message);
      }
    };
    r.readAsText(files[0]);
  };

  return (
    <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
      <ErrorBanner msg={error} />
      <UploadZone accept=".csv" multiple label="Drop .csv files or click to browse" onFiles={onFiles} />
      <VizArea data={data} columns={columns} x={x} y={y} type={type} setX={setX} setY={setY} setType={setType} />
    </div>
  );
}
