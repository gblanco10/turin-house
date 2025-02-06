from typing import List

from pydantic import BaseModel
from schemas import GeoPoint, PointInterest


class GetRoutesSchema(BaseModel):
    start:GeoPoint
    pois : List[PointInterest]
    walk:float=0
    radius:float=0