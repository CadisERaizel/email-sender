from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.responses import RedirectResponse
from fastapi.templating import Jinja2Templates
from starlette.middleware.sessions import SessionMiddleware
from urllib.parse import urlencode
import httpx
from dotenv import load_dotenv
import os
import identity.web


load_dotenv()

CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")
REDIRECT_URI = os.getenv("REDIRECT_URI")
MICROSOFT_OAUTH_URL = "https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/authorize"
scope = ['offline_access', 'IMAP.AccessAsUser.All']

app = FastAPI()

auth = identity.web.Auth(
    session=session,
    authority=app.config["AUTHORITY"],
    client_id=app.config["CLIENT_ID"],
    client_credential=app.config["CLIENT_SECRET"],
)
# Configure Templates
templates = Jinja2Templates(directory="templates")

# Enable session support
app.add_middleware(SessionMiddleware, secret_key="super-secret-key")

# Routes

@app.get("/login")
async def login(request: Request):
    return templates.TemplateResponse("login.html", {"request": request})

@app.post("/login")
def login():
    authorization_url = f"{MICROSOFT_OAUTH_URL}/oauth2/v2.0/authorize"
    params = {
        "client_id": CLIENT_ID,
        "response_type": "code",
        "redirect_uri": REDIRECT_URI,
        "scope": " ".join(scope),
        "response_mode": "form_post",
    }
    return RedirectResponse(authorization_url, **params)

@app.post("/token")
async def token(
        code: str = Depends(OAuth2AuthorizationCodeBearer(authorizationUrl="login")),
):
    token_url = f"{MICROSOFT_OAUTH_URL}/oauth2/v2.0/token"
    data = {
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI,
        "grant_type": "authorization_code",
    }
    async with httpx.AsyncClient() as client:
        response = await client.post(token_url, data=data)
    response_data = response.json()
    return response_data

@app.get("/protected")
async def protected_route(token: dict = Depends(oauth2_scheme)):
    return {"message": "This is a protected route", "token": token}
