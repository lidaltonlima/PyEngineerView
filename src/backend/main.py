"""Main module."""
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

if __name__ == "__main__":
    config = uvicorn.Config(app=app, port=8000, log_level="info")
    server = uvicorn.Server(config)
    server.run()
