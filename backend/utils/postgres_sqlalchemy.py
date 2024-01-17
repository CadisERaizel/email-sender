from sqlalchemy import create_engine, Column, String, DateTime, Boolean, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import declarative_base, relationship
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv
import uuid
import sys
from datetime import datetime
from typing import List
import urllib.parse

load_dotenv()

DATABASE_NAME = os.environ.get('DATABASE_NAME')
DATABASE_USER = os.environ.get('DATABASE_USER')
DATABASE_PASSWORD = urllib.parse.quote_plus(os.environ.get('DATABASE_PASSWORD'))
DATABASE_HOST = os.environ.get('DATABASE_HOST')
DATABASE_PORT = os.environ.get('DATABASE_PORT')

engine = create_engine(
    f'postgresql://{DATABASE_USER}:{DATABASE_PASSWORD}@{DATABASE_HOST}:{DATABASE_PORT}/{DATABASE_NAME}')
Session = sessionmaker(bind=engine)
Base = declarative_base()


class User(Base):
    __tablename__ = 'users'

    id = Column(UUID(as_uuid=True), primary_key=True, unique=True, nullable=False)
    display_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    login_type = Column(String, nullable=False)
    is_admin = Column(Boolean, nullable=False, default=False)

class AssiociatedUser(Base):
    __tablename__ = 'associated_users'

    id = Column(UUID(as_uuid=True), primary_key=True, unique=True, nullable=False)
    primary_user_id = Column(UUID(as_uuid=True), unique=True)
    display_name = Column(String, nullable=False)
    email = Column(String, nullable=False, unique=True)
    access_token = Column(String, nullable=False)
    refresh_token = Column(String, nullable=False)
    login_type = Column(String, nullable=False)


class Campaign(Base):
    __tablename__ = 'campaigns'

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    campaign_name = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    start_time = Column(String, nullable=False)
    status = Column(String, nullable=False)
    template_id = Column(UUID(as_uuid=True), ForeignKey(
        'email_templates.id'), nullable=False)
    template = relationship("EmailTemplate", back_populates="campaigns")


class Recipient(Base):
    __tablename__ = 'recipients'

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    campaign_id = Column(UUID(as_uuid=True), ForeignKey(
        'campaigns.id'), nullable=False)
    email = Column(String, nullable=False)
    first_name = Column(String)
    last_name = Column(String)
    status = Column(String, nullable=False)


class EmailTemplate(Base):
    __tablename__ = 'email_templates'

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    template_name = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    body = Column(String, nullable=False)
    campaigns = relationship("Campaign", back_populates="template")


class EmailSent(Base):
    __tablename__ = 'emails_sent'

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    email = Column(String, nullable=False)
    subject = Column(String, nullable=False)
    sent_from = Column(String, nullable=False)
    sent_at = Column(DateTime, nullable=False, default=datetime.utcnow)
    read_mail = Column(Boolean, nullable=False, default=False)
    notification_popped = Column(Boolean, nullable=False, default=False)


class Files(Base):
    __tablename__ = 'files'

    id = Column(UUID(as_uuid=True), primary_key=True,
                default=uuid.uuid4, unique=True, nullable=False)
    filename = Column(String, nullable=False)
    path = Column(String, nullable=False)
    upload_time = Column(DateTime, nullable=False)

################################################################
############# Company Details ##################################

class CompanyDetails(Base):
    __tablename__ = 'company_details'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    name = Column(String, nullable=False)
    address_street = Column(String, nullable=True)
    address_city = Column(String, nullable=True)
    address_state = Column(String, nullable=True)
    address_country = Column(String, nullable=True)
    address_postal = Column(String, nullable=True)
    lat = Column(String, nullable=True)
    lon = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    url = Column(String, nullable=True)
    revenue = Column(String, nullable=True)
    total_employees = Column(String, nullable=True)
    year_founded = Column(String, nullable=True)
    email_patterns = Column(Text, nullable=True)
    facebook = Column(String, nullable=True)
    twitter = Column(String, nullable=True)
    linkedin = Column(String, nullable=True)
    description = Column(Text, nullable=True)
    logo_url = Column(String, nullable=True)

class ContactDetails(Base):
    __tablename__ = 'contact_details'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, unique=True, nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey('company_details.id'), nullable=False)
    fullname = Column(String, nullable=False)
    email = Column(String, nullable=False)
    contact = Column(String, nullable=True)
    position = Column(String, nullable=True)
    additional_info = Column(Text, nullable=True)
    is_primary = Column(Boolean, default=False, nullable=False)

    # Define a relationship to the CompanyDetails table
    company = relationship("CompanyDetails", back_populates="contacts")

