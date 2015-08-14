var request = require('request');
var connect = require('connect');
var http = require('http');
var async = require('async');
var fs = require('fs');
var app = connect();
var math = require('mathjs');
var prIn = require('./priceInput');

var baseCcy = prIn.ccys[0].slice(-3);
var ccys = function(){
  var arr = [];
  for(var i=0;i<prIn.ccys.length;i++){
    arr.push(prIn.ccys[i].slice(0,3));
  }
  return arr;
}();

function getYQL(pair){
  var endpoint = 'https://query.yahooapis.com/v1/public/yql?q=';
  var query = encodeURI('select * from yahoo.finance.xchange where pair in ("'+pair+'")');
  var options = '&format=json&diagnostics=true&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys&callback=';
  return endpoint+query+options;
}

function getCurrencyLayer(source, ccyArr, callback){
  var query = 'http://apilayer.net/api/live?access_key=fb04bf749e86ad9f5bc9747324fb2e24';
  var ccys = ccyArr.toString();
  query = query+source+ccys;

  request(query, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(null, JSON.parse(body));
    }
    else{
      callback(error, null);
    }
  });
}

function getSingleRate(pair, callback){

  var url = getYQL(pair);

  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      if(JSON.parse(body).query.results){
        callback(null, JSON.parse(body).query.results.rate);
      }else{
        callback(null, JSON.parse(body).query.results);
      }
    }
    else{
      callback(error, null);
    }
  });

}

function multiCall(){
  var result = [];
  for(var i=0;i<prIn.ccys.length;i++){
    result.push(function(callback){
      getSingleRate(prIn.ccys[i], callback);
    });
  }
  return result;
}

function getAllRates(res, callback){
  // try{
    async.series([
      function(cb){
        getSingleRate('USDCAD',cb);
      },
      function(cb){
        getSingleRate('EURUSD',cb);
      },
      function(cb){
        getSingleRate('GBPUSD',cb);
      },
      function(cb){
        getSingleRate('USDJPY',cb);
      },
      function(cb){
        getSingleRate('USDAUD',cb);
      },
      function(cb){
        getSingleRate('USDNZD',cb);
      },
      function(cb){
        getSingleRate('CHFUSD',cb);
      },
      function(cb){
        getSingleRate('USDHKD',cb);
      },
      function(cb){
        getSingleRate('USDSGD',cb);
      },
      function(cb){
        getSingleRate('USDSEK',cb);
      },
      function(cb){
        getSingleRate('USDDKK',cb);
      },
      function(cb){
        getSingleRate('USDPLN',cb);
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
/*  }catch(err){
    getCurrencyLayer(baseCcy, ccys, function(err, results){
      var solution = callback(results);
      //res.end(solution);
      res.end(JSON.stringify(solution));
    });
    // var solution = callback(null);
    // //res.end(solution);
    // res.end(JSON.stringify(solution));
  }*/
}

var df = [0.76834, 1.1111, 1.5623, 0.0080292,
      0.73325, 0.65749, 1.0227, 0.129010,
      0.71588, 0.117401, 0.14891, 0.26552];
var digits = [5, null, null, 7,
             5, 5, null, 6,
             5, 6, 6, 6];
//input: array of objects (array) and property name (string)
function parseProp(arr, prop){
  var valArr = [];
  for(var i=0; i<arr.length; i++){
    if(arr[i]){
      var value = math.eval(arr[i][prop]);
      df[i] = value;
    }else{
      var value = df[i];
    }
    valArr.push(value);
  }
  return valArr;
}

function rateInverse(rateArr){
  var inverse = [];
  for(var i=0;i<rateArr.length;i++){
    if(!digits[i]){
      inverse.push(rateArr[i]);
    }else{
      inverse.push( parseFloat((1/rateArr[i]).toFixed(digits[i])) );
    }
  }
  return inverse;
}

exports.getAllRates = getAllRates;
exports.parseProp = parseProp;
exports.rateInverse = rateInverse;

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