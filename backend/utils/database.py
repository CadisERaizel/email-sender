import sqlite3
import pathlib
import sys
import os
import uuid

def get_db_connection():
    conn = sqlite3.connect('local.sqlite')
    conn.row_factory = sqlite3.Row
    return conn

def resource_path(relative_path):
    """ Get absolute path to resource, works for dev and for PyInstaller """
    try:
        # PyInstaller creates a temp folder and stores path in _MEIPASS
        base_path = sys._MEIPASS
    except Exception:
        base_path = os.path.abspath(".")
 
    return os.path.join(base_path, relative_path)

def migrate():
    with get_db_connection() as conn:
        cursor = conn.cursor()
        files = ["usersTable.sql", "campaign.sql", "uploads.sql"]
        for fil in files:
            file_path = resource_path(f"./migration/{fil}")
            with open(file_path) as file:
                try:
                    sql_queries = file.read()
                    cursor.executescript(sql_queries)
                    conn.commit()
                except sqlite3.Error as error:
                    print(error)

def execute_query(query, params=(), fetch_all=None):
    with get_db_connection() as conn:
        cursor = conn.cursor()
        try:
            if fetch_all == None:
                cursor.execute(query, params)
                conn.commit()
            elif fetch_all:
                cursor.execute(query)
                conn.commit()
                return cursor.fetchall()
            else:
                cursor.execute(query, params)
                conn.commit()
                return cursor.fetchone()
        except sqlite3.Error as error:
            print(error)
            raise


def create_user(user):
    try:
        user_dict = user.dict()
        query = '''
            INSERT INTO users (first_name, last_name, email, password)
            VALUES (?, ?, ?, ?)
        '''
        execute_query(query, (user_dict['first_name'], user_dict['last_name'], user_dict['email'], user_dict['password']))
        return "User created successfully"
    except ValueError as ve:
        raise ve

def get_user(user_id):
    query = 'SELECT * FROM users WHERE id = ?'
    result = execute_query(query, (user_id,), fetch_all=False)
    user_data = result
    if user_data:
        user_dict = {
            'id': user_data[0],
            'full_name': f'{user_data[1]} {user_data[2]}',
            'email': user_data[3],
            'password': user_data[4],
        }
        return user_dict
    else:
        return None

def update_user(user_id, updated_user):
    try:
        updated_user_dict = updated_user.dict()
        query = '''
            UPDATE users
            SET first_name = ?, last_name = ?, email = ?, password = ?
            WHERE id = ?
        '''
        execute_query(query, (updated_user_dict['first_name'], updated_user_dict['last_name'], updated_user_dict['email'], updated_user_dict['password'], user_id))
        return "User updated successfully"
    except ValueError as ve:
        raise ve

def delete_user(user_id):
    query = 'DELETE FROM users WHERE id = ?'
    execute_query(query, (user_id,))
    return "User deleted successfully"

def list_users():
    query = 'SELECT id, first_name, last_name, email FROM users'
    result = execute_query(query, (), fetch_all=True)
    users_data = result
    user_list = []
    for user_data in users_data:
        user_dict = {
            'id': user_data[0],
            'full_name': f'{user_data[1]} {user_data[2]}',
            'email': user_data[3],
        }
        user_list.append(user_dict)
    return user_list

def create_campaign(campaign_name, start_date, start_time, status, template_id):
    campaign_id = str(uuid.uuid4()) 
    query = '''
        INSERT INTO campaigns (id, campaign_name, start_date, start_time, status, template_id)
        VALUES (?, ?, ?, ?, ?, ?)
    '''
    execute_query(query, (campaign_id, campaign_name, str(start_date), str(start_time), status, template_id))
    return campaign_id

def get_campaign(campaign_id):
    query = '''
        SELECT id, campaign_name, start_date, start_time, status, template_id
        FROM campaigns
        WHERE id = ?
    '''
    campaign_info = execute_query(query, (campaign_id,), fetch_all=False)
    if campaign_info is not None:
        campaign_dict = {
            "id": campaign_info[0],
            "campaign_name": campaign_info[1],
            "start_date": campaign_info[2],
            "start_time": campaign_info[3],
            "status": campaign_info[4],
            "template_id": campaign_info[5]
        }
        return campaign_dict
    else:
        return None

