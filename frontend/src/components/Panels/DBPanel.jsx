import { useState } from 'react';
import axios from 'axios';
import { useTheme } from '../../theme/ThemeContext';
import { API_BASE } from '../../utils/helpers';
import { ErrorBanner } from '../UI/ErrorBanner';
import { SectionLabel } from '../UI/SectionLabel';
import { FieldLabel } from '../UI/FieldLabel';
import { Input } from '../UI/Input';
import { Select } from '../UI/Select';
import { BtnPrimary } from '../UI/BtnPrimary';
import { BtnSecondary } from '../UI/BtnSecondary';
import { VizArea } from '../VizArea';

export function DBPanel() {
  const t = useTheme();
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState('3306');
  const [engine, setEngine] = useState('MySQL');
  const [user, setUser] = useState('root');
  const [password, setPassword] = useState('');
  const [dbName, setDbName] = useState('');
  const [loadSchemas, setLoadSchemas] = useState(true);
  const [ssl, setSsl] = useState(false);
  const [readonly, setReadonly] = useState(false);
  const [databases, setDatabases] = useState([]);
  const [tables, setTables] = useState([]);
  const [selectedDB, setSelectedDB] = useState('');
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [type, setType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const connect = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/connect`, { host, port: +port, user, password });
      setDatabases(res.data.databases || []);
    } catch (e) {
      setError(e.response?.data?.detail || 'Connection failed');
    }
    finally {
      setLoading(false);
    }
  };

  const useDB = async () => {
    if (!selectedDB) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/use-database`, { host, port: +port, user, password, database: selectedDB });
      setTables(res.data.tables || []);
      setSelectedTable(null);
      setTableData(null);
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load tables');
    }
    finally {
      setLoading(false);
    }
  };

  const loadTable = async (name) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/table-data`, { table: name });
      const cols = (res.data.columns || []).map(c => c.Field);
      setTableData(res.data.data || []);
      setSelectedTable(name);
      setColumns(cols);
      setX(cols[0] ?? '');
      setY(cols[1] ?? '');
    } catch (e) {
      setError(e.response?.data?.detail || 'Failed to load table');
    }
    finally {
      setLoading(false);
    }
  };

  const chk = { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: t.textMuted, cursor: 'pointer', userSelect: 'none', fontFamily: "'DM Sans', sans-serif" };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
      {/* Table sidebar */}
      {tables.length > 0 && (
        <div style={{
          width: 240,
          borderRight: `1px solid ${t.border}`,
          padding: '24px 0',
          overflowY: 'auto',
          flexShrink: 0,
          background: t.sidebar,
        }}>
          <div style={{ padding: '0 20px', marginBottom: 16 }}>
            <SectionLabel>Tables · {selectedDB}</SectionLabel>
          </div>
          {tables.map(tbl => (
            <button
              key={tbl}
              onClick={() => loadTable(tbl)}
              style={{
                display: 'block',
                width: '100%',
                textAlign: 'left',
                padding: '9px 20px',
                fontSize: 12,
                fontFamily: "'DM Mono', monospace",
                cursor: 'pointer',
                border: 'none',
                borderLeft: selectedTable === tbl ? `2px solid ${t.blue}` : '2px solid transparent',
                background: selectedTable === tbl ? t.blueBg : 'transparent',
                color: selectedTable === tbl ? t.blue : t.textMuted,
                transition: 'all .1s',
              }}
            >
              {tbl}
            </button>
          ))}
        </div>
      )}

      {/* Main content */}
      <div style={{ flex: 1, padding: '32px 40px', overflowY: 'auto' }}>
        <ErrorBanner msg={error} />

        {/* Connection fields */}
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Connection</SectionLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 120px 180px', gap: 12, marginBottom: 16 }}>
            <div>
              <FieldLabel>Host</FieldLabel>
              <Input value={host} onChange={e => setHost(e.target.value)} placeholder="localhost" />
            </div>
            <div>
              <FieldLabel>Port</FieldLabel>
              <Input value={port} onChange={e => setPort(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Engine</FieldLabel>
              <Select value={engine} onChange={e => setEngine(e.target.value)}>
                <option>MySQL</option>
                <option>PostgreSQL</option>
                <option>SQLite</option>
              </Select>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 20 }}>
            <div>
              <FieldLabel>Username</FieldLabel>
              <Input value={user} onChange={e => setUser(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Password</FieldLabel>
              <Input type="password" value={password} placeholder="••••••••" onChange={e => setPassword(e.target.value)} />
            </div>
            <div>
              <FieldLabel>Database</FieldLabel>
              <Input value={dbName} placeholder="my_database" onChange={e => setDbName(e.target.value)} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: 24, marginBottom: 20, flexWrap: 'wrap' }}>
            <label style={chk}>
              <input type="checkbox" checked={loadSchemas} onChange={e => setLoadSchemas(e.target.checked)} style={{ accentColor: t.blue, width: 13, height: 13 }} />
              Load all schemas
            </label>
            <label style={chk}>
              <input type="checkbox" checked={ssl} onChange={e => setSsl(e.target.checked)} style={{ accentColor: t.blue, width: 13, height: 13 }} />
              SSL / TLS
            </label>
            <label style={chk}>
              <input type="checkbox" checked={readonly} onChange={e => setReadonly(e.target.checked)} style={{ accentColor: t.blue, width: 13, height: 13 }} />
              Read-only mode
            </label>
          </div>

          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <BtnPrimary onClick={connect} disabled={loading}>
              {loading ? 'Connecting…' : 'Connect & Load Schemas'}
            </BtnPrimary>
            <BtnSecondary>Test Connection</BtnSecondary>
            {databases.length > 0 && (
              <>
                <div style={{ width: 1, height: 28, background: t.border, margin: '0 4px' }} />
                <Select style={{ maxWidth: 240 }} value={selectedDB} onChange={e => setSelectedDB(e.target.value)}>
                  <option value="">— Select database —</option>
                  {databases.map(db => <option key={db}>{db}</option>)}
                </Select>
                <BtnPrimary onClick={useDB} disabled={!selectedDB || loading}>
                  Use DB
                </BtnPrimary>
              </>
            )}
          </div>
        </div>

        {selectedTable && tableData && (
          <VizArea data={tableData} columns={columns} x={x} y={y} type={type} setX={setX} setY={setY} setType={setType} />
        )}
      </div>
    </div>
  );
}
