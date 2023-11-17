import os
import time
from smtplib import SMTP
import markdown
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import requests
from io import BytesIO
from utils.database import *
import pandas as pd

async def get_msg(xlsxFile, template, emailKey):
    content = await xlsxFile.read()
    df = pd.read_excel(BytesIO(content), header=0)
    data = df.to_dict(orient='records')
    headers = df.columns.tolist()
    # workbook = load_workbook(filename=BytesIO(content), data_only=True)
    # sheet = workbook.active
    # data = []
    # for row in sheet.iter_rows(values_only=True):
    #     data.append(row)
    # headers = list(data[0])
    # data.pop(0)
    for row in data:
        body_string = template.body
        subject_string = template.subject
        for index, header in enumerate(headers):
            value = row[header]
            body_string = body_string.replace(f'{{{header}}}', value)
            subject_string = subject_string.replace(f'{{{header}}}', value)
        yield row[emailKey], body_string, subject_string


def confirm_attachments():
    file_contents = []
    file_names = []
    try:
        for filename in os.listdir('ATTACH'):

            entry = input(f"""TYPE IN 'Y' AND PRESS ENTER IF YOU CONFIRM T0 ATTACH {filename} 
                                    TO SKIP PRESS ENTER: """)
            confirmed = True if entry == 'Y' else False
            if confirmed:
                file_names.append(filename)
                with open(f'{os.getcwd()}/ATTACH/{filename}', "rb") as f:
                    content = f.read()
                file_contents.append(content)

        return {'names': file_names, 'contents': file_contents}
    except FileNotFoundError:
        print('No ATTACH directory found...')


async def send_emails(server: SMTP, user, template, xlsxFile, HUNTER_API, verify, interval, emailKey):

    attachments = confirm_attachments()
    sent_count = 0

    async for receiver, message, subject in get_msg(xlsxFile, template, emailKey):
        if verify:
            response = requests.get(f"https://api.hunter.io/v2/email-verifier?email={receiver}&api_key={HUNTER_API}")
            response = response.json()
            if(response["data"]["status"] =="valid"):
                multipart_msg = MIMEMultipart("alternative")
                sender_email = user['email']

                multipart_msg["Subject"] = subject
                multipart_msg["From"] = user["full_name"] + f' <{sender_email}>'
                multipart_msg["To"] = receiver

                text = message
                html = markdown.markdown(text)

                part1 = MIMEText(text, "plain")
                part2 = MIMEText(html, "html")

                multipart_msg.attach(part1)
                multipart_msg.attach(part2)

                if attachments:
                    for content, name in zip(attachments['contents'], attachments['names']):
                        attach_part = MIMEBase('application', 'octet-stream')
                        attach_part.set_payload(content)
                        encoders.encode_base64(attach_part)
                        attach_part.add_header('Content-Disposition',
                                            f"attachment; filename={name}")
                        multipart_msg.attach(attach_part)

                try:
                    server.sendmail(sender_email, receiver,
                                    multipart_msg.as_string())
                except Exception as err:
                    print(f'Problem occurend while sending to {receiver} ')
                    print(err)
                else:
                    sent_count += 1
        else: 
            multipart_msg = MIMEMultipart("alternative")
            sender_email = user['email']

            multipart_msg["Subject"] = subject
            multipart_msg["From"] = user["full_name"] + f' <{sender_email}>'
            multipart_msg["To"] = receiver

            text = message
            html = markdown.markdown(text)                

            part1 = MIMEText(text, "plain")
            part2 = MIMEText(html, "html")

            multipart_msg.attach(part1)
            multipart_msg.attach(part2)

            if attachments:
                for content, name in zip(attachments['contents'], attachments['names']):
                    attach_part = MIMEBase('application', 'octet-stream')
                    attach_part.set_payload(content)
                    encoders.encode_base64(attach_part)
                    attach_part.add_header('Content-Disposition',
                                        f"attachment; filename={name}")
                    multipart_msg.attach(attach_part)

            try:
                server.sendmail(sender_email, receiver,
                                multipart_msg.as_string())
            except Exception as err:
                print(f'Problem occurend while sending to {receiver} ')
                print(err)
                input("PRESS ENTER TO CONTINUE")
            else:
                sent_count += 1
        time.sleep(interval)

    return sent_count


async def mail_controller(user, template, xlsxFile, HUNTER_API, verify, interval, emailKey):
    host = "smtp.office365.com"
    port = 587  # TLS replaced SSL in 1999


    server = SMTP(host=host, port=port)
    server.connect(host=host, port=port)
    server.ehlo()
    server.starttls()
    server.ehlo()
    server.login(user=user["email"], password=user["password"])

    count = await send_emails(server, user, template, xlsxFile, HUNTER_API, verify, interval, emailKey)

    server.quit()
    print("MAIL SEND")
    return count


# AAHNIK 2020
