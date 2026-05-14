from fastapi import APIRouter, HTTPException
from models import ConnectionParams, UseDatabaseParams, TableRequest
from database import (
    get_connection,
    fetch_databases,
    fetch_tables,
    fetch_table_data,
    set_active_connection,
    get_active_connection,
    close_active_connection,
    set_db_config,
    is_connection_active,
)

router = APIRouter(prefix="/v1", tags=["v1"])

@router.options("/{rest_of_path:path}")
async def options_handler():
    """Handle CORS preflight requests."""
    return {}

@router.post("/connect")
async def connect_and_get_databases(params: ConnectionParams):
    """Connect to PostgreSQL and retrieve all available databases."""
    close_active_connection()
    try:
        databases = fetch_databases(params.host, params.port, params.user, params.password)
        return {"success": True, "databases": databases}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/use-database")
async def use_database(params: UseDatabaseParams):
    """Connect to a specific database and retrieve tables."""
    close_active_connection()
    
    conn_params = {
        "host": params.host,
        "port": params.port,
        "user": params.user,
        "password": params.password,
        "database": params.database,
    }
    try:
        conn = get_connection(conn_params)
        tables = fetch_tables(conn)
        set_active_connection(conn)
        set_db_config(params.dict())
        return {"success": True, "tables": tables}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/table-data")
async def get_table_data(request: TableRequest):
    """Retrieve data and column information from a table."""
    if not is_connection_active():
        raise HTTPException(status_code=400, detail="No active connection. Please select a database again.")
    
    try:
        conn = get_active_connection()
        result = fetch_table_data(conn, request.schema, request.table)
        return {"success": True, **result}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/disconnect")
async def disconnect():
    """Close the active database connection."""
    success = close_active_connection()
    return {"success": success}
