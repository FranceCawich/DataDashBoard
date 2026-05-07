// src/App.js
import { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8000/api';

function App() {
  // Step 1: connection form
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(3306);
  const [user, setUser] = useState('root');
  const [password, setPassword] = useState('');
  const [schemas, setSchemas] = useState([]);
  const [selectedSchema, setSelectedSchema] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState('');
  const [tableData, setTableData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1: Connect & fetch schemas
  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/connect`, { host, port, user, password });
      setSchemas(res.data.databases);
    } catch (err) {
      setError(err.response?.data?.detail || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Select schema -> fetch tables
  const handleUseDatabase = async () => {
    if (!selectedSchema) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/use-database`, { host, port, user, password, database: selectedSchema });
      setTables(res.data.tables);
      setSelectedTable('');
      setTableData(null);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Select table -> load data & columns
  const handleLoadTable = async () => {
    if (!selectedTable) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/table-data`, { table: selectedTable });
      setTableData(res.data.data);
      setColumns(res.data.columns.map(col => col.Field));
      // Auto-select first two columns as X and Y if available
      if (res.data.columns.length >= 2) {
        setXColumn(res.data.columns[0].Field);
        setYColumn(res.data.columns[1].Field);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load table data');
    } finally {
      setLoading(false);
    }
  };

  // Prepare data for chart
  const getChartData = () => {
    if (!tableData || !xColumn || !yColumn) return [];
    return tableData.map(row => ({
      name: String(row[xColumn]),
      value: parseFloat(row[yColumn])
    })).filter(item => !isNaN(item.value));
  };

  const chartData = getChartData();

  // Render chart based on type
  const renderChart = () => {
    if (chartData.length === 0) return <p>No numeric data for selected Y column.</p>;
    
    const commonProps = {
      data: chartData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
    };

    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'line':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="value" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        );
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={400}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={120} label>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>📊 Database Graph Explorer (React + FastAPI)</h1>

      {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

      {/* Step 1: Connection */}
      <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>1. Connect to Database</h3>
        <input placeholder="Host" value={host} onChange={e => setHost(e.target.value)} />&nbsp;
        <input placeholder="Port" type="number" value={port} onChange={e => setPort(Number(e.target.value))} />&nbsp;
        <input placeholder="User" value={user} onChange={e => setUser(e.target.value)} />&nbsp;
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />&nbsp;
        <button onClick={handleConnect} disabled={loading}>Connect & Load Schemas</button>
      </div>

      {/* Step 2: Schema selection */}
      {schemas.length > 0 && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>2. Select Database / Schema</h3>
          <select value={selectedSchema} onChange={e => setSelectedSchema(e.target.value)}>
            <option value="">-- Choose a schema --</option>
            {schemas.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={handleUseDatabase} disabled={!selectedSchema || loading}>Use This Database</button>
        </div>
      )}

      {/* Step 3: Table selection */}
      {tables.length > 0 && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>3. Select Table</h3>
          <select value={selectedTable} onChange={e => setSelectedTable(e.target.value)}>
            <option value="">-- Choose a table --</option>
            {tables.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <button onClick={handleLoadTable} disabled={!selectedTable || loading}>Load Table Data</button>
        </div>
      )}

      {/* Step 4: Chart configuration */}
      {tableData && (
        <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>4. Build Chart</h3>
          <label>X-axis (labels): </label>
          <select value={xColumn} onChange={e => setXColumn(e.target.value)}>
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>&nbsp;&nbsp;
          <label>Y-axis (numeric values): </label>
          <select value={yColumn} onChange={e => setYColumn(e.target.value)}>
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>&nbsp;&nbsp;
          <label>Chart type: </label>
          <select value={chartType} onChange={e => setChartType(e.target.value)}>
            <option value="bar">Bar</option>
            <option value="line">Line</option>
            <option value="pie">Pie</option>
          </select>
          <br /><br />
          <div>Preview (first 100 rows):</div>
          {renderChart()}
        </div>
      )}
    </div>
  );
}

export default App;