
# backend/main.py .
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from psycopg2 import sql, OperationalError

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global connection store (simplified, for single user)
active_conn = None
active_db_config = None

class ConnectionParams(BaseModel):
    host: str
    port: int = 5432          # default PostgreSQL port
    user: str
    password: str
    database: str = None

class UseDatabaseParams(BaseModel):
    host: str
    port: int
    user: str
    password: str
    database: str

class TableRequest(BaseModel):
    table: str
    schema: str = "public"    # default schema

def get_connection(params: dict):
    """Return a psycopg2 connection."""
    try:
        conn = psycopg2.connect(**params)
        return conn
    except OperationalError as e:
        raise HTTPException(status_code=400, detail=str(e))
        
@app.options("/api/{rest_of_path:path}")
async def options_handler():
    return {}   # FastAPI will automatically add CORS headers

@app.post("/api/connect")
async def connect_and_get_databases(params: ConnectionParams):
    """
    Step 1: Test connection and return all databases.
    """
    global active_conn, active_db_config
    if active_conn:
        active_conn.close()
    # Connect to default 'postgres' database to list all databases
    conn_params = {
        "host": params.host,
        "port": params.port,
        "user": params.user,
        "password": params.password,
        "database": "postgres"  # default maintenance DB
    }
    try:
        conn = get_connection(conn_params)
        cur = conn.cursor()
        cur.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
        databases = [row[0] for row in cur.fetchall()]
        cur.close()
        conn.close()
        return {"success": True, "databases": databases}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/use-database")
async def use_database(params: UseDatabaseParams):
    """
    Step 2: Connect to a specific database and return tables in the 'public' schema.
    """
    global active_conn, active_db_config
    if active_conn:
        active_conn.close()
    conn_params = {
        "host": params.host,
        "port": params.port,
        "user": params.user,
        "password": params.password,
        "database": params.database
    }
    try:
        active_conn = get_connection(conn_params)
        cur = active_conn.cursor()
        # List tables in the 'public' schema (adjust if needed)
        cur.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
            ORDER BY table_name;
        """)
        tables = [row[0] for row in cur.fetchall()]
        cur.close()
        active_db_config = params.dict()
        return {"success": True, "tables": tables}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/table-data")
async def get_table_data(request: TableRequest):
    """
    Step 3: Get first 100 rows and column info from the selected table.
    """
    global active_conn
    if not active_conn or active_conn.closed:
        raise HTTPException(status_code=400, detail="No active connection. Please select a database again.")
    
    table = request.table
    schema = request.schema
    try:
        cur = active_conn.cursor()
        # Fetch rows
        cur.execute(sql.SQL("SELECT * FROM {}.{} LIMIT 100").format(
            sql.Identifier(schema), sql.Identifier(table)
        ))
        rows = cur.fetchall()
        # Get column names
        col_names = [desc[0] for desc in cur.description]
        # Convert rows to list of dicts
        data = [dict(zip(col_names, row)) for row in rows]
        
        # Get column info (type, nullable, etc.)
        cur.execute("""
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns
            WHERE table_schema = %s AND table_name = %s
            ORDER BY ordinal_position;
        """, (schema, table))
        columns = cur.fetchall()
        column_info = [
            {"Field": col[0], "Type": col[1], "Null": col[2]}
            for col in columns
        ]
        cur.close()
        return {"success": True, "data": data, "columns": column_info}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/disconnect")
async def disconnect():
    global active_conn
    if active_conn and not active_conn.closed:
        active_conn.close()
    return {"success": True}