# Add a new attribute to the CompanyDetails class to represent the relationship
CompanyDetails.contacts = relationship("ContactDetails", order_by=ContactDetails.id, back_populates="company")

################################################################################################################################

def resource_path(relative_path):
    try:
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
    return os.path.join(base_path, relative_path)


def get_db_session():
    return Session()


def migrate():
    Base.metadata.create_all(engine)


def create_user(user_data: dict) -> str:
    try:
        session = get_db_session()
        new_user = User(**user_data)
        session.add(new_user)
        session.commit()
        return "User created successfully"
    except Exception as e:
        session.rollback()
        raise e


def get_user(user_id: str) -> User:
    session = get_db_session()
    return session.query(User).filter_by(id=user_id).first()


def update_user(user_id, updated_user_data):
    try:
        session = get_db_session()
        user = get_user(user_id)
        if user:
            for key, value in updated_user_data.items():
                setattr(user, key, value)
            session.commit()
            return "User updated successfully"
        else:
            return "User not found"
    except Exception as e:
        session.rollback()
        raise e


def delete_user(user_id):
    try:
        session = get_db_session()
        user = get_user(user_id)
        if user:
            session.delete(user)
            session.commit()
            return "User deleted successfully"
        else:
            return "User not found"
    except Exception as e:
        session.rollback()
        raise e


def list_users():
    session = get_db_session()
    users = session.query(User).all()
    user_list = []
    for user in users:
        user_dict = {
            'id': str(user.id),
            'display_name': user.display_name,
            'email': user.email,
            'is_admin': user.is_admin,
            'login_type': user.login_type
        }
        user_list.append(user_dict)
    return user_list

def create_associated_user(user_data: dict):
    session = get_db_session()
    new_user = AssiociatedUser(**user_data)
    session.add(new_user)
    session.commit()

# Read
def get_associated_user(user_id: str):
    session = get_db_session()
    return session.query(AssiociatedUser).filter_by(id=user_id).first()

# Update
def update_associated_user(user_id: str, new_data: dict):
    session = get_db_session()
    user = session.query(AssiociatedUser).filter_by(id=user_id).first()
    if user:
        for key, value in new_data.items():
            setattr(user, key, value)
        session.commit()

# Delete
def delete_associated_user(user_id: str):
    session = get_db_session()
    user = session.query(AssiociatedUser).filter_by(id=user_id).first()
    if user:
        session.delete(user)
        session.commit()

# List all users
def list_all_associated_users():
    session = get_db_session()
    users = session.query(AssiociatedUser).all()
    user_list = []

    for user in users:
        user_dict = {
            'id': str(user.id),
            'primary_user_id': str(user.primary_user_id),
            'display_name': user.display_name,
            'email': user.email,
            'login_type': user.login_type,
        }
        user_list.append(user_dict)

    return user_list


def create_campaign(campaign_data):
    try:
        session = get_db_session()
        new_campaign = Campaign(**campaign_data)
        session.add(new_campaign)
        session.commit()
        return "Campaign created successfully"
    except Exception as e:
        session.rollback()
        raise e


def get_campaign(campaign_id):
    session = get_db_session()
    return session.query(Campaign).filter_by(id=campaign_id).first()


def update_campaign(campaign_id, updated_campaign_data):
    try:
        session = get_db_session()
        campaign = get_campaign(campaign_id)
        if campaign:
            for key, value in updated_campaign_data.items():
                setattr(campaign, key, value)
            session.commit()
            return "Campaign updated successfully"
        else:
            return "Campaign not found"
    except Exception as e:
        session.rollback()
        raise e


def delete_campaign(campaign_id):
    try:
        session = get_db_session()
        campaign = get_campaign(campaign_id)
        if campaign:
            session.delete(campaign)
            session.commit()
            return "Campaign deleted successfully"
        else:
            return "Campaign not found"
    except Exception as e:
        session.rollback()
        raise e


def get_all_campaigns():
    session = get_db_session()
    campaigns = session.query(Campaign).all()
    campaigns_list = []
    for campaign in campaigns:
        campaign_dict = {
            'id': str(campaign.id),
            'campaign_name': campaign.campaign_name,
            'start_date': campaign.start_date,
            'start_time': campaign.start_time,
            'status': campaign.status,
            'template_id': str(campaign.template_id),
        }
        campaigns_list.append(campaign_dict)
    return campaigns_list


