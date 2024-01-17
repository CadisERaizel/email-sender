from flask import Flask, redirect, request, session, url_for, render_template
import requests
import json
import os

app = Flask(__name__)
app.secret_key = os.urandom(24)

# Replace these values with your app's configuration
client_id = '8f4fd84b-1472-4d01-9dad-651f649f71df'
tenant_id = '9662a564-79fa-428f-847f-afd002a15c70'
client_secret = 'l618Q~go~jfnOXp3TonKNwCmUHfU.1gPp4O4UasZ'
redirect_uri = 'http://localhost:5000/callback'
authorization_base_url = f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/authorize'
token_url = f'https://login.microsoftonline.com/{tenant_id}/oauth2/v2.0/token'
graph_api_url = 'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages'
scope = ['openid', 'profile', 'Mail.Read', 'IMAP.AccessAsUser.All', 'offline_access']

@app.route('/')
def index():
    return 'Hello, this is your app! <a href="/login">Login with Microsoft</a>'

@app.route('/login')
def login():
    return redirect(authorization_base_url + '?' +
                    f'client_id={client_id}&response_type=code&redirect_uri={redirect_uri}&scope={" ".join(scope)}')

@app.route('/callback')
def callback():
    # Get authorization code from the callback URL
    code = request.args.get('code')

    # Exchange the authorization code for an access token
    token_params = {
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': redirect_uri,
        'client_id': client_id,
        'client_secret': client_secret,
    }

    token_response = requests.post(token_url, data=token_params)
    token_data = token_response.json()

    # Store the access token in the session
    session['access_token'] = token_data['access_token']
    print(token_data['access_token'])

    return redirect(url_for('profile'))

@app.route('/profile')
def profile():
    # Use the access token to make a request to Microsoft Graph API
    headers = {'Authorization': f'Bearer {session["access_token"]}'}
    response = requests.get('https://graph.microsoft.com/v1.0/me', headers=headers)
    profile_data = response.json()

    return f'Hello, {profile_data["displayName"]}! <a href="/mail">View Mail</a>'

@app.route('/mail')
def mail():
    # Use the access token to make a request to Microsoft Graph API to get mail folders
    headers = {'Authorization': f'Bearer {session["access_token"]}'}
    response = requests.get('https://graph.microsoft.com/v1.0/me/mailFolders', headers=headers)
    folders = response.json().get('value', [])

    return f'Mail Folders: {", ".join(folder["displayName"] for folder in folders)}'


@app.route('/inbox')
def inbox():

    # Use the access token to make a request to Microsoft Graph API to get messages from the inbox folder
    headers = {'Authorization': f'Bearer {session}'}
    response = requests.get(graph_api_url, headers=headers)
    # if(response.status_code == 401){

    # }
    messages = response.json().get('value', [])

    for message in messages:
        print(message)


if __name__ == '__main__':
    app.run(debug=True)