def update_campaign(campaign_id, campaign_name, start_date, start_time, status, template_id):
    query = '''
        UPDATE campaigns
        SET campaign_name = ?, start_date = ?, start_time = ?, status = ?, template_id = ?
        WHERE id = ?
    '''
    execute_query(query, (campaign_name, start_date, start_time, status, template_id, campaign_id))
    return "Campaign updated successfully"

def delete_campaign(campaign_id):
    query = '''
        DELETE FROM campaigns
        WHERE campaign_id = ?
    '''
    execute_query(query, (campaign_id,))
    return "Campaign deleted successfully"

def get_all_campaigns():
    
    query='''
        SELECT id, campaign_name, start_date, start_time, status, template_id
        FROM campaigns
    '''
    campaigns = execute_query(query, (), fetch_all=True)
    # Convert the result into a list of dictionaries for easier use
    campaigns_list = []
    for campaign_info in campaigns:
        campaign_dict = {
            "id": campaign_info[0],
            "campaign_name": campaign_info[1],
            "start_date": campaign_info[2],
            "start_time": campaign_info[3],
            "status": campaign_info[4],
            "template_id": campaign_info[5]
        }
        campaigns_list.append(campaign_dict)

    return campaigns_list

def get_campaign_info_with_recipients(campaign_id):
    # Fetch campaign information including recipients from the database
    query='''
        SELECT
            campaigns.id as campaign_id,
            campaign_name,
            start_date,
            start_time,
            status,
            template_id,
            recipients.id as recipient_id,
            recipient_name,
            recipient_email
        FROM campaigns
        LEFT JOIN recipients ON campaigns.id = recipients.campaign_id
        WHERE campaigns.id = ?
    '''

    rows = execute_query(query, (campaign_id), fetch_all=True)

    if rows:
        campaign_info = {
            "campaign_id": rows[0][0],
            "campaign_name": rows[0][1],
            "start_date": rows[0][2],
            "start_time": rows[0][3],
            "status": rows[0][4],
            "template_id": rows[0][5],
            "recipients": []
        }

        for row in rows:
            if row[6] is not None:  # Check if recipient info is present
                recipient_info = {
                    "recipient_id": row[6],
                    "recipient_name": row[7],
                    "recipient_email": row[8]
                }
                campaign_info["recipients"].append(recipient_info)

        return campaign_info
    else:
        return None


def create_recipient(campaign_id, email, first_name=None, last_name=None, status="Subscribed"):
    query = '''
        INSERT INTO recipients (campaign_id, email, first_name, last_name, status)
        VALUES (?, ?, ?, ?, ?)
    '''
    execute_query(query, (campaign_id, email, first_name, last_name, status))
    return "Recipient created successfully"

def get_recipient(recipient_id):
    query = '''
        SELECT * FROM recipients
        WHERE recipient_id = ?
    '''
    return execute_query(query, (recipient_id,), fetch_all=False)

def update_recipient(recipient_id, updated_recipient):
    query = '''
        UPDATE recipients
        SET campaign_id = ?, email = ?, first_name = ?, last_name = ?, status = ?
        WHERE recipient_id = ?
    '''
    execute_query(query, (updated_recipient['campaign_id'], updated_recipient['email'], 
                          updated_recipient['first_name'], updated_recipient['last_name'], 
                          updated_recipient['status'], recipient_id))
    return "Recipient updated successfully"

def delete_recipient(recipient_id):
    query = '''
        DELETE FROM recipients
        WHERE recipient_id = ?
    '''
    execute_query(query, (recipient_id))
    return "Recipient deleted successfully"

def save_upload_file(filename, path, file_id, upload_time):
    # Insert file information into the database
   query='''
        INSERT INTO files (id, filename, path, upload_time)
        VALUES (?, ?, ?, ?)
    '''
   
   execute_query(query, (file_id, filename, path, upload_time))


def get_all_files():
    # Fetch all files from the database
    query = '''
        SELECT id, filename, upload_time
        FROM files
    '''
    result = execute_query(query, (), fetch_all=True)
    
    files_list = []
    for file_info in result:
        file_dict = {
            "id": file_info[0],
            "filename": file_info[1],
            "path": file_info[2],
            "upload_time": file_info[3]
        }
        files_list.append(file_dict)

    return files_list