def get_campaign_info_with_recipients(campaign_id):
    session = get_db_session()
    result = (
        session.query(
            Campaign.id,
            Campaign.campaign_name,
            Campaign.start_date,
            Campaign.start_time,
            Campaign.status,
            Campaign.template_id,
            Recipient.id.label("recipient_id"),
            Recipient.first_name.label("recipient_name"),
            Recipient.email.label("recipient_email")
        )
        .outerjoin(Recipient, Campaign.id == Recipient.campaign_id)
        .filter(Campaign.id == campaign_id)
        .all()
    )

    if result:
        campaign_info = {
            "campaign_id": str(result[0].id),
            "campaign_name": result[0].campaign_name,
            "start_date": result[0].start_date,
            "start_time": result[0].start_time,
            "status": result[0].status,
            "template_id": str(result[0].template_id),
            "recipients": []
        }

        for row in result:
            if row.recipient_id is not None:
                recipient_info = {
                    "recipient_id": str(row.recipient_id),
                    "recipient_name": row.recipient_name,
                    "recipient_email": row.recipient_email
                }
                campaign_info["recipients"].append(recipient_info)

        return campaign_info
    else:
        return None


def create_recipient(campaign_id, email, first_name=None, last_name=None, status="Subscribed"):
    try:
        session = get_db_session()
        new_recipient = Recipient(
            campaign_id=campaign_id,
            email=email,
            first_name=first_name,
            last_name=last_name,
            status=status
        )
        session.add(new_recipient)
        session.commit()
        return "Recipient created successfully"
    except Exception as e:
        session.rollback()
        raise e


def get_recipient(recipient_id):
    session = get_db_session()
    return session.query(Recipient).filter_by(id=recipient_id).first()


def update_recipient(recipient_id, updated_recipient_data):
    try:
        session = get_db_session()
        recipient = get_recipient(recipient_id)
        if recipient:
            for key, value in updated_recipient_data.items():
                setattr(recipient, key, value)
            session.commit()
            return "Recipient updated successfully"
        else:
            return "Recipient not found"
    except Exception as e:
        session.rollback()
        raise e


def delete_recipient(recipient_id):
    try:
        session = get_db_session()
        recipient = get_recipient(recipient_id)
        if recipient:
            session.delete(recipient)
            session.commit()
            return "Recipient deleted successfully"
        else:
            return "Recipient not found"
    except Exception as e:
        session.rollback()
        raise e


def get_recipients_for_campaign(campaign_id):
    session = get_db_session()
    recipients = session.query(Recipient).filter_by(
        campaign_id=campaign_id).all()
    recipients_list = []
    for recipient in recipients:
        recipient_dict = {
            'id': str(recipient.id),
            'campaign_id': str(recipient.campaign_id),
            'email': recipient.email,
            'first_name': recipient.first_name,
            'last_name': recipient.last_name,
            'status': recipient.status,
        }
        recipients_list.append(recipient_dict)
    return recipients_list


def save_upload_file(filename, path, upload_time):
    try:
        session = get_db_session()
        file_id = str(uuid.uuid4())
        new_file = Files(id=file_id, filename=filename,
                        path=path, upload_time=upload_time)
        session.add(new_file)
        session.commit()
        return "File saved successfully"
    except Exception as e:
        session.rollback()
        raise e


def get_all_files():
    session = get_db_session()
    files = session.query(Files).all()
    files_list = []
    for file in files:
        file_dict = {
            'id': str(file.id),
            'filename': file.filename,
            'path': file.path,
            'upload_time': file.upload_time,
        }
        files_list.append(file_dict)
    return files_list


def get_file_by_id(file_id):
    session = get_db_session()
    file = session.query(Files).filter_by(id=file_id).first()
    if file:
        file_dict = {
            'id': str(file.id),
            'filename': file.filename,
            'path': file.path,
            'upload_time': file.upload_time,
        }
        return file_dict
    else:
        return None


def create_email_template(template_name, subject, body):
    try:
        session = get_db_session()
        template_id = str(uuid.uuid4())
        new_template = EmailTemplate(
            id=template_id, template_name=template_name, subject=subject, body=body)
        session.add(new_template)
        session.commit()
        return {"template_id": template_id, "message": "Email template created successfully"}
    except Exception as e:
        session.rollback()
        raise e


def get_all_email_templates():
    session = get_db_session()
    templates = session.query(EmailTemplate).all()
    templates_list = []
    for template in templates:
        template_dict = {
            'id': str(template.id),
            'template_name': template.template_name,
            'subject': template.subject,
            'body': template.body,
        }
        templates_list.append(template_dict)
    return templates_list


def get_email_template_by_id(template_id):
    session = get_db_session()
    template = session.query(EmailTemplate).filter_by(id=template_id).first()
    if template:
        template_dict = {
            'id': str(template.id),
            'template_name': template.template_name,
            'subject': template.subject,
            'body': template.body,
        }
        return template_dict
    else:
        return {"message": "Email template not found"}


