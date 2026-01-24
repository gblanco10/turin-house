from typing import List

import geopandas as gpd
from config import data_store
from schemas import PointInterest
from shapely import intersection_all
from shapely.geometry import LineString, Point, Polygon
from shapely.ops import unary_union


def get_linestring_points(
        line:LineString
) -> List[Point]:
    """
    Get points from a LineString.
    :param line: LineString
    :return: List of points
    """
    return list(line.coords)

def get_line_portion(
        line:LineString,
        area:Polygon,
        pois:List[PointInterest]
) -> LineString:
    """
    Get portion of a LineString that is within a Polygon.
    :param
    line: LineString
    :param area: Polygon
    :return: LineString
    """
    try:
        line_points = get_linestring_points(line)
        # take line points in home area
        area_points_bool = [ area.contains(Point(p)) for p in line_points]
        # take line points near any poi
        pois_points_bool = [ any([Point(x).distance(poi.point) < poi.tolerance for poi in pois]) for x in line_points]
        # line must have at least one point in area and one point near poi
        if True not in area_points_bool or True not in pois_points_bool:
            return None
        # take first point close to either home or poi
        first_point_idx = min(area_points_bool.index(True), pois_points_bool.index(True))
        # take last point close to either home or poi
        last_point_idx = max(
            len(line_points) - area_points_bool[::-1].index(True) - 1 if True in area_points_bool else -1,
            len(line_points) - pois_points_bool[::-1].index(True) - 1 if True in pois_points_bool else -1
        )
        return LineString(line_points[first_point_idx:last_point_idx+1])
    except Exception as e:
        return None

def get_homes_area(
        pois: List[PointInterest],
        metro: int = None,
):
    data = data_store.routes
    layers = []
    for poi in pois:
        arrival_mask = data['geometry'].distance(poi.point) < poi.tolerance
        arrival_data = data[arrival_mask].copy()
        routes_poly = unary_union(arrival_data['geometry'].apply(lambda x: x.buffer(poi.walk)))
        routes_poly = routes_poly.union(poi.point.buffer(poi.walk))
        layers.append(routes_poly)
    if metro is not None and metro > 0:
        metro_mask = data['Route'].apply(lambda x: "METRO" in x)
        metro_data = data[metro_mask].copy()
        metro_poly = unary_union(metro_data['geometry'].apply(lambda x: x.buffer(metro)))
        layers.append(metro_poly)
    result = intersection_all(layers)
    lines = data.copy()
    lines.drop(columns=["Stop codes"], inplace=True)
    lines = lines[lines['geometry'].intersects(result)]
    lines["geometry"] = lines['geometry'].apply(lambda x: get_line_portion(x, result, pois))
    lines = lines[lines['geometry'].is_empty == False]
    # TODO if metro is selected show it anyway
    return gpd.GeoDataFrame(geometry=[result],crs=data.crs).to_crs('EPSG:4326'), lines.to_crs('EPSG:4326')
    

