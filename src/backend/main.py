"""Main module."""
import sys
import pathlib
from typing import Any
from time import sleep

import socket
import threading
import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pyengineer.tools import calculate_excel, create_json_input

CURRENT_DIR = pathlib.Path(__file__).parent.resolve()

app = FastAPI()

# CORS para permitir requisições do Electron/React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Functions ///////////////////////////////////////////////////////////////////////////////////////
# Open Excel route ********************************************************************************
class IOpenExcel(BaseModel):
    """Interface"""
    path: str

@app.post('/open_excel')
def open_excel(req: IOpenExcel):
    """Get structure from Excel file."""
    try:
        analysis = calculate_excel(req.path, 'L1', False)
        data = create_json_input(analysis, False)
        return JSONResponse(status_code=200, content=data)
    except Exception as e: # pylint: disable=W0703
        print(f"Error: {e}", flush=True)
        return JSONResponse(status_code=500, content={"message": str(e)})

# Calculate structure route ***********************************************************************
class ICalculateStructure(BaseModel):
    """Interface"""
    data: dict[str, Any]

@app.post('/calculate-structure')
def calculate_structure():
    """Calculate structure from data."""
    print('Calculating structure...')

# Shutdown route **********************************************************************************
server: uvicorn.Server | None = None
@app.post("/shutdown")
def shutdown():
    """
    Route to gracefully shut down the server.
    """
    def stop():
        if server:
            sleep(0.5)  # Delay to ensure response is sent before shutdown
            server.should_exit = True
        sleep(0.5)
        sys.exit(0)

    threading.Thread(target=stop).start()
    return JSONResponse({"message": "Server is shutting down..."})

# Utils functions
def find_free_port() -> int:
    """Gets a free port from the OS.

    Returns:
        int: The free port number.
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind(("", 0))
        return s.getsockname()[1]

if __name__ == "__main__":
    port = find_free_port()
    print(f"Using dynamic port: {port}", flush=True)
    # Level of logs: critical, error, warning, info (default), debug, trace
    config = uvicorn.Config(app, host="127.0.0.1", port=port, log_level="info")
    server = uvicorn.Server(config)
    server.run()
