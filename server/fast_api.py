'''

uvicorn main:app --reload --host 0.0.0.0 --port 8000

'''

### This must be ran first to init the django app

import django, os

# Setup the Django app
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "pysite.settings")
django.setup()


### Fast API specific loading


from fastapi import FastAPI, WebSocket
from fastapi.routing import APIRoute
from fastapi.middleware.cors import CORSMiddleware
from starlette.routing import WebSocketRoute


from django.conf import settings

from website.api import stable_diff_xl_ws

### Spin up the AI tasks

### Create the app
app = FastAPI()


### Websocket endpoints

app.routes.append( WebSocketRoute("/ws/stable_diff_xl", stable_diff_xl_ws.ws_entry))

### Configure Middleware which will boot the app

app.add_middleware( CORSMiddleware, **settings.FAST_API )


### Warm up SDXL pipeline
stable_diff_xl_ws.getPipeline()