var _ = require('underscore');
var u = require('./utilities');
var request = require('request');
var connect = require('connect');
var http = require('http');
var async = require('async');
var fs = require('fs');
var app = connect();

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

function getRates(){
  async.series([
    function(callback){
      getSingleRate('USDMYR',callback);
    },
    function(callback){
      getSingleRate('EURMYR',callback);
    },
    function(callback){
      getSingleRate('GBPMYR',callback);
    },
    function(callback){
      getSingleRate('AUDMYR',callback);
    },
    function(callback){
      getSingleRate('SGDMYR',callback);
    },
    function(callback){
      getSingleRate('JPYMYR',callback);
    }
  ], function(err, results){
    if (err){
      console.log('err',err);
    }
    else{
      var rateArr = [];
      for(var i=0; i<results.length; i++){
        rateArr.push(parseFloat(results[i].Rate));
      }
      market = rateArr;
      markToMarket = _.reduce(u.sumArr(market,u.xNumArr(cost, -1)),
						function(memo, num){
							return memo + num;
						});
      b = u.sumArr(upperBound,u.xNumArr(market, -1));
      targetResidues = targetProfit - markToMarket;
      avgR = targetResidues / numOfCcy;
      oneTo12 = itemToArr([avgR], numOfCcy*2);
      p = function(){
				var result = oneTo12.concat([ [targetResidues] ]);
				for(var i=0;i<b.length;i++){
					result = result.concat([ [b[i]] ]);
				}
				return result;
			}();
	   console.log(markToMarket);

    }
  });
};
//var market = [2.8353, 4.1936, 5.9467, 3.0308, 2.7902, 3.8030];
var market;
var markToMarket;
var b;
var targetResidues;
var avgR;
var oneTo12;
var p;

setInterval(getRates, 30000);

var numOfCcy = 6;
var ccys = ['AUDMYR', 'EURMYR', 'GBPMYR', 'JPYMYR', 'SGDMYR', 'USDMYR'];
var amount = [1, 1, 1, 100, 1, 1];
var cost = [2.8440, 4.0410, 5.5864, 3.0308, 2.7862, 3.7985];
var upperBound = [2.8440, 4.2, 6.0, 3.1, 2.8, 3.9];
var targetProfit = 0.6;
/*var markToMarket = _.reduce(u.sumArr(market,u.xNumArr(cost, -1)),
						function(memo, num){
							return memo + num;
						});
var b = u.sumArr(upperBound,u.xNumArr(market, -1));

var targetResidues = targetProfit - markToMarket;
var avgR = targetResidues / numOfCcy;*/

var coef = [[1,1,0,0,0,0,0,0,0,0,0,0],
			[1,-1,0,0,0,0,0,0,0,0,0,0],
			[0,0,1,1,0,0,0,0,0,0,0,0],
			[0,0,1,-1,0,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,1],
			[0,0,0,0,1,1,0,0,0,0,0,0],
			[0,0,0,0,1,-1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,1,0,0,0,0],
			[0,0,0,0,0,0,1,-1,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,1,0,0],
			[0,0,0,0,0,0,0,0,1,-1,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,-1],
			[1,0,1,0,1,0,1,0,1,0,1,0],
			[1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,1,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,0]];

var sign = ['>=','<=','>=','<=','>=','<=','>=','<=','>=','<=','>=','<=','=','<=','<=','<=','<=','<=','<='];
/*var oneTo12 = itemToArr([avgR], numOfCcy*2);
var p = function(){
				var result = oneTo12.concat([ [targetResidues] ]);
				for(var i=0;i<b.length;i++){
					result = result.concat([ [b[i]] ]);
				}
				return result;
			}();*/

function itemToArr(item, len){
	if(!u.isNumeric(len)){ throw 'itemToArr() fail: 2nd arg is not a number.';}
	var result = [];
	for(var i = 0; i < len; i++){
		result.push(item);
	}
	return result;
}

exports.coef = coef;
exports.sign = sign;
exports.p = p;