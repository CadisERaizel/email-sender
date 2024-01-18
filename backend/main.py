from fastapi import FastAPI, File, UploadFile, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from starlette.middleware.sessions import SessionMiddleware
from typing import Optional, ClassVar
from send import *
from utils.models import *
import uuid
from PIL import Image
import uvicorn
import urllib
import base64
import os
from dotenv import load_dotenv
import pandas as pd
from fastapi import FastAPI, Request
from fastapi.responses import RedirectResponse, HTMLResponse
from fastapi_msal import MSALAuthorization, MSALClientConfig
from fastapi_msal.models import AuthToken
import httpx
import msal
import json

load_dotenv()


class AppConfig(MSALClientConfig):
    endpoint: str = "https://graph.microsoft.com/v1.0/me"
    login_path: str = "/_login"
    logout_path: str = "/_logout"
    scopes: ClassVar[list[str]] = ['Mail.Read',
                                   'IMAP.AccessAsUser.All']


config = AppConfig(_env_file="microsoft.env")
app = FastAPI()
auth = MSALAuthorization(client_config=config, return_to_path='/login')

################################

app_msal = msal.ConfidentialClientApplication(
    config.client_id,
    authority=config.authority,
    client_credential=config.client_credential,
)

#################################

app.add_middleware(SessionMiddleware, secret_key=config.client_credential)
app.include_router(auth.router)
origins = ["http://localhost:3000"]

# migrate()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HUNTER_API = os.environ.get("HUNTER_API_KEY")
GRAPH_API_URL = os.environ.get("GRAPH_API_URL")
ABSTRACT_API_URL = os.environ.get("ABSTRACT_API_URL")
ABSTRACT_API_KEY = os.environ.get("ABSTRACT_API_KEY")

@app.get("/login", response_model=None)
async def login(request: Request):
    token: Optional[AuthToken] = await auth.get_session_token(request=request)
    if not token or not token.id_token_claims:
        return RedirectResponse(url=config.login_path)
    check_user = True if get_user(token.id_token_claims.user_id) else False
    if not check_user:
        new_user = {
            'id': token.id_token_claims.user_id,
            'display_name': token.id_token_claims.display_name,
            'email': token.id_token_claims.preferred_username,
            'access_token': token.access_token,
            'refresh_token': token.refresh_token,
            'login_type': 'Microsoft',
            'is_admin': False
        }
        create_user(new_user)
    return RedirectResponse(url="http://localhost:3000")


@app.get("/logout")
async def logout(request: Request):
    token: Optional[AuthToken] = await auth.get_session_token(request=request)
    if not token or not token.id_token_claims:
        return RedirectResponse(url="http://localhost:3000")
    return RedirectResponse(url=config.logout_path)


@app.get("/validate")
async def validate(request: Request):
    token: Optional[AuthToken] = await auth.get_session_token(request=request)
    if not token or not token.id_token_claims:
        return {"authentication": False}
    return {"authentication": True}


@app.get("/get-user-id")
async def validate(request: Request):
    token: Optional[AuthToken] = await auth.get_session_token(request=request)
    if not token or not token.id_token_claims:
        return {"user_id": None}
    return {"user_id": token.id_token_claims.user_id}


@app.get("/add-account")
async def add_account():
    login_url = app_msal.get_authorization_request_url(
        config.scopes, redirect_uri='http://localhost:5555/get_token')
    return RedirectResponse(login_url)


@app.get("/get_token")
async def add_account(code: Optional[str] | None):
    if code:
        token = app_msal.acquire_token_by_authorization_code(
            code,
            scopes=config.scopes,
            redirect_uri='http://localhost:5555/get_token'
        )
        # Access token is in the token_result
        check_user = True if get_associated_user(
            token["id_token_claims"]["oid"]) else False
        if not check_user:
            new_user = {
                'id': token["id_token_claims"]["oid"],
                'display_name': token["id_token_claims"]["name"],
                'email': token["id_token_claims"]["preferred_username"],
                'access_token': token["access_token"],
                'refresh_token': token["refresh_token"],
                'login_type': 'Microsoft',
            }
            create_associated_user(new_user)
        else:
            return {"message": "Already exists", "status": 201}

        return RedirectResponse(url=f"http://localhost:3000/add-account/{token['id_token_claims']['oid']}")
    return


@app.post("/associate-account")
async def add_account(request: Request, user: Optional[AssociatedUser] | None):
    token: Optional[AuthToken] = await auth.get_session_token(request=request)
    if not token or not token.id_token_claims:
        return RedirectResponse(url=config.login_path)
    check_user = True if get_associated_user(user.associated_user) else False
    if check_user:
        update_user = {
            'primary_user_id': token.id_token_claims.user_id,
        }
        update_associated_user(user.associated_user, update_user)
    else:
        HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail='User not in database')
    return {"message": "success", "status": 200}


@app.get('/mail')
async def mail(request: Request):
    # Use the access token to make a request to Microsoft Graph API to get mail folders
    token: Optional[AuthToken] = await auth.handler.get_token_from_session(request=request)
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            config.endpoint+'/mailFolders', headers={
                "Authorization": "Bearer " + token.access_token},
        )
    folders = resp.json().get('value', [])

    return folders


