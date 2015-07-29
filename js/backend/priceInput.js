var _ = require('underscore');
var math = require('mathjs');
/*var request = require('request');
var connect = require('connect');
var http = require('http');
var async = require('async');
var fs = require('fs');
var app = connect();*/
var u = require('./utilities');

var market;
var markToMarket;
var b;
var targetResidues;
var avgR;
var oneTo12;
var p;

//var market = [2.8353, 4.1936, 5.9467, 0.0303, 2.7902, 3.8030];

//setInterval(getRates, 30000);
//getRates();

var numOfCcy = 6;
var ccys = ['AUDMYR', 'EURMYR', 'GBPMYR', 'JPYMYR', 'SGDMYR', 'USDMYR'];
var amount = [1, 1, 1, 100, 1, 1];
var cost = [2.8440, 4.0406, 5.5864, 0.0308, 2.7862, 3.7985];
//modified cost with amount
//cost = u.multiply1DArr(cost, amount);
var upperBound = [2.8277, 4.2912, 6.0159, 0.0317, 2.8233, 3.8402];
//modified upperBound with amount
//upperBound = u.multiply1DArr(upperBound, amount);
var targetProfit = 0.6;
var coef = [[1,1,0,0,0,0,0,0,0,0,0,0],
			[1,-1,0,0,0,0,0,0,0,0,0,0],
			[0,0,1,1,0,0,0,0,0,0,0,0],
			[0,0,1,-1,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,1,0,0,0,0,0,0],
			[0,0,0,0,1,-1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,1,0,0,0,0],
			[0,0,0,0,0,0,1,-1,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,1,0,0],
			[0,0,0,0,0,0,0,0,1,-1,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,1],
			[0,0,0,0,0,0,0,0,0,0,1,-1],
			[1,0,1,0,1,0,1,0,1,0,1,0],
			[1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,1,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,0]];

var sign = ['>=','<=','>=','<=','>=','<=','>=','<=','>=','<=','>=','<=','=','<=','<=','<=','<=','<=','<='];
var objEq = [0,1,0,1,0,1,0,1,0,1,0,1];
var obj = 'minimize';
var numVars = 12;
var numConstraints = 19;
var spreadVar = ['x1', 'x3', 'x5', 'x7', 'x9', 'x11'];

/*var markToMarket = _.reduce(u.sumArr(market,u.xNumArr(cost, -1)),
						function(memo, num){
							return memo + num;
						});*/
/*var markToMarket = math.dot(u.sumArr(market,u.xNumArr(cost, -1)), amount);
var b = u.multiply1DArr(u.sumArr(upperBound,u.xNumArr(market, -1)), amount);
/*var b = u.sumArr(upperBound,u.xNumArr(market, -1));

var targetResidues = targetProfit - markToMarket;
var avgR = targetResidues / numOfCcy;*/


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

function calculateP(results){
	var rateArr = [];
	for(var i=0; i<results.length; i++){
		var r = math.eval(results[i].Rate);
		rateArr.push(r);
	}
	market = rateArr;
	//market = [2.8353, 4.1936, 5.9467, 0.0303, 2.7902, 3.8030];
	markToMarket = math.dot(u.sumArr(market,u.xNumArr(cost, -1)), amount);
	b = u.multiply1DArr(u.sumArr(upperBound,u.xNumArr(market, -1)), amount);
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
	return p;
}

exports.amount = amount;
exports.cost = cost;
exports.coef = coef;
exports.sign = sign;
exports.p = p;
exports.objEq = objEq;
exports.obj = obj;
exports.numVars = numVars;
exports.numConstraints = numConstraints;
exports.calculateP = calculateP;
exports.ccys = ccys;
exports.spreadVar = spreadVar;