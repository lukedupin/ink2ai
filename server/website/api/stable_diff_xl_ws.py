import uuid

from asgiref.sync import sync_to_async
from fastapi import WebSocket
from json import JSONDecodeError
from django.db.utils import IntegrityError
from website.helpers import ws, util, stable_diff, discord

import io

from diffusers import StableDiffusionControlNetPipeline, ControlNetModel, UniPCMultistepScheduler
from diffusers import StableDiffusionXLControlNetPipeline, ControlNetModel, AutoencoderKL
from diffusers.utils import load_image
import numpy as np
from io import BytesIO
import asyncio, concurrent.futures, torch

import cv2, uuid
from PIL import Image


class State(ws.WsState):
    def __init__(self, websocket: WebSocket):
        super().__init__(websocket)
        self.uid = str(uuid.uuid4())
        self.image = None
        self.handle = BytesIO()
        self.data_loaded = 0
        self.file_size = 0


async def sdxl_init(state: State ):
    state.image = Image.new("RGB", (512, 512), "white")

    return 'sdxl_ready', {}


async def sdxl_user_file_size( state: State, file_size: int ):
    state.data_loaded = 0
    state.file_size = file_size
    state.handle = BytesIO()


async def sdxl_generate( state: State, prompt: str, negative: str, cn_steps: int, cn_weight: float, cn_start: float, cn_end: float):
    # Ensure the state is valid
    if state.image is None:
        return 'Please (re)upload your image'

    # Reset the progress
    await ws.succ_js(state, 'sdxl_progress', { 'progress': 0 })

    # Push the request onto the queue
    await stable_diff.push_queue(
        state,
        prompt,
        "((Naked)), ((Nude)), ((NSFW)), " + negative,
        cn_steps,
        cn_weight,
        cn_start,
        cn_end
    )

async def sdxl_to_discord( state: State, uuid_code: str ):
    discord.sendToDiscord( uuid_code )


async def process_file(state: State, data: bytes ):
    # ensure everything is valid
    if state.handle is None:
        return "No file handle"

    # Store the data
    state.handle.write( data )
    state.data_loaded += len(data)
    if state.data_loaded < state.file_size:
        return 'sdxl_user_image', { 'status': 'waiting_for_data' }

    # Load the image
    state.handle.seek(0)
    image = Image.open( state.handle)

    # get canny image
    image = image.resize((512, 512))#(1024, 1024))
    n_image = np.array(image)
    n_image = cv2.Canny(n_image, 100, 200)
    n_image = n_image[:, :, None]
    n_image = np.concatenate([n_image, n_image, n_image], axis=2)
    state.image = Image.fromarray(n_image)

    return 'sdxl_user_image', { 'status': 'complete' }


### Websocket endpoints

async def ws_entry(websocket: WebSocket):
    await ws.generic_loop( websocket, {
        'sdxl_init': sdxl_init,
        'sdxl_user_file_size': sdxl_user_file_size,
        'sdxl_generate': sdxl_generate,
        'sdxl_to_discord': sdxl_to_discord,

        'file': process_file,

        'on_close': lambda state: state.close(),
    }, State)
