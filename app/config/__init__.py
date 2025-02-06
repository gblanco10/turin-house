from pathlib import Path

import geopandas as gpd
import pyproj
from fastapi.logger import logger
from pydantic import BaseSettings, validator


class Config(BaseSettings):

    log_level:str = "INFO"

    api_prefix:str = ""
    api_secret:str

    data_path:Path = Path("/data/gtt_data.geojson")

    @validator('api_prefix')
    def api_prefix_must_start_with_slash(cls,v):
        if v!= "" and not v.startswith('/'):
            return f'/{v}'
        return v
    
    @validator('data_path')
    def parse_root(cls,v):
        if type(v) == str:
            return Path(v)
        return v

class DataStore():
    def __init__(self, cfg:Config):

        wgs84 = pyproj.CRS('EPSG:4326')
        utm = pyproj.CRS('EPSG:32632')
        
        self.wgs_to_utm = pyproj.Transformer.from_crs(wgs84, utm, always_xy=True).transform
        self.utm_to_wgs = pyproj.Transformer.from_crs(utm, wgs84, always_xy=True).transform

        logger.info("Loading data")
        self.routes = gpd.read_file(cfg.data_path).to_crs(crs=utm)
        logger.info("Loading data completed")

config = Config()

data_store = DataStore(config)