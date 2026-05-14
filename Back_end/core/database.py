import psycopg2
from psycopg2 import sql, OperationalError
from fastapi import HTTPException

# Global connection state
active_conn = None
active_db_config = None

def get_connection(params: dict):
    """Establish a psycopg2 database connection."""
    try:
        conn = psycopg2.connect(**params)
        return conn
    except OperationalError as e:
        raise HTTPException(status_code=400, detail=str(e))

def fetch_databases(host: str, port: int, user: str, password: str):
    """Fetch all available databases."""
    conn_params = {
        "host": host,
        "port": port,
        "user": user,
        "password": password,
        "database": "postgres"
    }
    conn = get_connection(conn_params)
    cur = conn.cursor()
    cur.execute("SELECT datname FROM pg_database WHERE datistemplate = false;")
    databases = [row[0] for row in cur.fetchall()]
    cur.close()
    conn.close()
    return databases

def fetch_tables(conn, schema: str = "public"):
    """Fetch all tables from a specified schema."""
    cur = conn.cursor()
    cur.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = %s AND table_type = 'BASE TABLE'
        ORDER BY table_name;
    """, (schema,))
    tables = [row[0] for row in cur.fetchall()]
    cur.close()
    return tables

def fetch_table_data(conn, schema: str, table: str, limit: int = 100):
    """Fetch rows and column information from a table."""
    cur = conn.cursor()
    
    # Fetch rows
    cur.execute(sql.SQL("SELECT * FROM {}.{} LIMIT %s").format(
        sql.Identifier(schema), sql.Identifier(table)
    ), (limit,))
    rows = cur.fetchall()
    col_names = [desc[0] for desc in cur.description]
    data = [dict(zip(col_names, row)) for row in rows]
    
    # Fetch column info
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
    return {"data": data, "columns": column_info}

def set_active_connection(conn):
    """Set the active database connection."""
    global active_conn, active_db_config
    active_conn = conn

def get_active_connection():
    """Get the current active database connection."""
    global active_conn
    return active_conn

def close_active_connection():
    """Close the active database connection."""
    global active_conn
    if active_conn and not active_conn.closed:
        active_conn.close()
        return True
    return False

def set_db_config(config: dict):
    """Store database configuration."""
    global active_db_config
    active_db_config = config

def is_connection_active():
    """Check if there's an active connection."""
    global active_conn
    return active_conn and not active_conn.closed
