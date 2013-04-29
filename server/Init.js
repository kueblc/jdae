/* Init.js
 * written by Colin Kuebler 2013
 * Entry point for the JDAE server
 */

var log = require('./Logger.js').log('JDAE'),
	server = require('./WebServer.js'),
	PS = require('./PS.js');

// where the server is being hosted
var HOST = undefined,
	PORT = 8124;

// serve static files
var PATH = './client/',
	STATIC = [
		'favicon.ico',
		'index.html',
		'style.css',
		'dwav.js',
		'led.js',
		'jdae.js',
		'ps.js'
	];

for( var i = 0; i < STATIC.length; ++i )
	server.serve( PATH, STATIC[i] );

// serve the API
server.post( 'ps', PS.requestHandler );

// start the server!
server.init( HOST, PORT );

