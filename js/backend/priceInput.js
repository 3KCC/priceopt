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

/*var numOfCcy = 6;
var ccys = ['AUDMYR', 'EURMYR', 'GBPMYR', 'JPYMYR', 'SGDMYR', 'USDMYR'];
var unit = [1, 1, 1, 100, 1, 1];
var amount = [10, 10, 10, 20, 10, 10];//unit based*/
var numOfCcy = 12;
var ccys = ['CADUSD', 'EURUSD', 'GBPUSD', 'JPYUSD',
			'AUDUSD', 'NZDUSD', 'CHFUSD', 'HKDUSD',
			'SGDUSD', 'SEKUSD', 'DKKUSD', 'PLNUSD'];
var unit = [10, 1, 1, 1000,
			10, 10, 1, 100,
			10, 100, 100, 100];
var amount = [500, 400, 300, 100,
			100, 100, 300, 100,
			100, 100, 100, 100];
var ccyQuantity = amount.reduce(function(memo, val){
	return memo + val;
});
/*var cost = [2.8440, 4.0406, 5.5864, 0.0308, 2.7862, 3.7985];*/
var cost = [0.76834, 1.1111, 1.5623, 0.0080292,
			0.73325, 0.65749, 1.0227, 0.129010,
			0.71588, 0.117401, 0.14891, 0.26552];
//modified cost with amount
//cost = u.multiply1DArr(cost, amount);
/*var upperBound = [2.8277, 4.2912, 6.0159, 0.0317, 2.8233, 3.8402];
var percentUpper = [0.0146, 0.0129, 0.0109, 0.0284, 0.0106, 0.0062];*/
var percentUpper = [0.04, 0.04, 0.04, 0.04,
					0.06, 0.06, 0.06, 0.06,
					0.08, 0.08, 0.08, 0.08];
//modified upperBound with amount
//upperBound = u.multiply1DArr(upperBound, amount);
var cost_amount = u.multiply1DArr(u.multiply1DArr(cost, amount), unit);
var total_cost = cost_amount.reduce(function(memo, val){
	return memo + val;
});
var profitPercent = 0.025;
var targetProfit = total_cost*profitPercent;
// console.log(targetProfit);
/*var coef = [[1,1,0,0,0,0,0,0,0,0,0,0],
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
			[0,0,0,0,0,0,0,0,0,0,1,0]];*/
/*var coef = [[1,1,0,0,0,0,0,0,0,0,0,0],
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
			[amount[0],0,amount[1],0,amount[2],0,amount[3],0,amount[4],0,amount[5],0],
			[1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,1,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,0]];*/

var coef = getCoef(numOfCcy, amount);

/*var sign = ['>=','<=','>=','<=','>=','<=','>=','<=','>=','<=','>=','<=','=','<=','<=','<=','<=','<=','<='];*/
var sign = getSign(numOfCcy);
/*var objEq = [0,1,0,1,0,1,0,1,0,1,0,1];*/
var objEq = getObjEq(amount, 1);
var obj = 'minimize';
var numVars = numOfCcy*2;
var numConstraints = numOfCcy*3 + 1;
/*var spreadVar = ['x1', 'x3', 'x5', 'x7', 'x9', 'x11'];*/
var spreadVar = getSpreadVar(numOfCcy);

function getSpreadVar(num){
	var arr = [];
	var index;
	for(var i=0;i<num;i++){
		index = i*2+1;
		arr.push('x' + index);
	}
	return arr;
}

function getSign(num){
	var arr1 = [], arr2 = [];
	var result;
	for(var i=0;i<num;i++){
		arr1.push(">=","<=");
		arr2.push("<=");
	}
	arr1.push("=");
	result = arr1.concat(arr2);
	return result;
}

function getObjEq(amountArr, type){
	var arr = [];
	if(type === 1){
		for(var i=0;i<amountArr.length;i++){
			arr.push(0,amountArr[i]);
		}
	}
		
	if(type === 2){
		for(var i=0;i<amountArr.length;i++){
			arr.push(amountArr[i],0);
		}
	}
	return arr;
}

function getCoef(num, amountArr){
	return getRowsCoef(num,1).concat([getObjEq(amountArr,2)], getRowsCoef(num,2));
}

function getRowsCoef(num, type){
	var result = [];
	if(type === 1){
		for(var i=0;i<num;i++){
			var row1 = [], row2 = [];
			for(var j=0;j<num;j++){
				if(i===j){
					row1.push(1,1);
					row2.push(1,-1);
				}else{
					row1.push(0,0);
					row2.push(0,0);
				}
			}
			result.push(row1, row2);
		}
	}
	if(type === 2){
		for(var i=0;i<num;i++){
			var row = [];
			for(var j=0;j<num;j++){
				if(i===j){
					row.push(1,0);
				}else{
					row.push(0,0);
				}
			}
			result.push(row);
		}
	}
	return result;
}

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
	// var rateArr = [];
	// for(var i=0; i<results.length; i++){
	// 	var r = math.eval(results[i].Rate);
	// 	rateArr.push(r);
	// }
	market = results.slice();
	//market = [2.8353, 4.1936, 5.9467, 0.0303, 2.7902, 3.8030];
	markToMarket = math.dot(u.sumArr(market,u.xNumArr(cost, -1)), u.multiply1DArr(amount,unit));
	//modified based on percentage on the top of market
	upperBound = u.multiply1DArr(market,
					_.map(percentUpper,function(val){
									return 1 + val;
				}));
	if(limitProfit(cost, upperBound) < targetProfit){
		console.log("Max Profit is: " + limitProfit(cost, upperBound));
	}else{
		console.log("Target Profit is within limit.")
	}
	b = u.multiply1DArr(u.sumArr(upperBound,u.xNumArr(market, -1)), unit);
	targetResidues = targetProfit - markToMarket;
	avgR = targetResidues / ccyQuantity;
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

function limitProfit(c,ub){
	return math.dot(u.sumArr(ub, u.xNumArr(c, -1)), u.multiply1DArr(amount,unit));
}

/*console.log(u.multiply1DArr([2.8353, 4.1936, 5.9467, 0.0303, 2.7902, 3.8030],
	_.map(percentUpper,function(val){
		return 1 + val;
})));*/
exports.ccys = ccys;
exports.unit = unit;
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