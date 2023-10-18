from discord.ext import commands
from django.conf import settings

from website.helpers import run_tasks

import discord, aiohttp, io
from PIL import Image


def send_img(msg, path):
    intents = discord.Intents.default()
    intents.message_content = True
    bot = commands.Bot(command_prefix='!', intents=intents)

    # Function to actually send the image
    async def send_image_to_channel(bot):
        channel = bot.get_channel(settings.DISCORD['CHANNEL_ID'])
        if channel is None:
            print(f"Channel with ID {settings.DISCORD['CHANNEL_ID']} not found.")
            return

        new_image = Image.new('RGB', (1024, 512))

        # Open the two 512x512 images (replace 'image1.jpg' and 'image2.jpg' with your image paths)
        image1 = Image.open(f"{path}/drawing.png")
        image2 = Image.open(f"{path}/output.png")

        # Paste the two images into the new image
        new_image.paste(image1, (0, 0))
        new_image.paste(image2, (512, 0))

        # Convert the Image to BytesIO
        fp = io.BytesIO()
        new_image.save(fp, format='PNG')
        fp.seek(0)

        await channel.send(msg, file=discord.File(fp=fp, filename="ink2ai.png"))

    # Runs once the bot has logged in successfully
    @bot.event
    async def on_ready():
        print(f'Logged in as {bot.user.name} (ID: {bot.user.id})')
        print('------')
        await send_image_to_channel(bot)
        await bot.close()

    # This runs the bot and blocks until the bot process is closed
    bot.run(settings.DISCORD['BOT_TOKEN'])


def sendToDiscord( uuid_code: str ):
    run_tasks.runManagerQuoted( 'send_discord', uuid_code )