def get_file_by_id(file_id):
    query='''
        SELECT id, filename, path, upload_time
        FROM files
        WHERE id = ?
    '''
    file_info = execute_query(query, (file_id,), fetch_all=False)

    # Check if the file was found
    if file_info is not None:
        file_dict = {
            "id": file_info[0],
            "filename": file_info[1],
            "path": file_info[2],
            "upload_time": file_info[3]
        }
        return file_dict
    else:
        return None

def create_email_template(template_name, subject, body):
    try:
        template_id = str(uuid.uuid4())  # Generate a new UUID for the template
        query = '''
            INSERT INTO email_templates (id, template_name, subject, body)
            VALUES (?, ?, ?, ?)
        '''
        execute_query(query, (template_id, template_name, subject, body))
        return {
            "template_id": template_id,
            "message": "Email template created successfully"
        }
    except sqlite3.Error as error:
        print(error)
        raise

def get_all_email_templates():
    query = '''
        SELECT id, template_name, subject, body
        FROM email_templates
    '''
    templates = execute_query(query, fetch_all=True)

    # Convert the result into a list of dictionaries for easier use
    templates_list = []
    for template_info in templates:
        template_dict = {
            "id": template_info[0],
            "template_name": template_info[1],
            "subject": template_info[2],
            "body": template_info[3]
        }
        templates_list.append(template_dict)

    return templates_list

def get_email_template_by_id(template_id):
    query = '''
        SELECT id, template_name, subject, body
        FROM email_templates
        WHERE id = ?
    '''
    template_info = execute_query(query, (template_id,), fetch_all=False)

    # Check if the email template was found
    if template_info:
        template_dict = {
            "id": template_info[0],
            "template_name": template_info[1],
            "subject": template_info[2],
            "body": template_info[3]
        }
        return template_dict
    else:
        return {
            "message": "Email template not found"
        }

def update_email_template(template_id, template_name, subject, body):
    query = '''
        UPDATE email_templates
        SET template_name = ?, subject = ?, body = ?
        WHERE id = ?
    '''
    execute_query(query, (template_name, subject, body, template_id))
    return {
        "message": "Email template updated successfully"
    }

def delete_email_template(template_id):
    query = '''
        DELETE FROM email_templates
        WHERE id = ?
    '''
    execute_query(query, (template_id,))
    return {
        "message": "Email template deleted successfully"
    }

def create_email(email_data):
    try:
        query = '''
            INSERT INTO emails_sent (id, email, subject, sent_from, sent_at)
            VALUES (?, ?, ?, ?, ?)
        '''
        execute_query(query, (email_data['id'], email_data['email'], email_data['subject'], email_data['sent_from'], email_data['sent_at']))
        return "Email created successfully"
    except ValueError as ve:
        raise ve

def get_email(id):
    query = 'SELECT * FROM emails_sent WHERE id = ?'
    result = execute_query(query, (id,), fetch_all=False)
    email_data = result
    if email_data:
        email_dict = {
            'id': email_data[0],
            'email': email_data[1],
            'subject': email_data[2],
            'sent_from': email_data[3],
            'sent_at': email_data[4],
            'read_mail': email_data[5],
            'notification_popped': email_data[6]
        }
        return email_dict
    else:
        return None

def update_email(id, updated_email):
    try:
        updated_email_dict = updated_email
        query = '''
            UPDATE emails_sent
            SET email = ?, subject = ?, sent_from = ?, sent_at = ?, read_mail = ?, notification_popped = ?
            WHERE id = ?
        '''
        execute_query(query, (updated_email_dict['email'], updated_email_dict['subject'], updated_email_dict['sent_from'], updated_email_dict['sent_at'], updated_email_dict['read_mail'], updated_email_dict['notification_popped'], id))
        return "Email updated successfully"
    except ValueError as ve:
        raise ve

def delete_email(email_id):
    query = 'DELETE FROM emails_sent WHERE id = ?'
    execute_query(query, (email_id,))
    return "Email deleted successfully"

def list_emails(is_opened):
    if is_opened:
        query = 'SELECT * FROM emails_sent where read_mail = 1' 
    else:
        query = 'SELECT * FROM emails_sent'
    result = execute_query(query, (), fetch_all=True)
    emails_data = result
    email_list = []
    for email_data in emails_data:
        email_dict = {
            'id': email_data[0],
            'email': email_data[1],
            'subject': email_data[2],
            'sent_from': email_data[3],
            'sent_at': email_data[4],
            'read_mail': email_data[5],
            'notification_popped': email_data[6]
        }
        email_list.append(email_dict)
    return emails_data