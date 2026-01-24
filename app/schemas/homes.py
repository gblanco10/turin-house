from typing import List, Literal, Optional

from pydantic import BaseModel
from schemas import PointInterest


class OSMPoisRequest(BaseModel):
    green_area:Optional[float]=None
    pharmacy:Optional[float]=None
    fitness_center:Optional[float]=None
    grocery:Optional[float]=None
class GetHomesSchema(BaseModel):
    pois : List[PointInterest]
    metro:Optional[float]=None
    osm: Optional[OSMPoisRequest]=None
    response_format:Literal['shapefile','geojson'] = 'geojson'