var request = require('request');
var connect = require('connect');
var http = require('http');
var async = require('async');
var fs = require('fs');
var app = connect();
var math = require('mathjs');

function getYQL(pair){
  var endpoint = 'https://query.yahooapis.com/v1/public/yql?q=';
  var query = encodeURI('select * from yahoo.finance.xchange where pair in ("'+pair+'")');
  var options = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
  return endpoint+query+options;
}

function getSingleRate(pair, callback){

  var url = getYQL(pair);

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(null, JSON.parse(body).query.results.rate);
    }
    else{
      callback(error, null);
    }
  });

};

function getAllRates(res, callback){
  async.series([
    function(callback){
      getSingleRate('AUDMYR',callback);
    },
    function(callback){
      getSingleRate('EURMYR',callback);
    },
    function(callback){
      getSingleRate('GBPMYR',callback);
    },
    function(callback){
      getSingleRate('JPYMYR',callback);
    },
    function(callback){
      getSingleRate('SGDMYR',callback);
    },
    function(callback){
      getSingleRate('USDMYR',callback);
    }
  ], function(err, results){
    if (err){
      console.log('err',err);
    }
    else{
      var solution = callback(results);
      //res.end(solution);
      res.end(JSON.stringify(solution));
    }
  });
};

//input: array of objects (array) and property name (string)
function parseProp(arr, prop){
  var valArr = [];
  for(var i=0; i<arr.length; i++){
    var value = math.eval(arr[i][prop]);
    valArr.push(value);
  }
  return valArr;
}

exports.getAllRates = getAllRates;
exports.parseProp = parseProp;

/*app.use('/rate', function(req, res){
  //res.end(Date.now().toString());
  getAllRates(res);
});

app.use('/', function(req, res){
  //getAllRates(res);
  fs.readFile('./index.html', function(error, content) {
    if (error) {
      res.writeHead(500);
      res.end();
    }
    else {
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(content, 'utf-8');
    }
  });
});*/

//http.createServer(app).listen(3000);
//console.log("Server start @ 3000 (HTTP)");