from django.core.management.base import BaseCommand

from website.helpers import discord

import re, os, json
from django.conf import settings
from PIL import Image


class Command(BaseCommand):
    help = 'Load Initial data'
    
    def add_arguments(self, parser):
        parser.add_argument('uuid_code', type=str, help="UUID of payload")


    # Run the command
    def handle(self, uuid_code, *args, **options):
        path = f"{settings.PAYLOAD_PATH}/{uuid_code}"
        if not os.path.exists(path):
            return

        js = json.load( open(f"{path}/payload.json") )
        n_len = len("((Naked)), ((Nude)), ((NSFW)),")
        msg = [
            f"Prompt: {js['prompt']}",
            f"Negative: {js['negative'][n_len:]}",
            f"Weight: {js['cn_steps']}\nStart: {js['cn_start']}%\nEnd: {js['cn_end']}%",
        ]

        discord.send_img( '\n\n'.join(msg), path )