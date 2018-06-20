var compress = require('koa-compress');
var logger = require('koa-logger');
var serve = require('koa-static');
var route = require('koa-route');
var Koa = require('koa');
var path = require('path');
var Geohash = require('latlon-geohash');
var fs = require("fs");
var app = new Koa();

var contents = fs.readFileSync("locations.json");
var jsonContent = JSON.parse(contents);

let port = 3000;

// Logger
app.use(logger());

app.use(route.get('/all', (ctx, next) => {
  ctx.body = {
    jsonContent,
  };
}));

app.use(route.get('/hash', (ctx, next) => {
	var srcLocationHash = Geohash.encode(ctx.query.lng, ctx.query.lat,6); 
	var neighbourLocationHash =  Geohash.neighbours(srcLocationHash);
  ctx.body = {

    "hash": srcLocationHash,
	"neighbours": neighbourLocationHash,
	"list": matchNeighbours(srcLocationHash,neighbourLocationHash),
  };
}));

function matchNeighbours(srcLocationHash,neighbourLocationHash) { 
	
	var list = [];
	for (var i = 0; i < jsonContent.length; i++){
		var object = jsonContent[i];
		for(var key in neighbourLocationHash){
			var hash = calculateHash(object.lng,object.lat)
			if (hash.localeCompare(neighbourLocationHash[key])){
				console.log("compairing", neighbourLocationHash[key]);
				console.log("with" , hash);
				console.log("---------");
				list.push(object);
				break;
			}
		}
	}
   return list; 
} 

function calculateHash(lng,lat) { 
	
   return Geohash.encode(lng,lat,9); 
} 

// Serve static files
app.use(serve(path.join(__dirname, 'public')));
app.use(compress());

console.log(`Starting server on ${port}!`);
console.log("Name:", jsonContent[0].name);

app.listen(port);