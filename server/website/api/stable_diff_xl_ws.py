from asgiref.sync import sync_to_async
from fastapi import WebSocket
from json import JSONDecodeError
from django.db.utils import IntegrityError
from website.helpers import ws, util, langchain
from website.models import Government, common, Claim, ClaimLegislation, Policy, Legislation

import io


class State(ws.WsState):
    def __init__(self, websocket: WebSocket):
        super().__init__( websocket )
        self.legislation_js = None
        self.vectorstore = None
        self.chain = None
        self.policy_chain = None

    def reset(self):
        self.legislation_js = None
        self.vectorstore = None
        self.chain = None
        self.policy_chain = None


async def chat_init(state: State, legislation_uid: str ):
    from django.conf import settings

    # Clean out any existing content
    legislation = await sync_to_async( Legislation.getByUid )( legislation_uid )

    # Setup the langchain
    state.legislation_js = legislation.toJson()

    # Load the vectorstore
    print("Loading vector store")
    state.vectorstore = await sync_to_async( langchain.inline_vectorstore )( state.legislation_js['cleaned_txt'], settings.OPENAI_API_KEY )
    print("Vector store loaded")
    state.chain = await sync_to_async( langchain.load_chain )( settings.MODEL_NAME, state.vectorstore, settings.OPENAI_API_KEY )
    state.policy_chain = await sync_to_async( langchain.load_chain )( settings.MODEL_NAME, state.vectorstore, settings.OPENAI_API_KEY )
    print("Chain loaded")

    return 'chat_ready', {}


async def chat_query(state: State, question: str ):
    response = state.chain({"question": question})["answer"]
    return 'chat_response', { 'response': response }

async def chat_policy(state: State):
    policy = await sync_to_async( Policy.objects.first )()

    claims_qs = await sync_to_async( policy.claim_set.all )()
    claims = await sync_to_async( list )( claims_qs )

    for claim in claims:
        response = state.policy_chain({"question": claim.query_claim})["answer"]
        await ws.succ_js( state, 'chat_policy', { 'claim': claim.toJson(), 'response': response })


### Websocket endpoints

async def ws_entry(websocket: WebSocket):
    await ws.generic_loop( websocket, {
        'chat_init': chat_init,
        'chat_query': chat_query,
        'chat_policy': chat_policy,

        'on_close': lambda state: state.close(),
    }, State)