def update_email_template(template_id, template_name, subject, body):
    try:
        session = get_db_session()
        template = session.query(EmailTemplate).filter_by(
            id=template_id).first()
        if template:
            template.template_name = template_name
            template.subject = subject
            template.body = body
            session.commit()
            return {"message": "Email template updated successfully"}
        else:
            return {"message": "Email template not found"}
    except Exception as e:
        session.rollback()
        raise e


def delete_email_template(template_id):
    try:
        session = get_db_session()
        template = session.query(EmailTemplate).filter_by(
            id=template_id).first()
        if template:
            session.delete(template)
            session.commit()
            return {"message": "Email template deleted successfully"}
        else:
            return {"message": "Email template not found"}
    except Exception as e:
        session.rollback()
        raise e


def create_email(email_data):
    try:
        session = get_db_session()
        new_email = EmailSent(
            id=email_data['id'],
            email=email_data['email'],
            subject=email_data['subject'],
            sent_from=email_data['sent_from'],
            sent_at=email_data['sent_at'],
            read_mail=email_data['read_mail'],
            notification_popped=email_data['notification_popped']
        )
        session.add(new_email)
        session.commit()
        return "Email created successfully"
    except Exception as e:
        session.rollback()
        raise e


def get_email(email_id):
    session = get_db_session()
    return session.query(EmailSent).filter_by(id=email_id).first()


def update_email(email_id, updated_email_data):
    try:
        session = get_db_session()
        email = get_email(email_id)
        if email:
            for key, value in updated_email_data.items():
                setattr(email, key, value)
            session.commit()
            return "Email updated successfully"
        else:
            return "Email not found"
    except Exception as e:
        session.rollback()
        raise e


def delete_email(email_id):
    try:
        session = get_db_session()
        email = get_email(email_id)
        if email:
            session.delete(email)
            session.commit()
            return "Email deleted successfully"
        else:
            return "Email not found"
    except Exception as e:
        session.rollback()
        raise e


def list_emails(is_opened):
    session = get_db_session()
    if is_opened:
        emails = session.query(EmailSent).filter_by(
            read_mail=True).order_by(EmailSent.sent_at.desc()).all()
    else:
        emails = session.query(EmailSent).order_by(
            EmailSent.sent_at.desc()).all()

    emails_list = []
    for email in emails:
        email_dict = {
            'id': str(email.id),
            'email': email.email,
            'subject': email.subject,
            'sent_from': email.sent_from,
            'sent_at': email.sent_at,
            'read_mail': email.read_mail,
            'notification_popped': email.notification_popped
        }
        emails_list.append(email_dict)
    return emails_list


################################################################
#### Companies CRUD API #################
def create_company_details(company_data: dict) -> str:
    try:
        session = get_db_session()
        new_company = CompanyDetails(**company_data)
        session.add(new_company)
        session.commit()
        return "Company details created successfully"
    except Exception as e:
        session.rollback()
        raise e

def get_company_details(company_id: uuid.UUID) -> CompanyDetails:
    session = get_db_session()
    return session.query(CompanyDetails).filter_by(id=company_id).first()

def update_company_details(company_id: uuid.UUID, updated_data: dict) -> str:
    try:
        session = get_db_session()
        company = session.query(CompanyDetails).filter_by(id=company_id).first()
        if company:
            for key, value in updated_data.items():
                setattr(company, key, value)
            session.commit()
            return "Company details updated successfully"
        else:
            return "Company not found"
    except Exception as e:
        session.rollback()
        raise e

def delete_company_details(company_id: uuid.UUID) -> str:
    try:
        session = get_db_session()
        company = session.query(CompanyDetails).filter_by(id=company_id).first()
        if company:
            session.delete(company)
            session.commit()
            return "Company details deleted successfully"
        else:
            return "Company not found"
    except Exception as e:
        session.rollback()
        raise e
    
def list_all_companies() -> List[dict]:
    session = get_db_session()
    companies = session.query(CompanyDetails).all()

    companies_list = []
    for company in companies:
        company_dict = {
            'id': str(company.id),
            'name': company.name,
            'address_street': company.address_street,
            'address_city': company.address_city,
            'address_state': company.address_state,
            'address_country': company.address_country,
            'address_postal': company.address_postal,
            'lat': company.lat,
            'lon': company.lon,
            'phone': company.phone,
            'url': company.url,
            'revenue': company.revenue,
            'total_employees': company.total_employees,
            'year_founded': company.year_founded,
            'email_patterns': company.email_patterns,
            'facebook': company.facebook,
            'twitter': company.twitter,
            'linkedin': company.linkedin,
            'description': company.description,
            'logo_url': company.logo_url,
        }
        companies_list.append(company_dict)

    return companies_list