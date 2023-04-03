from pathlib import Path
from pydantic import BaseSettings,validator

import pandas as pd 

import pyproj

from common import get_stop_positions

class Config(BaseSettings):

    log_level:str = "INFO"

    api_prefix:str = ""
    api_secret:str

    data_root:Path = Path("/data")
    stops_path:Path = Path("stops.txt")
    dirs_path:Path = Path("routes_dir.csv")

    @validator('api_prefix')
    def api_prefix_must_start_with_slash(cls,v):
        if v!= "" and not v.startswith('/'):
            return f'/{v}'
        return v
    
    @validator('data_root')
    def parse_root(cls,v):
        if type(v) == str:
            return Path(v)
        return v

class DataStore():
    def __init__(self, cfg:Config):
        self.stops = pd.read_csv(cfg.data_root / cfg.stops_path)
        self.dirs = pd.read_csv(cfg.data_root / cfg.dirs_path)
        self.dirs['Stop codes'] = self.dirs['Stop codes'].apply(lambda x: x.replace('[','').replace(']','').replace('\'',"").replace("\n","").split(" "))
        self.dirs['Stop positions'] = self.dirs['Stop codes'].apply(lambda x: get_stop_positions(x,self.stops))

        wgs84 = pyproj.CRS('EPSG:4326')
        utm = pyproj.CRS('EPSG:32618')
        
        self.wgs_to_utm = pyproj.Transformer.from_crs(wgs84, utm, always_xy=True).transform
        self.utm_to_wgs = pyproj.Transformer.from_crs(utm, wgs84, always_xy=True).transform


config = Config()

data = DataStore(config)