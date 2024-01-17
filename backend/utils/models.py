from pydantic import BaseModel, EmailStr, UUID4
from datetime import date, time, datetime
from dataclasses import dataclass

class User(BaseModel):
    id: UUID4
    display_name: str
    email: str
    access_token: str
    refresh_token: str
    login_type: str
    is_admin: bool

class AssociatedUser(BaseModel):
    associated_user: str

class Template(BaseModel):
    # name: str
    body : str
    subject : str

@dataclass
class Campaign:
    campaign_name: str
    template_id: str
    start_date: date
    start_time: time
    status: str = "Active"

class CampaignResponse(BaseModel):
    campaign_id: int
    template_id: str
    campaign_name: str
    start_date: date
    start_time: time
    status: str

class Recipient(BaseModel):
    campaign_id: int
    email: str
    first_name: str = None
    last_name: str = None
    status: str = "Subscribed"

class RecipientResponse(BaseModel):
    recipient_id: int
    campaign_id: int
    email: str
    first_name: str
    last_name: str
    status: str

class EmailTemplate(BaseModel):
    name: str
    subject: str
    body: str

class EmailSent(BaseModel):
    email: str
    subject: str
    sent_from: str

class DataLink(BaseModel):
    dataLink: str

class UserInfo(BaseModel):
    access_token: str