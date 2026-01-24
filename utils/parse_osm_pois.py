from argparse import ArgumentParser
from pathlib import Path

import geopandas as gpd
import overpy
from shapely.geometry import LineString, Point, Polygon

parser = ArgumentParser("Parse OSM POIs and output geojson file")
parser.add_argument('--out',type=Path,help='Output folder',dest='OUT')
parser.add_argument('--input',type=Path,help='Name of input folder',dest='INPUT')

args = parser.parse_args()

args.OUT.mkdir(parents=True,exist_ok=True)

api = overpy.Overpass()

if args.INPUT.is_dir():
    files = list(args.INPUT.iterdir())
else:
    files = [args.INPUT]

for query_file in files:
    with open(query_file,'r') as f:
        query = f.read()
    query_name = query_file.stem
    print(f"Processing query: {query_name}")
    result = api.query(query)
    nodes2geo = {}
    df = []
    for node in result.nodes:
        node_id = node.id
        node_tags = node.tags
        node_geometry = Point(node.lon,node.lat)
        if node.id not in nodes2geo:
            nodes2geo[node.id] = node_geometry
        df.append({
            "id": node_id,
            "tags": node_tags,
            "geometry": node_geometry
        })
    for way in result.ways:
        way_id = way.id
        way_tags = way.tags
        way_nodes = way.nodes
        try:
            way_geometry = Polygon([nodes2geo[node.id] for node in way_nodes if node.id in nodes2geo])
        except Exception as e:
            way_geometry = LineString([nodes2geo[node.id] for node in way_nodes if node.id in nodes2geo])
        df.append({
            "id": way_id,
            "tags": way_tags,
            "geometry": way_geometry
        })
    gdf = gpd.GeoDataFrame(df, geometry="geometry", crs="EPSG:4326")
    gdf.to_file(args.OUT / f"{query_name}.geojson", driver="GeoJSON")


print("Done.")