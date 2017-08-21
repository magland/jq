#!/usr/bin/env nodejs

// Instructions:
// npm install connect serve-static
// nodejs start_server.js [port_number] [directory]
var connect = require('connect');
var args=process.argv.slice(2);
var listen_port=args[0]||8040;
var directory=args[1]||__dirname;
var serveStatic = require('serve-static');
connect().use(serveStatic(directory)).listen(listen_port, function(){
	console.log('Serving directory: '+directory);
    console.log('Server running on port '+listen_port+'...');
});
