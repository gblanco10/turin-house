from typing import List, Dict
import pyproj
from shapely.ops import transform
from shapely.geometry import Point, Polygon
import pandas as pd
from operator import itemgetter
from collections import defaultdict

from schemas import PointInterest, Itinerary, BusRide

def get_stop_positions(
        stop_codes : List[str],
        stops_df:pd.DataFrame
) -> List[Point] :
    """
        Get coordinates of bus stops according to their codes
        Args:
            stop_codes (List[str]): list of stop codes
            stops_df (pd.DataFrame): dataframe containing all stops
    """
    positions = []
    for stop in stop_codes:
        stop_row = stops_df[stops_df['stop_code'] == stop].iloc[0]
        positions.append(Point(stop_row['stop_lon'],stop_row['stop_lat']))
    return positions


def point_distance(
        pA:Point,
        pB:Point,
        project=None
)-> float :
    """
        Compute distance between two points
        Args:
            pA (Point): first point
            pB (Point): second point
            project (function): function to project points to a plane, if not specified, assumes points are in ESPG:4326
    """
    if not project:
        wgs84 = pyproj.CRS('EPSG:4326')
        utm = pyproj.CRS('EPSG:32618')
        project = pyproj.Transformer.from_crs(wgs84, utm, always_xy=True).transform
    return transform(project, pA).distance(transform(project, pB))

def get_poi_links(
        home_point:Point,
        home_area:Polygon,
        routes:pd.DataFrame,
        pois:List[PointInterest],
) -> Dict[str, Itinerary]:
    """
        Compute itineraries from home to all pois
        Args:
            home_position (dict): home position
            routes (pd.DataFrame): dataframe containing all routes
            pois (List[PointInterest]): list of pois
    """
    # Get the routes passing near the home
    near_routes = routes[routes['Stop positions'].apply(lambda stops_pos: any([home_area.contains(x) for x in stops_pos]) )]
    if len(near_routes) == 0:
        return []
    # compute routes from home position to all pois
    out = defaultdict(list)
    for poi in pois:
        for _, row in near_routes.iterrows():
            home_stop_distances = [ point_distance(x,home_point) for x in row['Stop positions'] ]
            closest_home_idx, home_dist = min(enumerate(home_stop_distances), key=itemgetter(1))
            
            poi_stop_distances = [ point_distance(x,poi.point) for x in row['Stop positions']]
            closest_poi_idx, poi_dist = min(enumerate(poi_stop_distances), key=itemgetter(1))

            if closest_home_idx >= closest_poi_idx:
                continue
            if poi_dist >= poi.tolerance:
                continue
            out[poi.name].append(
                Itinerary(
                    walk_to=home_dist,
                    bus=BusRide(
                        climb_code=row['Stop codes'][closest_home_idx],
                        route = row['Route'],
                        direction = row['Direction'],
                        descent_code=row['Stop codes'][closest_poi_idx],
                        distance=point_distance(row['Stop positions'][closest_home_idx],row['Stop positions'][closest_poi_idx]),
                        n_stops=closest_poi_idx - closest_home_idx
                    ),
                    walk_for=poi_dist
                )
            )
        home_to_poi = point_distance(poi.point,home_point )
        if home_to_poi <= poi.tolerance:
            out[poi.name].append(
                Itinerary(
                    walk_to=home_to_poi
                )
            )
        return out