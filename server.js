// set up ======================================================================
var express = require('express');
var favicon = require('serve-favicon');
var app = express(); 						// create our app w/ express
var port = process.env.PORT || 9000; 				// set the port
var bodyParser = require('body-parser');
var morgan = require('morgan');
var methodOverride = require('method-override');
var fs = require('fs');
var accessLogStream = fs.createWriteStream(__dirname + '/simulator.log', {flags: 'a'})

// configuration ===============================================================
app.use(express.static(__dirname + '/public')); 		// set the static files location /public/img will be /img for users
app.use(morgan('tiny', {stream: accessLogStream})); // log every request to the file
app.use(bodyParser.urlencoded({'extended': 'true'})); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse application/vnd.api+json as json
app.use(methodOverride('X-HTTP-Method-Override')); // override with the X-HTTP-Method-Override header in the request

// routes ======================================================================
require('./server/routes.js')(app);

// listen (start app with node server.js) ======================================
app.listen(port);
console.log("App listening on port " + port);
