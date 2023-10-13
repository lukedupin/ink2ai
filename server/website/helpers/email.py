from django.conf import settings
from django.utils.timezone import utc
from python_http_client import BadRequestsError, UnauthorizedError

from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail, Attachment, FileContent, FileName, FileType, Disposition, ContentId

from tzwhere import tzwhere

import datetime, math, re, pytz, base64, uuid, hashlib, sys


def sendEmail( to_email, subject, body, attachment=None, from_email=None ):
    if from_email is None:
        from_email = settings.SEND_GRID['FROM_EMAIL']

    # to_email could be a single string or a list of strings
    if isinstance(to_email, list):
        for email in to_email:
            if email.find('@') < 0:
                return None
    else:
        if to_email.find('@') < 0:
            return None

    message = Mail(
        from_email=from_email,
        to_emails=to_email,
        subject=subject,
        html_content=body)

    # Add an attachment?
    if attachment is not None:
        with open(attachment, "rb") as handle:
            encoded = base64.b64encode(handle.read()).decode()
            attach = Attachment()
            attach.file_content = FileContent(encoded)
            attach.file_type = FileType('application/csv')
            attach.file_name = FileName( attachment.split('/')[-1])
            attach.disposition = Disposition('attachment')
            attach.content_id = ContentId(str(uuid.uuid4()))
            message.attachment = attach

    # response = None
    err = None
    try:
        sg = SendGridAPIClient(settings.SEND_GRID['API_KEY'])
        response = sg.send(message)
        #print(response.status_code)
        #print(response.body)
        #print(response.headers)
    except KeyError as e:
        err = "Invalid API key!"
    except BadRequestsError as e:
        err = f"Bad request for email: {to_email}"
    except UnauthorizedError as e:
        err = f"Invalid authorization API key"

    return err
