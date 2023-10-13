from asgiref.sync import sync_to_async
from fastapi import WebSocket
from json import JSONDecodeError
from django.db.utils import IntegrityError
from website.helpers import ws, util

import io

from diffusers import StableDiffusionXLControlNetPipeline, ControlNetModel, AutoencoderKL
from diffusers.utils import load_image
import numpy as np
import asyncio, concurrent.futures, torch

import cv2
from PIL import Image


stateful = None
def getPipeline():
    global stateful
    if stateful is not None:
        return stateful['pipeline']

    # initialize the models and pipeline
    controlnet = ControlNetModel.from_pretrained(
        "diffusers/controlnet-canny-sdxl-1.0", torch_dtype=torch.float16
    )
    vae = AutoencoderKL.from_pretrained("madebyollin/sdxl-vae-fp16-fix", torch_dtype=torch.float16)
    pipe = StableDiffusionXLControlNetPipeline.from_pretrained(
        "stabilityai/stable-diffusion-xl-base-1.0", controlnet=controlnet, vae=vae, torch_dtype=torch.float16
    )
    pipe.enable_model_cpu_offload()

    stateful = {
        'pipeline': pipe,
        'controlnet': controlnet,
        'vae': vae,
    }
    return stateful['pipeline']


class State(ws.WsState):
    def __init__(self, websocket: WebSocket):
        super().__init__( websocket )
        self.prompt = None
        self.negative_prompt = "low quality, bad quality, sketches"
        self.image = None
        self.cn_weight = 0.5  # recommended for good generalization
        self.cn_start = 0.0
        self.cn_end = 1.0


def run_pipeline( state: State ):
    pipe = getPipeline()

    # convert to gray
    grayscale_image = cv2.cvtColor(state.image, cv2.COLOR_BGR2GRAY)
    canny = 255 - grayscale_image

    # Resize the image
    canny_clean = cv2.resize(canny, (1024, 1024))

    # The image!
    return pipe(
        state.prompt,
        negative_prompt=state.negative_prompt,
        controlnet_conditioning_scale=state.cn_weight,
        control_guidance_start=state.cn_start,
        control_guidance_end=state.cn_end,
        num_images_per_prompt=30,
        width=1024,
        height=1024,
        image=canny_clean
    ).images[0]


async def sdxl_init(state: State ):
    # Spin up the pipeline if it isn't already, this will save lots of time later
    getPipeline()

    # get canny image
    #image = np.array(image)
    #image = cv2.Canny(image, 100, 200)
    #image = image[:, :, None]
    #image = np.concatenate([image, image, image], axis=2)
    #canny_image = Image.fromarray(image)

    return 'sdxl_ready', {}


async def sdxl_settings(state: State, prompt: str, negative: str, cn_weight: float, cn_start: float, cn_end: float):
    state.prompt = prompt
    state.negative_prompt = negative
    state.cn_weight = cn_weight
    state.cn_start = cn_start
    state.cn_end = cn_end


async def sdxl_generate( state: State ):
    # Execute the command
    with concurrent.futures.ThreadPoolExecutor() as pool:
        image = await asyncio.get_running_loop().run_in_executor(
            pool,
            run_pipeline,  # working function that runs threaded
            state )  # args to pass to the function

    return 'sdxl_image', { 'data': image }


### Websocket endpoints

async def ws_entry(websocket: WebSocket):
    await ws.generic_loop( websocket, {
        'sdxl_init': sdxl_init,
        'sdxl_settings': sdxl_settings,
        'sdxl_generate': sdxl_generate,

        'on_close': lambda state: state.close(),
    }, State)
