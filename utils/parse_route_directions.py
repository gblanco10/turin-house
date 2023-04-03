from urllib.request import urlopen, Request
import bs4
import pandas as pd
import re
from argparse import ArgumentParser
from tqdm import tqdm 
import numpy as np

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.54 Safari/537.36"
}

parser = ArgumentParser("Parse route directions from GTT website and output csv file")

parser.add_argument('--routes','-r',help='Path to routes files',type=str,required=True,dest='ROUTES')
parser.add_argument("--out",type=str,dest='OUT')

args = parser.parse_args()

routes_df = pd.read_csv(args.ROUTES)
routes_df = routes_df[routes_df['agency_id'] == 'U']

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
        directions.append({
            'Route':row['route_id'],
            'Direction':dir_name,
            "Stop codes":np.array([str(c) for c in stop_codes])
        })

pd.DataFrame(directions).to_csv(f"{args.OUT}.csv",index=False)