"""Main module."""
import socket
import sys
from time import sleep
import threading
import uvicorn
from fastapi import FastAPI
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# CORS para permitir requisições do Electron/React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Para dev, em prod você pode restringir
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SomaRequest(BaseModel):
    """Interface"""
    a: float
    b: float

@app.post("/somar")
def somar(req: SomaRequest):
    """Test function to sum two numbers."""
    return {"resultado": req.a + req.b}

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
