from asgiref.sync import sync_to_async
from fastapi import WebSocket
from json import JSONDecodeError
from django.db.utils import IntegrityError
from website.helpers import ws, util

import io

from diffusers import StableDiffusionControlNetPipeline, ControlNetModel, UniPCMultistepScheduler
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
        self.image = None
        self.handle = BytesIO()
        self.data_loaded = 0
        self.file_size = 0

        self.prompt = None
        self.negative_prompt = "low quality, bad quality, sketches"
        self.cn_steps = 35
        self.cn_weight = 0.5  # recommended for good generalization
        self.cn_start = 0.0
        self.cn_end = 1.0


'''
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
        width=512,#1024,
        height=512,#1024,
        image=state.image
    ).images[0]
'''

pipeline = None
def getPipeline():
    global pipeline
    if pipeline is not None:
        return pipeline['pipeline']

    controlnet = ControlNetModel.from_pretrained(
        "lllyasviel/sd-controlnet-canny", torch_dtype=torch.float32
    )

    model_id = "sdvn53dcutewave_v10.safetensors"
    model_id = "cyberrealistic_v33.safetensors"
    model_id = "epicrealism_naturalSinRC1VAE.safetensors"
    # model_id = "Lykon/DreamShaper"
    # model_id = "runwayml/stable-diffusion-v1-5"
    # pipe = StableDiffusionControlNetImg2ImgPipeline.from_pretrained(
    pipe = StableDiffusionControlNetPipeline.from_single_file(
    #pipe = StableDiffusionControlNetPipeline.from_pretrained(
        model_id,
        controlnet=controlnet,
        safety_checker=None,
        safetensors=True,
        torch_dtype=torch.float32
    )

    pipe.scheduler = UniPCMultistepScheduler.from_config(pipe.scheduler.config)

    # Remove if you do not have xformers installed
    # see https://huggingface.co/docs/diffusers/v0.13.0/en/optimization/xformers#installing-xformers
    # for installation instructions
    #pipe.enable_xformers_memory_efficient_attention()

    pipe.enable_model_cpu_offload()

    pipe.safety_checker = lambda images, **kwargs: (images, [False for _ in range(len(images))])

    pipeline = {
        'pipeline': pipe,
        'controlnet': controlnet,
        'lock': False,
    }
    return pipeline['pipeline']

def run_pipeline( state: State ):
    pipe = getPipeline()
    pipeline['lock'] = True

    async def progress_update( progress: int ):
        await ws.succ_js(state, 'sdxl_progress', {'progress': progress})

    image = pipe(
        state.prompt,
        state.image,
        width=512, height=512,
        negative_prompt=state.negative_prompt,
        controlnet_conditioning_scale=state.cn_weight,
        control_guidance_start=state.cn_start,
        control_guidance_end=state.cn_end,
        num_inference_steps=state.cn_steps,
        callback=lambda step, ts, latent: asyncio.run(progress_update( int(100 * (step / state.cn_steps)) )),
        ).images[0]

    #state.image.save("/tmp/canny.png")
    #image.save("/tmp/image.png")

    pipeline['lock'] = False

    return image


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


async def sdxl_generate( state: State, prompt: str, negative: str, cn_steps: int, cn_weight: float, cn_start: float, cn_end: float):
    state.prompt = prompt
    state.negative_prompt = negative
    state.cn_steps = cn_steps
    state.cn_weight = cn_weight
    state.cn_start = cn_start
    state.cn_end = cn_end

    await ws.succ_js(state, 'sdxl_progress', { 'progress': 0 })

    # Spin while we wait
    while pipeline is not None and pipeline['lock']:
        await asyncio.sleep(1)

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
        await ws.succ_js(state, 'sdxl_file_size', { 'file_size': file_size })


        # Send the image
        sent = 0
        byte_stream.seek(0)
        while sent < file_size:
            one_megabyte = byte_stream.read(1048576)
            await state.sock.send_bytes( one_megabyte )
            sent += len(one_megabyte)

    await ws.succ_js(state, 'sdxl_progress', { 'progress': -1 })


async def process_file(state: State, data: bytes ):
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

        'file': process_file,

        'on_close': lambda state: state.close(),
    }, State)
