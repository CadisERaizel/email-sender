from fastapi import FastAPI, File, UploadFile, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from send import *
from utils.models import *
import uvicorn

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
HUNTER_API = "84329842b743101040b2d6f233371e050b86d4f0"

@app.post("/send-mails/")
async def mails(user : int, verify:bool, interval: int, emailKey: str, template: Template = Depends(), xlsxFile : UploadFile = File(...)) :
    user_data = get_user(user)
    if user_data != None:
        if xlsxFile.filename.endswith(".xlsx"):
            count = await mail_controller(user_data, template, xlsxFile, HUNTER_API, verify, interval, emailKey)
        else:
            return {"error": "Invalid file format, please upload an XLSX file"}
        return {"sent_count": count}
    else:
        return {"message": "User not found"}

@app.post("/add-user/")
def add_user(user: User):
    try:
        response = create_user(user)
        return {"message": response}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@app.get("/get-user/{user_id}")
def fetch_user(user_id: int):
    user = get_user(user_id)
    if user:
        return user.dict()
    else:
        raise HTTPException(status_code=404, detail="User not found")

@app.put("/update-user/{user_id}")
def edit_user(user_id: int, updated_user: User):
    try:
        response = update_user(user_id, updated_user)
        return {"message": response}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@app.delete("/delete-user/{user_id}")
def remove_user(user_id: int):
    response = delete_user(user_id)
    return {"message": response}

@app.get("/list-users/")
def listing_users():
    users = list_users()
    return users

@app.get("/")
def read_root():
    return {"message": "success"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=55555)