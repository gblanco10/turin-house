from typing import Dict

from fastapi import APIRouter, HTTPException
from fastapi.logger import logger

from pydantic.error_wrappers import ValidationError
from shapely.ops import transform


from config import config, data
from schemas import Itinerary
from schemas.routes import GetRoutesSchema
from errors import GenericErrorCodes
from common import get_poi_links

router = APIRouter(
    prefix=f"{config.api_prefix}/routes",
    tags=["routes"],
    responses={
                d.value[0]: {"description": d.value[1]} for d in GenericErrorCodes
            }
)


@router.post("/", response_model=Dict[str, Itinerary])
async def find_routes(
    home: GetRoutesSchema
):
    try:
        start_area = transform(data.utm_to_wgs, transform(data.wgs_to_utm, home.start).buffer(home.radius))
        return get_poi_links(
            home_point=home.start,
            home_area=start_area,
            routes = data.dirs,
            pois = home.pois
        )
    except ValidationError as e:
        logger.error(e)
        raise HTTPException(*GenericErrorCodes.VALIDATION.value)
    except Exception as e:
        logger.error(e)
        if isinstance(e,HTTPException):
            raise e
        raise HTTPException(*GenericErrorCodes.INTERNAL_SERVER_ERROR.value)