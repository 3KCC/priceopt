var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http');
var fs = require('fs');
var app = connect();

app.use("/public", serveStatic(__dirname+ '/public'));

app.use('/', function(req, res){
  //getAllRates(res);
  fs.readFile('./main.html', function(error, content) {
    if (error) {
      console.log(error);
      res.writeHead(500);
      res.end();
    }
    else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    }
  });
});

http.createServer(app).listen(3000);

console.log("Server start @ 3000 (HTTP)");