from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from typing import Optional, List
from send import *
from utils.models import *
import uuid
from PIL import Image
import uvicorn
import urllib, base64
import os
import pandas as pd

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

@app.get("/image/{image_code}")
async def get_image(image_code: str):
    url_decoded_message = urllib.parse.unquote(image_code)
    base64_decoded_message = base64.b64decode(url_decoded_message).decode()

    print(base64_decoded_message)
    message_id = base64_decoded_message.split("&&")[0].split("=")[-1]
    email_info = get_email(message_id)
    email_info['read_mail'] = 1
    update_email(message_id, email_info)
    image = Image.new("RGB", (1, 1), color="white")
    image_buffer = BytesIO()
    image.save(image_buffer, format="PNG")
    image_buffer.seek(0)
    return StreamingResponse(
        content=image_buffer, media_type="image/png", headers={"Content-Disposition": "inline"}
    )

@app.post("/create_campaign/", response_model=str)
def create_campaign_route( campaign: Campaign, ref: uuid.UUID | None = None, column: str | None = None, contactList: Optional[list] = Query(default=None)):
    campaign_id = create_campaign(campaign.campaign_name, campaign.start_date, campaign.start_time, campaign.status, campaign.template_id)
    if column != None:    
        if ref != None:
            file_info = get_file_by_id(str(ref))
            df = pd.read_excel(file_info['path'])
            df_list_of_dicts = df.to_dict(orient='records')
            for recipent in df_list_of_dicts:
                create_recipient(campaign_id, email=recipent[column.strip()])
    return "Campaign created successfully"

# Read all campaigns
@app.get("/get_all_campaigns/")
def get_all_campaigns_route():
    return get_all_campaigns()

# Read a specific campaign by ID
@app.get("/get_campaign/{campaign_id}", response_model=CampaignResponse)
def read_campaign_route(campaign_id: str):
    result = get_campaign(campaign_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return CampaignResponse(**result)

# Update a campaign by ID
@app.put("/update_campaign/{campaign_id}", response_model=str)
def update_campaign_route(campaign_id: str, updated_campaign: Campaign):
    update_campaign(campaign_id, updated_campaign.campaign_name, updated_campaign.start_date, updated_campaign.status, updated_campaign.template_id)
    return "Campaign updated successfully"

# Delete a campaign by ID
@app.delete("/delete_campaign/{campaign_id}", response_model=str)
def delete_campaign_route(campaign_id: str):
    delete_campaign(campaign_id)
    return "Campaign deleted successfully"

@app.post("/create_recipient/", response_model=str)
def create_recipient_route(recipient: Recipient):
    create_recipient(recipient.campaign_id, recipient.email, recipient.first_name, recipient.last_name, recipient.status)
    return "Recipient created successfully"

@app.get("/get_recipient/{recipient_id}", response_model=RecipientResponse)
def read_recipient_route(recipient_id: int):
    result = get_recipient(recipient_id)
    if result is None:
        raise HTTPException(status_code=404, detail="Recipient not found")
    return RecipientResponse(**result)

@app.put("/update_recipient/{recipient_id}", response_model=str)
def update_recipient_route(recipient_id: int, updated_recipient: Recipient):
    update_recipient(recipient_id, updated_recipient.model_dump())
    return "Recipient updated successfully"

@app.delete("/delete_recipient/{recipient_id}", response_model=str)
def delete_recipient_route(recipient_id: int):
    delete_recipient(recipient_id)
    return "Recipient deleted successfully"

@app.post("/upload_file/")
async def create_upload_file(file: UploadFile = File(...), replace_name : Optional[str] = None):
    os.makedirs(resource_path('./public/documents'), exist_ok=True)

    ext = file.filename.split('.')[-1]

    file_name = uuid.uuid4()
    file_path = os.path.join(resource_path('./public/documents'), str(file_name)+'.'+ext)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    upload_time = datetime.utcnow()
    name = file.filename if replace_name == None else replace_name
    save_upload_file(name, file_path, str(file_name), upload_time)
    return {"id": file_name}

# Create an email template
@app.post("/email_templates/", response_model=dict)
def create_email_template_route(template: EmailTemplate):
    return create_email_template(template.name, template.subject, template.body)

# Read all email templates
@app.get("/get_email_templates/", response_model=list)
def read_all_email_templates():
    return get_all_email_templates()

# Read a specific email template by ID
@app.get("/email_templates/{template_id}", response_model=EmailTemplate)
def read_email_template(template_id: str):
    template = get_email_template_by_id(template_id)
    if template:
        return template
    else:
        raise HTTPException(status_code=404, detail="Email template not found")

# Update an email template by ID
@app.put("/email_templates/{template_id}", response_model=str)
def update_email_template_route(template_id: str, template: EmailTemplate):
    return update_email_template(template_id, template)

# Delete an email template by ID
@app.delete("/email_templates/{template_id}", response_model=str)
def delete_email_template_route(template_id: str):
    return delete_email_template(template_id)

@app.post("/add-email/")
def add_email(email: EmailSent):
    try:
        response = create_email(email.model_dump())
        return {"message": response}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@app.get("/get-email/{email_id}")
def fetch_email(email_id: str):
    email = get_email(email_id)
    if email:
        return email
    else:
        raise HTTPException(status_code=404, detail="Email not found")

@app.put("/update-email/{email_id}")
def edit_email(email_id: str, updated_email: EmailSent):
    try:
        response = update_email(email_id, updated_email.model_dump())
        return {"message": response}
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))

@app.delete("/delete-email/{email_id}")
def remove_email(email_id: str):
    response = delete_email(email_id)
    return {"message": response}

@app.get("/list-emails/")
def list_emails_route(is_opened: bool | None = None):
    emails = list_emails(is_opened)
    return emails

@app.get("/")
def read_root():
    return {"message": "success"}

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=55555, reload=True)