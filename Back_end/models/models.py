from pydantic import BaseModel

class ConnectionParams(BaseModel):
    host: str
    port: int = 5432
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
    schema: str = "public"
