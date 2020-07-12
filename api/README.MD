# Covid Hexaland: API 
## Overview

This is an [Express](https://expressjs.com/) application to serve APIs for Hexaland. This app uses the power and flexibility of typescript.

## Abilities
- Ability to gather all hexagons and their connections present in a cluster
- Ability to view a single hexagon details
- Ability to add a new hexagon in the given cluster
- Ability to remove an existing hexagon from the given cluster

**Note:**
Hexagons can not be removed from the cluster if it's the ONLY connecting hexagon between two hotspots.

## Shortcomings
- It can not determine neighboring hotspots with 100% accuracy while adding a new hexagon to cluster
- Yet to write unit tests

## Setup
Install yarn globally:
```bash
npm install -g yarn
```

Install all dependencies by running the following command in root directory:
```bash
npm install
```

## How to run?
To run server in production environment (server will run on port 8081):

```bash
yarn start
```

To run server in development environment (allows developer to use server reload on code change):
```bash
yarn start:dev
```

To run server in debug mode (allows to attach a debugger to application):
```bash
yarn start:dev:debug
```

You can also build javascript from typescript code using:
```bash
yarn build
```


## APIs
* QueryAll
  * `GET` /api/hexagon
  * Provides a list of hotspots present in the cluster
* Query (Lookup API)
  * `GET` /api/hexagon/:name
  * Provide details of a single hotspot by passing hotspot name
* Add
  * `POST` /api/hexagon
  * Body: ```{
    "name": "<new_hotspot_name>",
    "neighbor": "<neighbor name>",
    "border": <border_number>
    }```
  * Allows to add new hotspot to cluster
* Remove
  * `DELETE` /api/hexagon/:name
  * Removes mentioned hotspot from cluster

