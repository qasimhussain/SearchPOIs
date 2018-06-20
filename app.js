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

// then prepare the data using 
for (var i = 0; i < jsonContent.length; i++){
	tree.set(calculateHash(jsonContent[i].lng,jsonContent[i].lat),jsonContent[i],12);
}

app.use(route.get('/all', (ctx, next) => {
  ctx.body = {
    jsonContent,
  };
}));

app.use(route.get('/search', (ctx, next) => {
	var srcLocationHash = calculateHash(ctx.query.lng, ctx.query.lat,ctx.query.proximity); 
	var result = matchPrefix(srcLocationHash);
	if (result.length == 0 )
		result = "No point of interest locations nearby";
  ctx.body = {

	"nearby": result,
  };

}));

function matchPrefix(srcLocationHash) { 
	
   return tree.get(srcLocationHash); 
} 

function calculateHash(lng,lat,proximity) { 
	var hash = Geohash.encode(lng,lat,proximity);
	return hash; 
} 

// Serve static files
app.use(serve(path.join(__dirname, 'public')));
app.use(compress());

console.log(`Starting server on ${port}!`);

app.listen(port);