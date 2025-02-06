import pandas as pd
from config import data_store
from schemas import BusRide, Itinerary, PointInterest
from shapely.geometry import Point


def closest_stop(route,geom):
    distances = [Point(stop).distance(geom) for stop in route.coords]
    dis = min(distances)
    return distances.index(dis), dis

def get_routes_to_poi(
        start_point:Point,
        radius:int,
        poi:PointInterest
):
    data = data_store.routes
    
    arrival_mask = data['geometry'].distance(poi.point) < poi.tolerance
    arrival_data = data[arrival_mask].copy()
    arrival_data['stop_ix'], arrival_data['walk'] = zip(*arrival_data['geometry'].apply(closest_stop, args=(poi.point,)))
    
    departing_mask = data['geometry'].intersects(start_point.buffer(radius))
    departing_data = data[departing_mask].copy()
    departing_data['stop_ix'], departing_data['walk'] = zip(*departing_data['geometry'].apply(closest_stop, args=(start_point,)))
    
    cross_data = arrival_data.merge(departing_data,on=['id','Route','Direction','geometry'],suffixes=('_arrival','_departing'),how='inner',copy=True)
    cross_data = cross_data[cross_data['stop_ix_arrival'] > cross_data['stop_ix_departing']]
    cross_data.drop(columns=['Stop codes_departing'],inplace=True)
    cross_data.rename(columns={'Stop codes_arrival':'Stop codes'},inplace=True)

    start_to_poi = poi.point.distance(start_point)
    if start_to_poi <= poi.tolerance:
        walk_row = pd.DataFrame([{
            "Route":"WALK",
            "walk_departing":start_to_poi,
        }])
        cross_data = pd.concat([cross_data,walk_row],ignore_index=True)
    
    return cross_data

def get_itineraries(
        routes
):
    itineraries = []
    for _, row in routes.iterrows():
        if row['Route'] == "WALK":
            itineraries.append(
                Itinerary(
                    walk_to=row['walk_departing']
                )
            )
        else:
            itineraries.append(
                Itinerary(
                    walk_to=row['walk_departing'],
                    bus=BusRide(
                        climb_code=row['Stop codes'][row['stop_ix_departing']],
                        route=row['Route'],
                        direction=row['Direction'],
                        descent_code=row['Stop codes'][row['stop_ix_departing']],
                        distance= Point(row['geometry'].coords[row['stop_ix_departing']]).distance(Point(row['geometry'].coords[row['stop_ix_arrival']])) ,
                        n_stops=row['stop_ix_arrival'] - row['stop_ix_departing']
                    ),
                    walk_for=row['walk_arrival']
                )
            )
    return itineraries