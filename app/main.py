from fastapi import FastAPI,Security
from fastapi.middleware.cors import CORSMiddleware

import logging
from fastapi.logger import logger

from security import api_key_auth
from config import config
from routers import homes, routes

app = FastAPI(
                docs_url=f'{config.api_prefix}/docs',
                redoc_url=f'{config.api_prefix}/redoc',
                openapi_url=f'{config.api_prefix}/openapi.json'
            )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gunicorn_logger = logging.getLogger('gunicorn.error')
logger.handlers = gunicorn_logger.handlers
logger.setLevel(config.log_level)


app.include_router(homes.router,dependencies=[Security(api_key_auth)])
app.include_router(routes.router,dependencies=[Security(api_key_auth)])