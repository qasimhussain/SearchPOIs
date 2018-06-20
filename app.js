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
	tree.set(calculateHash(jsonContent[i].lat,jsonContent[i].lng),jsonContent);
}

app.use(route.get('/all', (ctx, next) => {
  ctx.body = {
    jsonContent,
  };
}));

app.use(route.get('/hash', (ctx, next) => {
	var srcLocationHash = Geohash.encode(ctx.query.lng, ctx.query.lat); 
  ctx.body = {

    "hash": srcLocationHash,
	"list": matchNeighbours(srcLocationHash),
  };
}));

function matchNeighbours(srcLocationHash) { 
	
   return tree.get(srcLocationHash); 
} 

function calculateHash(lng,lat) { 
	
   return Geohash.encode(lng,lat); 
} 

// Serve static files
app.use(serve(path.join(__dirname, 'public')));
app.use(compress());

console.log(`Starting server on ${port}!`);

app.listen(port);