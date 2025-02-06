from typing import List, Literal, Optional

from pydantic import BaseModel
from schemas import PointInterest


class GetHomesSchema(BaseModel):
    pois : List[PointInterest]
    walk:float=0
    radius:float=0
    metro:Optional[float]=None
    response_format:Literal['shapefile','geojson'] = 'geojson'