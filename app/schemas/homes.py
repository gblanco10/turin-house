from typing import List, Literal, Optional

from pydantic import BaseModel
from schemas import PointInterest


class GetHomesSchema(BaseModel):
    pois : List[PointInterest]
    metro:Optional[float]=None
    response_format:Literal['shapefile','geojson'] = 'geojson'