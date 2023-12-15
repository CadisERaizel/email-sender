# import imaplib
# from oauthlib.oauth2 import BackendApplicationClient
# from requests.auth import HTTPBasicAuth
# from requests_oauthlib import OAuth2Session
import requests
# Your OAuth app credentials
client_id = '8f4fd84b-1472-4d01-9dad-651f649f71df'
tenant_id = '9662a564-79fa-428f-847f-afd002a15c70'
client_secret = 'l618Q~go~jfnOXp3TonKNwCmUHfU.1gPp4O4UasZ'
redirect_uri = 'http://localhost:3000'

# # Define OAuth URLs
# token_url = 'https://login.microsoftonline.com/{}/oauth2/v2.0/token'.format(tenant_id)

# # Set up OAuth session with scope
# scope = ['offline_access', 'IMAP.AccessAsUser.All']  # Use appropriate scope for IMAP
# oauth = OAuth2Session(client=BackendApplicationClient(client_id=client_id), scope=scope)
# token = oauth.fetch_token(token_url=token_url, auth=HTTPBasicAuth(client_id, client_secret))

# # IMAP configuration
# imap_server = 'outlook.office365.com'
# imap_port = 993

# # Connect to IMAP using OAuth token
# imap_conn = imaplib.IMAP4_SSL(imap_server, imap_port)
# imap_conn.debug = 4  # Optional: Enable debug mode for troubleshooting

# # Authenticate with OAuth token
# imap_conn.authenticate('XOAUTH2', lambda x: 'user={}\1auth=Bearer {}\1\1'.format('rohith.b@codetru.com', token['access_token']))

# # Now you can use the imap_conn object to interact with the mailbox
# # For example, you can list folders: imap_conn.list()
# # Or select a folder: imap_conn.select('inbox')

# print(imap_conn.list())
# inbox = imap_conn.select('inbox')

# # Don't forget to close the connection when you're done
# imap_conn.logout()
graph_api_url = 'https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages'
session = 'eyJ0eXAiOiJKV1QiLCJub25jZSI6Ikx2cWRQbnhRc19SbGFOaTAtcUJrUF9WSUtCVmFuN05WVlJUc1gwT21VbWciLCJhbGciOiJSUzI1NiIsIng1dCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSIsImtpZCI6IlQxU3QtZExUdnlXUmd4Ql82NzZ1OGtyWFMtSSJ9.eyJhdWQiOiIwMDAwMDAwMy0wMDAwLTAwMDAtYzAwMC0wMDAwMDAwMDAwMDAiLCJpc3MiOiJodHRwczovL3N0cy53aW5kb3dzLm5ldC85NjYyYTU2NC03OWZhLTQyOGYtODQ3Zi1hZmQwMDJhMTVjNzAvIiwiaWF0IjoxNzAyMDQwODI3LCJuYmYiOjE3MDIwNDA4MjcsImV4cCI6MTcwMjA0NTY3NSwiYWNjdCI6MCwiYWNyIjoiMSIsImFpbyI6IkFUUUF5LzhWQUFBQTFWOXVaYUl6cmpKenVxYjBsbFpnOVpkNHZIcmpqaUl2QXZWVU0vR1ltNEVCL1pxcjNJYW1qOVJsam42b2VQTFUiLCJhbXIiOlsicHdkIl0sImFwcF9kaXNwbGF5bmFtZSI6Im1haWxlciIsImFwcGlkIjoiOGY0ZmQ4NGItMTQ3Mi00ZDAxLTlkYWQtNjUxZjY0OWY3MWRmIiwiYXBwaWRhY3IiOiIxIiwiZmFtaWx5X25hbWUiOiJSYWphIEJoYW51IiwiZ2l2ZW5fbmFtZSI6IlJvaGl0aCBSYWoiLCJpZHR5cCI6InVzZXIiLCJpcGFkZHIiOiIxMDMuMjExLjM4LjE3MCIsIm5hbWUiOiJSb2hpdGggUmFqIFJhamEgQmhhbnUiLCJvaWQiOiJhZmRhYzYxNC1mNWUyLTQyY2EtOGVkZi02Mzg1ZDQyN2ViZTQiLCJwbGF0ZiI6IjMiLCJwdWlkIjoiMTAwMzIwMDIyRTZGOEZGMCIsInJoIjoiMC5BWEVBWktWaWx2cDVqMEtFZjZfUUFxRmNjQU1BQUFBQUFBQUF3QUFBQUFBQUFBQ0hBQ00uIiwic2NwIjoiSU1BUC5BY2Nlc3NBc1VzZXIuQWxsIE1haWwuUmVhZCBvcGVuaWQgUE9QLkFjY2Vzc0FzVXNlci5BbGwgcHJvZmlsZSBTTVRQLlNlbmQgVXNlci5SZWFkIGVtYWlsIiwic2lnbmluX3N0YXRlIjpbImttc2kiXSwic3ViIjoidllnQS1GQmVCTklVcTVYSTlWN3lWODJ6bW5qV0p1cEZ4SDh6bzVQczVsayIsInRlbmFudF9yZWdpb25fc2NvcGUiOiJBUyIsInRpZCI6Ijk2NjJhNTY0LTc5ZmEtNDI4Zi04NDdmLWFmZDAwMmExNWM3MCIsInVuaXF1ZV9uYW1lIjoiUm9oaXRoLmJAY29kZXRydS5jb20iLCJ1cG4iOiJSb2hpdGguYkBjb2RldHJ1LmNvbSIsInV0aSI6IlozMjlBMXVIaDBXRkJPLXdXMDRkQUEiLCJ2ZXIiOiIxLjAiLCJ3aWRzIjpbImI3OWZiZjRkLTNlZjktNDY4OS04MTQzLTc2YjE5NGU4NTUwOSJdLCJ4bXNfc3QiOnsic3ViIjoiei1RRnJ0V1R2M1Y3VFpGZnR1MUY2NnZPckl2ZHlZUDFSNTVPeTBFeFBlUSJ9LCJ4bXNfdGNkdCI6MTY1NzA5MTQzM30.q1O8WUID_DbCtM872l90pqiMc_qRIDVKQM1-LrnUnXag0ppBysu6GUv_4080tG7m89SlDmxTZ0X7F2dXJCBwPKuzmUSMqVoqPT4aFx9Aq35hijwDA8-WNMguK_TMvcFh3-nb0VGLzkF-9MEQnDgdciaQQwQt2svF--nVxxdkcoKzZTpY02QMAQk9Wfxkz90LxWUclwSMyQGrqP9KVi6tUkCVZu85_naYSu6Ou3v_nAEM_l4D7UxDpzIX-rus3cvFv5RXQhJU-gggrxZCaRuwgCQQj9r27usKYgwYLKxUkTdwWQ8PRX1jwQwumh-kg8RYDKIY96od_pQVv91dQVpnLg'
def inbox():

    # Use the access token to make a request to Microsoft Graph API to get messages from the inbox folder
    headers = {'Authorization': f'Bearer {session}'}
    response = requests.get(graph_api_url, headers=headers)
    # if(response.status_code == 401){

    # }
    messages = response.json().get('value', [])

    for message in messages:
        print(message)

inbox()

import requests

token_url = 'https://login.microsoftonline.com/your_tenant_id/oauth2/v2.0/token'

def refresh_access_token(refresh_token):
    refresh_token_params = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': 'your_client_id',
        'client_secret': 'your_client_secret',
    }

    response = requests.post(token_url, data=refresh_token_params)
    new_token_data = response.json()
    new_access_token = new_token_data.get('access_token')

    return new_access_token
