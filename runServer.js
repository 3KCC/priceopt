var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http');
var fs = require('fs');
var app = connect();
var bken = require('./js/backend/main.js');

app.use("/public", serveStatic(__dirname + '/public'));

app.use('/', function(req, res){
  //getAllRates(res);
    fs.readFile('./main.html', function(error, content) {
      if (error) {
        res.writeHead(500);
        res.end();
      }
      else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(content, 'utf-8');
      }
    });
});

app.use('/rate', function(req, res){
  //res.end(Date.now().toString());
  bken.optimize(res, bken.callback);
});

http.createServer(app).listen(5000);

console.log("Server start @ 5000 (HTTP)");