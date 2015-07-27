var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http');
var fs = require('fs');
var app = connect();
var live = require('./js/backend/abc.js');

app.use("/public", serveStatic(__dirname + '/public'));

app.use('/home', function(req, res){
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
  live.getRates();
});

http.createServer(app).listen(3000);

console.log("Server start @ 3000 (HTTP)");