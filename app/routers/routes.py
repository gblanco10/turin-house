from typing import Dict, List

from config import config, data_store
from errors import GenericErrorCodes
from fastapi import APIRouter, HTTPException
from fastapi.logger import logger
from functional.routes import get_itineraries, get_routes_to_poi
from pydantic.error_wrappers import ValidationError
from schemas import Itinerary
from schemas.routes import GetRoutesSchema
from shapely.ops import transform

router = APIRouter(
    prefix=f"{config.api_prefix}/routes",
    tags=["routes"],
    responses={
                d.value[0]: {"description": d.value[1]} for d in GenericErrorCodes
            }
)


@router.post("/", response_model=Dict[str, List[Itinerary]])
async def find_routes(
    route: GetRoutesSchema
):
    try:
        start_point = transform(data_store.wgs_to_utm, route.start)
        for poi in route.pois:
            poi.point = transform(data_store.wgs_to_utm, poi.point)
        poi_routes = {poi.name : get_routes_to_poi(start_point, route.radius, poi) for poi in route.pois}
        return {poi_name : get_itineraries(poi_route) for poi_name, poi_route in poi_routes.items()}
    except ValidationError as e:
        logger.error(e)
        raise HTTPException(*GenericErrorCodes.VALIDATION.value)
    except Exception as e:
        logger.error(e)
        if isinstance(e,HTTPException):
            raise e
        raise HTTPException(*GenericErrorCodes.INTERNAL_SERVER_ERROR.value)