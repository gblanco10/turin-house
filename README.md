# TURIN-HOUSE

Our goal is to provide a convenient way for individuals to find the ideal neighborhood in Turin based on their unique public transportation needs. Our platform streamlines the process of locating the most suitable area by optimizing the search for the best public transportation services available. We are committed to enhancing the experience of navigating Turin's public transportation network by providing a comprehensive tool for locating neighborhoods that meet your specific criteria.

## Key Features

* Search of public transportation options to reach your POIs from your home

## How To Setup

First action is to setup the project environment, by creating a *.env* file in project root following the provided *env.template*

The following instructions are needed to setup the repo

```bash
# Clone this repository
$ git clone https://github.com/gblanco10/turin-house.git

# Go into the repository
$ cd turin-house

# Prepare GTT Data
$ bash prepare_data.sh

#Setup containers
$ docker-compose up --build
```


## Credits

This software uses the following open source data sources:

- [GTT Open Data](http://aperto.comune.torino.it/dataset/feed-gtfs-trasporti-gtt)

**Note**
This software uses both GTT open data and some information retrieved directly from GTT site using *utils/parse_route_directions.py*. If GTT routes have been changed recently, feel free to download and run again the script in order to use up to date information

## License

GNU General Public License v3.0

---

## Want to collaborate ? 
> GitHub [@gblanco10](https://github.com/gblanco10) &nbsp;&middot;&nbsp;
> Twitter [@giacomoblanco10](https://twitter.com/giacomoblanco10)

