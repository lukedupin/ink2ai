from django.conf import settings

from twilio.rest import Client
from twilio.base.exceptions import TwilioException, TwilioRestException
from website.helpers import util


def sendSms( to, body ):
    try:
        client = Client( settings.TWILIO_SMS['ACCOUNT_SID'],
                         settings.TWILIO_SMS['AUTH_TOKEN'] )

        message = client.messages.create(body=body, to=to,
                                         from_=settings.TWILIO_SMS['PHONE_NUMBER'])

    except TwilioException as e:
        print(e)
        return None

    except TwilioRestException as e:
        print(e)
        return None

    return message.sid


# Send a welcome message
def sendWelcome( target, name ):
    return sendSms( target, f"Hey {util.xstr(name)} welcome to BeenThere. Plan, Play, Level-up! Join the conversation on Discord: https://discord.gg/jzEuYTaD")