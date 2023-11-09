from fastapi import FastAPI, File, UploadFile, Form, Depends
from fastapi.middleware.cors import CORSMiddleware
from io import BytesIO
from send import *
from models import *

app = FastAPI()
origins = ["*"]  # Replace "*" with the origins you want to allow, e.g., "http://localhost:3000"

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
migrate()

@app.post("/send-mails/")
async def mails(template: Template = Depends(), xlsxFile : UploadFile = File(...)) :
    if xlsxFile.filename.endswith(".xlsx"):
        await mail_controller(template, xlsxFile)
    else:
        return {"error": "Invalid file format, please upload an XLSX file"}
    return {}

@app.get("/")
def read_root():
    return {"message": "success"}