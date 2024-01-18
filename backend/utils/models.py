from pydantic import BaseModel, EmailStr, UUID4, AnyUrl
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

class CompanyDetailsPydantic(BaseModel):
    name: str
    address_street: str = None
    address_city: str = None
    address_state: str = None
    address_country: str = None
    address_postal: str = None
    lat: str = None
    lon: str = None
    phone: str = None
    url: str = None
    revenue: str = None
    total_employees: str = None
    year_founded: str = None
    email_patterns: str = None
    facebook: str = None
    twitter: str = None
    linkedin: str = None
    description: str = None
    logo_url: str = None
