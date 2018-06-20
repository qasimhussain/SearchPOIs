# SearchPOIs
An http based REST API that allows to search in a collection of POIs

# Approach
The first thing that I did was to get data by using an API(http://tour-pedia.org/api/). I created a json file by using this data which is used as a sample in my app. I then used a library(https://github.com/chrisveness/latlon-geohash) to calculate geohash from a given longitude and latitude. I was able to get the hashes of neighbours from this library so initially I was checking if the list that I have of my neighbours contains the POI. I figured out that it’s a complex approach and rather can be solved in a very simple way. I then thought of prefix matching approach. I stored all the POIs in a tree and used prefix matching to calculate which POI is nearby me which gave me an additional advantage of getting the proximity of my neighbours, i.e., how close or far I can search for a POI(bound-box requirement).

# Suggestion:
In order to cater POIs of different types:
I will take category in the request along with the longitude,latitude and proximity and then can search in that particular category.
This way the tree approach that I am using can be used to load only the structure of that particular category.
