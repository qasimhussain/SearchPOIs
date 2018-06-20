# SearchPOIs
An http based REST API that allows to search in a collection of POIs

# Approach
The first thing that I did was to get data by using a public API. I created a json file by using this data which is used as a sample in my app. I then used a library 'latlon-geohash' to calculate geohash for a given longitude and latitude.My Initial approach was to get the geohashes of the neighbours (of the location provided) via this library and to check if the list of POIs matches with those of my neighbours. However, I soon figured out that it’s a complex approach and hashes might not be exactly the same anyways. I then thought of prefix matching approach via tree. I stored all the POIs in a tree and used prefix matching to calculate which POI is nearby me which gave me the proximity of my neighbours, i.e., how close or far I can search for a POI(bound-box requirement).

# Suggestion:
In order to cater POIs of different types:
I will take category in the request along with the longitude,latitude and proximity and then can search in that particular category.
This way the tree approach that I am using can be used to load only the structure of that particular category.

# Setup
```npm install```

```node app.js```

# Examples
http://127.0.0.1:3000/all
- Displays all possible POIs

http://127.0.0.1:3000/search?lng=13.404575&lat=52.523055&proximity=5
- Searches the provided location parameters with those of POIs, along with proximity of the bounding box.

# References
For location data of POIs, I used :
http://tour-pedia.org/api/

For calculating geohash of locations: 
https://github.com/chrisveness/latlon-geohash)