@app.get('/inbox')
async def inbox(request: Request):
    # Use the access token to make a request to Microsoft Graph API to get mail folders
    token: Optional[AuthToken] = await auth.handler.get_token_from_session(request=request)
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            config.endpoint+'/mailFolders/inbox/messages?$top=100', headers={
                "Authorization": "Bearer " + token.access_token},
        )
    print(resp)
    nextLink = resp.json().get('@odata.nextLink', '')
    mails = resp.json().get('value', [])
    response = {
        "mails": mails,
        "nextLink": nextLink
    }
    return response

@app.get('/draft')
async def draft(request: Request):
    # Use the access token to make a request to Microsoft Graph API to get mail folders
    token: Optional[AuthToken] = await auth.handler.get_token_from_session(request=request)
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            config.endpoint+'/mailFolders/draft/messages?$top=100', headers={
                "Authorization": "Bearer " + token.access_token},
        )
    print(resp)
    nextLink = resp.json().get('@odata.nextLink', '')
    mails = resp.json().get('value', [])
    response = {
        "mails": mails,
        "nextLink": nextLink
    }
    return response


@app.post('/fetchMore')
async def mail(request: Request, dataLink: DataLink):
    # Use the access token to make a request to Microsoft Graph API to get mail folders
    token: Optional[AuthToken] = await auth.handler.get_token_from_session(request=request)
    print(dataLink.dataLink)
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            dataLink.dataLink, headers={
                "Authorization": "Bearer " + token.access_token},
        )
    nextLink = resp.json().get('@odata.nextLink', '')
    mails = resp.json().get('value', [])
    response = {
        "mails": mails,
        "nextLink": nextLink
    }
    return response


@app.post("/send-mails/")
async def mails(user: int, verify: bool, interval: int, emailKey: str, template: Template = Depends(), xlsxFile: UploadFile = File(...)):
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
def create_campaign_route(campaign: Campaign, ref: uuid.UUID | None = None, column: str | None = None, contactList: Optional[list] = Query(default=None)):
    campaign_id = create_campaign(campaign.campaign_name, campaign.start_date,
                                  campaign.start_time, campaign.status, campaign.template_id)
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
    update_campaign(campaign_id, updated_campaign.campaign_name,
                    updated_campaign.start_date, updated_campaign.status, updated_campaign.template_id)
    return "Campaign updated successfully"

# Delete a campaign by ID


@app.delete("/delete_campaign/{campaign_id}", response_model=str)
def delete_campaign_route(campaign_id: str):
    delete_campaign(campaign_id)
    return "Campaign deleted successfully"


@app.post("/create_recipient/", response_model=str)
def create_recipient_route(recipient: Recipient):
    create_recipient(recipient.campaign_id, recipient.email,
                     recipient.first_name, recipient.last_name, recipient.status)
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
async def create_upload_file(file: UploadFile = File(...), replace_name: Optional[str] = None):
    os.makedirs(resource_path('./public/documents'), exist_ok=True)

    ext = file.filename.split('.')[-1]

    file_name = uuid.uuid4()
    file_path = os.path.join(resource_path(
        './public/documents'), str(file_name)+'.'+ext)
    with open(file_path, "wb") as f:
        f.write(file.file.read())
    upload_time = datetime.utcnow()
    name = file.filename if replace_name == None else replace_name
    save_upload_file(name, file_path, str(file_name), upload_time)
    return {"id": file_name}


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

@app.get('/getCompany')
async def getCompany(company_domain: str):
    async with httpx.AsyncClient() as client:
        resp = await client.get(f'https://api.thecompaniesapi.com/v1/companies/{company_domain}?token=dNw3bpdh')
    return resp.json()

@app.get("/")
def read_root():
    return {"message": "success"}


########################################################################
########################################################################
###################### Company Details #################################

@app.post("/create-company/")
def create_company_route(company: CompanyDetailsPydantic):
    try:
        create_company_details(company.model_dump())
        return {"message": "Company created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/get-company/{company_id}")
def get_company_route(company_id: uuid.UUID):
    company = get_company_details(company_id)
    if company:
        return company
    else:
        raise HTTPException(status_code=404, detail="Company not found")

@app.put("/update-company/{company_id}")
def update_company_route(company_id: uuid.UUID, updated_company: CompanyDetailsPydantic):
    try:
        update_company_details(company_id, updated_company)
        return {"message": "Company updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.delete("/delete-company/{company_id}")
def delete_company_route(company_id: uuid.UUID):
    delete_company_details(company_id)
    return {"message": "Company deleted successfully"}

@app.get("/list-companies/")
def list_companies_route():
    return list_all_companies()


@app.post('/contacts', response_model=str)
def create_contact_route(contact_data: dict):
    result = create_contact(contact_data)
    return result

@app.get('/contacts/{contact_id}', response_model=dict)
def get_contact_route(contact_id: uuid.UUID):
    contact = get_contact(contact_id)
    if contact:
        return contact.__dict__
    else:
        raise HTTPException(status_code=404, detail="Contact not found")

@app.put('/contacts/{contact_id}', response_model=str)
def update_contact_route(contact_id: uuid.UUID, updated_contact_data: dict):
    result = update_contact(contact_id, updated_contact_data)
    return result

@app.delete('/contacts/{contact_id}', response_model=str)
def delete_contact_route(contact_id: uuid.UUID):
    result = delete_contact(contact_id)
    return result

@app.get('/contacts', response_model=list)
def list_contacts_route():
    contacts = list_contacts()
    return {"contacts": contacts}

################################################################################################

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=5555, reload=True)
