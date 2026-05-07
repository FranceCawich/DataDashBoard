// src/App.js
import { useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const API_BASE = 'http://localhost:8000/api';

function App() {
  // Connection state
  const [host, setHost] = useState('localhost');
  const [port, setPort] = useState(5432);
  const [user, setUser] = useState('postgres');
  const [password, setPassword] = useState('');
  const [databases, setDatabases] = useState([]);
  const [selectedDatabase, setSelectedDatabase] = useState('');
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState(null);
  const [columns, setColumns] = useState([]);
  const [xColumn, setXColumn] = useState('');
  const [yColumn, setYColumn] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeStep, setActiveStep] = useState('connect'); // connect, db, table

  // Step 1: Connect & get databases
  const handleConnect = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/connect`, { host, port, user, password });
      setDatabases(res.data.databases);
      setActiveStep('db');
    } catch (err) {
      setError(err.response?.data?.detail || 'Connection failed');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Select database -> fetch tables
  const handleUseDatabase = async () => {
    if (!selectedDatabase) return;
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/use-database`, { host, port, user, password, database: selectedDatabase });
      setTables(res.data.tables);
      setSelectedTable(null);
      setTableData(null);
      setActiveStep('table');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load tables');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Load a specific table
  const loadTable = async (tableName) => {
    setLoading(true);
    setError('');
    try {
      const res = await axios.post(`${API_BASE}/table-data`, { table: tableName });
      setTableData(res.data.data);
      setSelectedTable(tableName);
      const colNames = res.data.columns.map(col => col.Field);
      setColumns(colNames);
      if (colNames.length >= 2) {
        setXColumn(colNames[0]);
        setYColumn(colNames[1]);
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load table');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const getChartData = () => {
    if (!tableData || !xColumn || !yColumn) return [];
    return tableData.map(row => ({
      name: String(row[xColumn]),
      value: parseFloat(row[yColumn])
    })).filter(item => !isNaN(item.value));
  };

  const chartData = getChartData();

  const renderChart = () => {
    if (chartData.length === 0) return <p>No numeric data for selected Y column.</p>;
    const commonProps = { data: chartData, margin: { top: 20, right: 30, left: 20, bottom: 5 } };
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
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'Arial' }}>
      <h1 style={{ padding: '20px' }}>📊 Database Graph Explorer</h1>
      {error && <div style={{ color: 'red', padding: '0 20px' }}>{error}</div>}

      {/* Connection & Database Selection (top bar) */}
      <div style={{ padding: '0 20px', borderBottom: '1px solid #ccc', display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
        <input placeholder="Host" value={host} onChange={e => setHost(e.target.value)} />
        <input placeholder="Port" type="number" value={port} onChange={e => setPort(Number(e.target.value))} />
        <input placeholder="User" value={user} onChange={e => setUser(e.target.value)} />
        <input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button onClick={handleConnect} disabled={loading}>Connect & Load Schemas</button>

        {databases.length > 0 && (
          <>
            <select value={selectedDatabase} onChange={e => setSelectedDatabase(e.target.value)}>
              <option value="">-- Select database --</option>
              {databases.map(db => <option key={db} value={db}>{db}</option>)}
            </select>
            <button onClick={handleUseDatabase} disabled={!selectedDatabase || loading}>Use This Database</button>
          </>
        )}
      </div>

      {/* Main content: table panel + chart area */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left panel: tables list */}
        {tables.length > 0 && (
          <div style={{ width: '280px', borderRight: '1px solid #ccc', overflowY: 'auto', padding: '15px' }}>
            <h3>Tables in {selectedDatabase}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {tables.map(table => (
                <button
                  key={table}
                  onClick={() => loadTable(table)}
                  style={{
                    padding: '10px',
                    textAlign: 'left',
                    background: selectedTable === table ? '#007bff' : '#f5f5f5',
                    color: selectedTable === table ? 'white' : 'black',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  📋 {table}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Right panel: chart configuration & display */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
          {selectedTable && tableData ? (
            <>
              <h2>Table: {selectedTable}</h2>
              <div style={{ marginBottom: '20px' }}>
                <label>X‑axis (labels): </label>
                <select value={xColumn} onChange={e => setXColumn(e.target.value)}>
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>&nbsp;&nbsp;
                <label>Y‑axis (numeric): </label>
                <select value={yColumn} onChange={e => setYColumn(e.target.value)}>
                  {columns.map(col => <option key={col} value={col}>{col}</option>)}
                </select>&nbsp;&nbsp;
                <label>Chart type: </label>
                <select value={chartType} onChange={e => setChartType(e.target.value)}>
                  <option value="bar">Bar</option>
                  <option value="line">Line</option>
                  <option value="pie">Pie</option>
                </select>
              </div>
              <div>
                {renderChart()}
              </div>
            </>
          ) : (
            <p>{tables.length > 0 ? 'Select a table from the left panel' : 'Connect to a database and select a table'}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;