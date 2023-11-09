from pydantic import BaseModel, ConfigDict

class User(BaseModel):
    first_name : str
    last_name : str
    email : str
    password : str

class Template(BaseModel):
    body : str
    subject : str