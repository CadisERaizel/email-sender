import sqlite3
import pathlib
import sys
import os

def get_db_connection():
    conn = sqlite3.connect('local.sqlite3')
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
        files = ["usersTable.sql"]
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
