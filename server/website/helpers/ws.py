from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect

from json import JSONDecodeError

import warnings, json, io

from websockets.exceptions import ConnectionClosedError


class WsState:
    def __init__(self, sock: WebSocket):
        self.sock = sock


# Typical websocket loop
async def generic_loop(websocket: WebSocket, routes, custom=WsState):
    await websocket.accept()
    state = custom(websocket)

    try:
        while True:
            ep, params, disconnect = await process( state )
            if disconnect:
                return

            # Confirm the endpoint exists, and call
            if (route := routes.get(ep)) is not None:
                if (resp := await route(state, **params)) is not None:
                    # Pull the response apart
                    if (isinstance( resp, tuple ) or isinstance( resp, list )) and len(resp) == 2:
                        ep, resp = resp

                    # Handle based on type
                    if isinstance( resp, dict ):
                        await succ_js(state, ep, resp)
                    elif isinstance( resp, str ):
                        await fail_js(state, ep, resp)
                    else:
                        warnings.warn(f"Unknown response type: {type(resp)}")

            else:
                warnings.warn(f"Unknown endpoint: {ep}")

    except WebSocketDisconnect as e:
        pass


# We break this out because sometimes the generic loop might need specific variable context
async def process( state ):
    try:
        message_data = await state.sock.receive()
        if message_data['type'] != 'websocket.receive':
            print("Not a websocket message")
            return None, None, True

        # Pull the data type
        if 'text' in message_data:
            return await process_text_message(message_data['text'])

        elif 'bytes' in message_data:
            return await process_file_message(message_data['bytes'])

        else:
            warnings.warn(f"Unknown message type {message_data.keys()}")
            return None, None, True

    except WebSocketDisconnect as e:
        pass

    return None, None, True


async def process_text_message(txt):
    try:
        data = json.loads(txt)
        # print(data)
    except JSONDecodeError:
        warnings.warn("Invalid JSON")
        return None, None, False

    # Ensure the structure is expected
    if 'ep' not in data or 'params' not in data:
        warnings.warn("Invalid EP or no params")
        return None, None, False

    # Route
    return data['ep'], data['params'], False


async def process_file_message( bytes ):
    return 'file', { 'data': bytes }, False


# Helper functions
async def succ_js( state, ep, resp ):
    data = {
        'ep': ep,
        'succ': True,
        'resp': resp
    }
    data_json = json.dumps(data)
    try:
        await state.sock.send_text(data_json)

    except ConnectionClosedError as e:
        return
    except Exception as e:
        warnings.warn(f"Unknown exception: {e}")
        return


async def fail_js( state, ep, resp ):
    try:
        await state.sock.send_json({
            'ep': ep,
            'succ': False,
            'resp': resp
        })

    except ConnectionClosedError as e:
        return
    except Exception as e:
        warnings.warn(f"Unknown exception: {e}")
        return


async def send_bytes( state, data ):
    try:
        await state.sock.send_bytes(data)

    except ConnectionClosedError as e:
        return
    except Exception as e:
        warnings.warn(f"Unknown exception: {e}")
        return
