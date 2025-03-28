import json
from io import BytesIO

from config import config, data_store
from errors import GenericErrorCodes
from fastapi import APIRouter, HTTPException
from fastapi.logger import logger
from fastapi.responses import StreamingResponse
from functional.homes import get_homes_area
from pydantic.error_wrappers import ValidationError
from schemas.homes import GetHomesSchema
from shapely.ops import transform

router = APIRouter(
    prefix=f"{config.api_prefix}/homes",
    tags=["homes"],
    responses={
                d.value[0]: {"description": d.value[1]} for d in GenericErrorCodes
            }
)


@router.post("/")
async def find_homes(
    request: GetHomesSchema
):
    try:
        for poi in request.pois:
            poi.point = transform(data_store.wgs_to_utm, poi.point)
        result_df = get_homes_area(request.pois, request.metro)
        # TODO fix the shapefile response
        if request.response_format == 'shapefile':
            out_buffer = BytesIO()
            # Save the shapefile to the buffer
            result_df.to_file(out_buffer, driver='ESRI Shapefile')
            # Set the buffer's position to the beginning
            out_buffer.seek(0)
            # Return the shapefile as a streaming response
            return StreamingResponse(
                out_buffer,
                media_type='application/octet-stream',
                headers={"Content-Disposition": "attachment; filename=homes.shp"}
            )
        else:
            # Convert to geojson
            return json.loads(result_df.to_json())
    except ValidationError as e:
        logger.error(e)
        raise HTTPException(*GenericErrorCodes.VALIDATION.value)
    except Exception as e:
        logger.error(e)
        if isinstance(e,HTTPException):
            raise e
        raise HTTPException(*GenericErrorCodes.INTERNAL_SERVER_ERROR.value)