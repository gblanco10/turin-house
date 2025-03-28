from pydantic import BaseModel
from shapely.geometry import Point


class GeoPoint(Point):
    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, v):
        if not isinstance(v,Point):
            if isinstance(v,list):
                return Point(*v)
            else:
                raise ValueError('point must be a shapely Point or a list of float')
        return v
    
    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(type="list")

class PointInterest(BaseModel):
    name:str
    point:GeoPoint
    tolerance:float
    walk: float

class BusRide(BaseModel):
    climb_code: int
    route: str
    direction: str
    descent_code: int
    distance: float
    n_stops: int

class Itinerary(BaseModel):
    walk_to:int = None
    bus:BusRide = None
    walk_for:int = None