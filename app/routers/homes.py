from typing import Dict

from fastapi import APIRouter, HTTPException
from fastapi.logger import logger

from pydantic.error_wrappers import ValidationError

from config import config
from errors import GenericErrorCodes

router = APIRouter(
    prefix=f"{config.api_prefix}/homes",
    tags=["homes"],
    responses={
                d.value[0]: {"description": d.value[1]} for d in GenericErrorCodes
            }
)


@router.get("/", response_model=Dict[str,str])
async def find_homes(
):
    try:
        return {"message": "Soon available!"}
    except ValidationError as e:
        logger.error(e)
        raise HTTPException(*GenericErrorCodes.VALIDATION.value)
    except Exception as e:
        logger.error(e)
        if isinstance(e,HTTPException):
            raise e
        raise HTTPException(*GenericErrorCodes.INTERNAL_SERVER_ERROR.value)