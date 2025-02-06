#!/bin/bash

wget https://www.gtt.to.it/open_data/gtt_gtfs.zip

unzip gtt_gtfs.zip -d gtt_gtfs_data

mkdir data

python utils/parse_route_directions.py \
--routes gtt_gtfs_data/routes.txt \
--stops gtt_gtfs_data/stops.txt \
--out data \
--name gtt_data