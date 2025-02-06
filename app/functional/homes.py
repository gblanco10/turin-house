from typing import List

import geopandas as gpd
from config import data_store
from schemas import PointInterest
from shapely import intersection_all
from shapely.ops import unary_union


def get_homes_area(
        pois: List[PointInterest],
        radius: int,
        walk: int,
        metro: int = None,
):
    data = data_store.routes
    layers = []
    for poi in pois:
        arrival_mask = data['geometry'].distance(poi.point) < poi.tolerance
        arrival_data = data[arrival_mask].copy()
        routes_poly = unary_union(arrival_data['geometry'].apply(lambda x: x.buffer(radius)))
        routes_poly = routes_poly.union(poi.point.buffer(walk))
        layers.append(routes_poly)
    if metro is not None:
        metro_mask = data['Route'].apply(lambda x: "METRO" in x)
        metro_data = data[metro_mask].copy()
        metro_poly = unary_union(metro_data['geometry'].apply(lambda x: x.buffer(metro)))
        layers.append(metro_poly)
    result = intersection_all(layers)
    return gpd.GeoDataFrame(geometry=[result],crs=data.crs).to_crs('EPSG:4326')
    

