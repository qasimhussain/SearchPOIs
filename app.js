var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var Koa = require('koa');
var path = require('path');
var Geohash = require('latlon-geohash');
var Tree = require('prefix-tree');
var fs = require("fs");
var app = new Koa();

var contents = fs.readFileSync("locations.json");
var jsonContent = JSON.parse(contents);

let port = 3000;

// Logger
app.use(logger());

var tree = new Tree();

// Initializing tree with the JSON data of POIs
for (var i = 0; i < jsonContent.length; i++){
	tree.set(calculateHash(jsonContent[i].lng,jsonContent[i].lat),jsonContent[i],12);
}

/**
 * Displays all possible POIs.
 */
app.use(route.get('/all', (ctx, next) => {
  ctx.body = {
    jsonContent,
  };
}));

/**
 * Searches the provided with those of POIs.
 * @param {string} lng - The latitude of provided location.
 * @param {string} lat - The longitude of provided location.
 * @param {string} proximity - The proximity area of search.
 */
app.use(route.get('/search', (ctx, next) => {
	var srcLocationHash = calculateHash(ctx.query.lng, ctx.query.lat,ctx.query.proximity); 
	var result = matchPrefix(srcLocationHash);
	if (result.length == 0 )
		result = "No point of interest locations nearby";
  ctx.body = {

	"nearby": result,
  };

}));

/**
 * Matches the prefixes of Geohashes of location Provided with those of POIs.
 * @param {string} srcLocationHash - The Geohash of provided location.
 */
function matchPrefix(srcLocationHash) { 
	
   return tree.get(srcLocationHash); 
} 

/**
 * Calculates the Geohashes of Location Params.
 * @param {string} lng - The longitude of the Location .
 * @param {string} lat - The latitude of the Location.
 * @param {string} proximity - The proximity of the Location.
 */
function calculateHash(lng,lat,proximity) { 
	var hash = Geohash.encode(lng,lat,proximity);
	return hash; 
} 

app.use(serve(path.join(__dirname, 'public')));
app.use(compress());

console.log(`Starting server on ${port}!`);

app.listen(port);