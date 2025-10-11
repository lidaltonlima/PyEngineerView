"""Main module."""
import json
import sys
import pathlib
from time import sleep

import socket
import threading
import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from pyengineer.tools import calculate_excel, create_calculated_structure

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
@app.post('/open_excel')
def open_excel():
    """Get structure from Excel file."""
    try:
        # Calculate structure from json file
        relative_path = pathlib.Path('src/examples/excel', 'matheus_romero_02.xlsx')
        path_open = CURRENT_DIR / relative_path
        print(f"Opening Excel file at: {path_open}")
        analysis = calculate_excel(path_open, 'L1')

        # Create json file from calculated structure
        temp_path = './pyengineer/temp/structure_calculated.json'
        path_create = CURRENT_DIR / temp_path
        create_calculated_structure(path_create, analysis)

        with open(path_create, 'r', encoding='utf-8') as file:
            data = json.load(file)
            return data

        # return {'status': 'success', 'message': 'File processed successfully.'}

    except Exception as e: # pylint: disable=W0703
        return {'status': 'error', 'message': str(e)}

class SomaRequest(BaseModel):
    """Interface"""
    a: float
    b: float

@app.post("/somar")
def somar(req: SomaRequest):
    """Test function to sum two numbers."""
    return {"resultado": req.a + req.b}

# Shutdown route
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
    uvicorn.run(app, host="127.0.0.1", port=port, log_level="info")
