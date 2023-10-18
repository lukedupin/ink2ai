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

from website.helpers.async_safe_dict import AsyncSafeDict

# Global variables
pipeline = None
queue = None
queue_dict = None
queue_idx = 0
queue_current_idx = 0

class QueueMsg:
    def __init__(self, state, prompt: str, negative: str, cn_steps: int, cn_weight: float, cn_start: float, cn_end: float):
        self.sock = state.sock
        self.image = state.image
        self.uid = state.uid

        self.prompt = prompt
        self.negative = negative
        self.cn_steps = cn_steps
        self.cn_weight = cn_weight
        self.cn_start = cn_start
        self.cn_end = cn_end


async def getQueue():
    global queue
    global queue_dict
    if queue is not None and queue_dict is not None:
        return queue, queue_dict

    # Create a queue
    queue = asyncio.Queue()
    queue_dict = AsyncSafeDict()
    asyncio.create_task( processQueue(queue, queue_dict) )
    return queue, queue_dict


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


def run_pipeline( state: QueueMsg ):
    pipe = getPipeline()

    async def progress_update( progress: int ):
        await ws.succ_js(state, 'sdxl_progress', {'progress': progress})

    err = None
    try:
        image = pipe(
            state.prompt,
            state.image,
            width=512, height=512,
            negative_prompt=state.negative,
            controlnet_conditioning_scale=state.cn_weight,
            control_guidance_start=state.cn_start,
            control_guidance_end=state.cn_end,
            num_inference_steps=state.cn_steps,
            callback=lambda step, ts, latent: asyncio.run(progress_update( int(100 * (step / state.cn_steps)) )),
            ).images[0]

    except ValueError as e:
        err = str(e)

    except TypeError as e:
        err = str(e)

    except Exception as e:
        err = str(e)

    return image if err is None else err


async def processQueue( queue: asyncio.Queue, queue_dict: AsyncSafeDict ):
    global queue_current_idx

    print("Queue Online and waiting for requests...")
    print("")
    while True:
        # Pull valid messages
        if (msg := await queue.get()) is None:
            continue

        # Pull the queue and update users where they currently are
        queue_current_idx, _ = await queue_dict.take( msg.uid )
        for _, sock in await queue_dict.keys():
            await ws.succ_js(sock, 'sdxl_queue_exec', {'queue': queue_current_idx})

        # Execute the command
        with concurrent.futures.ThreadPoolExecutor() as pool:
            image = await asyncio.get_running_loop().run_in_executor(
                pool,
                run_pipeline,  # working function that runs threaded
                msg )  # args to pass to the function

        # Return the result
        msg.promise.set_result( image )

    # Tell the asyncio.create_task -> join that we are done with the task
    queue.task_done()


async def push_queue( state, prompt: str, negative: str, cn_steps: int, cn_weight: float, cn_start: float, cn_end: float ):
    global queue_idx
    global queue_current_idx

    # Get the queue
    queue, queue_dict = await getQueue()

    # Block updates if the user already has pending request
    if await queue_dict.contains( state.uid ):
        await ws.fail_js(state, 'sdxl_generate', 'You already have a pending request, please wait for it to finish')
        return None

    # Create a queue_msg and promise
    msg = QueueMsg( state, prompt, negative, cn_steps, cn_weight, cn_start, cn_end )
    msg.promise = asyncio.get_running_loop().create_future()

    # Push the socket onto the queue
    queue_idx += 1
    await queue_dict.set( state.uid, (msg, queue_idx))

    # Tell the user what queue idx they are
    await ws.succ_js(msg, 'sdxl_queue_loaded', {'queue': queue_idx, 'queue_current': queue_current_idx })

    # Add the message to the queue, this will cause it to run
    await queue.put( msg )

    # This will pause until the task is done
    return await msg.promise
