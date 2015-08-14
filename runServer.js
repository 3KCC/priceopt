var connect = require('connect');
var serveStatic = require('serve-static');
var http = require('http');
var fs = require('fs');
var url = require('url');
var app = connect();
var bken = require('./js/backend/main.js');

var wwwhisper = require('connect-wwwhisper');
// app holds a reference to express or connect framework, it
// may be named differently in your source file.
app.use(wwwhisper());

app.use("/public", serveStatic(__dirname + '/public'));

app.use('/settings', function(req, res){
    //getAllRates(res);
    fs.readFile('./settings.html', function(error, content) {
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

app.use('/', function(req, res){
  //getAllRates(res);
  
    var url = require('url');
    var url_parts = url.parse(req.url, true);
    console.log(req.url);
    console.log(JSON.stringify(url_parts));
    var query = url_parts.pathname;

    console.log(query);

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

var port = process.env.PORT || 5000;

http.createServer(app).listen(port);

console.log('Server start @ '+port+' (HTTP)');