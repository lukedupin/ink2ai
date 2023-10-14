from asgiref.sync import sync_to_async
from fastapi import WebSocket
from json import JSONDecodeError
from django.db.utils import IntegrityError
from website.helpers import ws, util

import io

from diffusers import StableDiffusionXLControlNetPipeline, ControlNetModel, AutoencoderKL
from diffusers.utils import load_image
import numpy as np
from io import BytesIO
import asyncio, concurrent.futures, torch

import cv2
from PIL import Image


class State(ws.WsState):
    def __init__(self, websocket: WebSocket):
        super().__init__(websocket)
        self.prompt = None
        self.negative_prompt = "low quality, bad quality, sketches"
        self.image = None
        self.handle = BytesIO()
        self.data_loaded = 0
        self.file_size = 0
        self.cn_weight = 0.5  # recommended for good generalization
        self.cn_start = 0.0
        self.cn_end = 1.0


pipeline = None
def getPipeline():
    global pipeline
    if pipeline is not None:
        return pipeline['pipeline']

    print("Spinning up SDXL pipeline")

    # initialize the models and pipeline
    controlnet = ControlNetModel.from_pretrained(
        "diffusers/controlnet-canny-sdxl-1.0", torch_dtype=torch.float16
    )
    vae = AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=torch.float16)
    pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", controlnet=controlnet, vae=vae, torch_dtype=torch.float16
    )
    pipe.enable_model_cpu_offload()

    pipeline = {
        'pipeline': pipe,
        'controlnet': controlnet,
        'vae': vae
    }

    print("SDXL pipeline ready")
    return pipeline['pipeline']


def run_pipeline( state: State ):
    pipe = getPipeline()

    # convert to gray
    #grayscale_image = cv2.cvtColor(state.image, cv2.COLOR_BGR2GRAY)
    #canny = 255 - grayscale_image

    # Resize the image
    #canny_clean = cv2.resize(canny, (1024, 1024))

    # The image!
    return pipe(
        state.prompt,
        negative_prompt=state.negative_prompt,
        controlnet_conditioning_scale=state.cn_weight,
        control_guidance_start=state.cn_start,
        control_guidance_end=state.cn_end,
        num_images_per_prompt=30,
        width=768,#1024,
        height=768,#1024,
        image=state.image
    ).images[0]


async def sdxl_init(state: State ):
    with concurrent.futures.ThreadPoolExecutor() as pool:
        await asyncio.get_running_loop().run_in_executor(
            pool,
            getPipeline ) # No args

    # get canny image
    #image = np.array(image)
    #image = cv2.Canny(image, 100, 200)
    #image = image[:, :, None]
    #image = np.concatenate([image, image, image], axis=2)
    #canny_image = Image.fromarray(image)

    return 'sdxl_ready', {}


async def sdxl_user_file_size( state: State, file_size: int ):
    state.data_loaded = 0
    state.file_size = file_size
    state.handle = BytesIO()


async def sdxl_generate( state: State, prompt: str, negative: str, cn_weight: float, cn_start: float, cn_end: float):
    state.prompt = prompt
    state.negative_prompt = negative
    state.cn_weight = cn_weight
    state.cn_start = cn_start
    state.cn_end = cn_end

    # Execute the command
    with concurrent.futures.ThreadPoolExecutor() as pool:
        image = await asyncio.get_running_loop().run_in_executor(
            pool,
            run_pipeline,  # working function that runs threaded
            state )  # args to pass to the function

    # Convert the image to bytes and get the file size
    with BytesIO() as byte_stream:
        image.save(byte_stream, format='PNG')
        file_size = len(byte_stream.getvalue())
        await state.sock.send_json({ 'ep': 'sdxl_filesize', 'file_size': file_size })

        # get canny image
        image = cv2.resize(image, (768, 768))#(1024, 1024))
        n_image = np.array(image)
        n_image = cv2.Canny(n_image, 100, 200)
        n_image = n_image[:, :, None]
        n_image = np.concatenate([n_image, n_image, n_image], axis=2)
        state.image = Image.fromarray(n_image)

        # Send the image
        sent = 0
        byte_stream.seek(0)
        while sent < file_size:
            one_megabyte = byte_stream.read(1048576)
            await state.sock.send_bytes( one_megabyte )
            sent += len(one_megabyte)


async def process_file(state: State, data: bytes ):
    # Store the data
    state.handle.write( data )
    state.data_loaded += len(data)
    if state.data_loaded < state.file_size:
        return 'sdxl_user_image', { 'status': 'waiting_for_data' }

    # Load the image
    state.handle.seek(0)
    state.image = Image.open( state.handle)
    state.image.save('/tmp/test.png')

    return 'sdxl_user_image', { 'status': 'complete' }


### Websocket endpoints

async def ws_entry(websocket: WebSocket):
    await ws.generic_loop( websocket, {
        'sdxl_init': sdxl_init,
        'sdxl_user_file_size': sdxl_user_file_size,
        'sdxl_generate': sdxl_generate,

        'file': process_file,

        'on_close': lambda state: state.close(),
    }, State)
