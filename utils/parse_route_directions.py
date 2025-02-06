import re
from argparse import ArgumentParser
from pathlib import Path
from typing import List
from urllib.request import Request, urlopen

import bs4
import geopandas as gpd
import pandas as pd
from shapely.geometry import LineString, Point
from tqdm import tqdm


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
    return LineString(positions)

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36"
}

parser = ArgumentParser("Parse route directions from GTT website and output csv file")

parser.add_argument('--routes','-r',help='Path to GTT routes files',type=Path,required=True,dest='ROUTES')
parser.add_argument('--stops','-s',help='Path to GTT stops files',type=Path,required=True,dest='STOPS')
parser.add_argument('--out',type=Path,help='Output folder',dest='OUT')
parser.add_argument('--name',type=str,help='Name of output file',dest='NAME')

args = parser.parse_args()

routes_df = pd.read_csv(args.ROUTES)
routes_df = routes_df[routes_df['agency_id'] == 'U']
stops = pd.read_csv(args.STOPS)


directions = []

for index,row in tqdm(routes_df.iterrows()):
    route = row['route_id'].replace('U','')
    route_url = row['route_url']
    # Fetch route url to get route directions
    req = Request(url=route_url, headers=headers)
    html = urlopen(req, timeout=15).read()
    html = html.decode('utf-8')
    soup = bs4.BeautifulSoup(html, features="lxml")
    links = [link for link in soup.find_all(href=re.compile(f'view=percorso&bacino=U&linea={route}'))]
    direction_names = [link.text.strip() for link in links]
    direction_urls = [link.get('href') for link in links]
    for dir_name,dir_link in zip(direction_names,direction_urls):
        # Fetch route direction page to get stops ids
        req = Request(url=f"https://www.gtt.to.it{dir_link}", headers=headers)
        html = urlopen(req, timeout=15).read()
        html = html.decode('utf-8')
        soup = bs4.BeautifulSoup(html, features="lxml")
        table = soup.find("table")
        stop_codes =  pd.read_html(str(table))[0]['Fermata'].values.tolist()
        d = {
            'Route':row['route_id'],
            'Direction':dir_name,
            "Stop codes":[str(c) for c in stop_codes]
        }
        d["Stop positions"] = get_stop_positions(d['Stop codes'],stops)
        directions.append(d)

dir_df = pd.DataFrame(directions)

gdf = gpd.GeoDataFrame(dir_df, geometry='Stop positions')

gdf_dump = gdf.to_json()

args.OUT.mkdir(parents=True,exist_ok=True)

with open(str(args.OUT / f"{args.NAME}.geojson"), 'w', encoding='utf-8') as file:
    file.write(gdf_dump)

print("Done")