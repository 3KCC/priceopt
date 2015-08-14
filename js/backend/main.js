var prIn = require('./priceInput');
var live = require('./liveFeed');
var input = require('./input');
var simplex = require('./twoPhase');
var u = require('./utilities');

var coef = prIn.coef;
var sign = prIn.sign;
var objEq = prIn.objEq;
var obj = prIn.obj;
var numVars = prIn.numVars;
var numConstraints = prIn.numConstraints;
var rateProp = "Rate";
var unit = prIn.unit;
var cost = prIn.cost;

/*var prob = new input.Tableau(numVars, numConstraints, coef, sign, p, obj, objEq);
var result = simplex.twoPhase(prob);
console.log(result[0]);*/

var optimize = function (res, callback){
  live.getAllRates(res, callback);
};

/*setInterval(function(){
  optimize(callback);
},30000);*/

exports.optimize = optimize;
exports.callback = callback;

function callback(res){
	var liveRate = live.rateInverse(live.parseProp(res, rateProp));
	//var liveRate = [0.1582, 0.0080, 1.5582, 1.1034, 0.0846, 0.2906, 0.7315, 0.7656, 0.7139, 0.1085, 0.0157, 0.1289];
	var p = prIn.calculateP(liveRate);
	var cps = input.arrangeMatrix(coef,p,sign);
	coef = cps[0];
	p = cps[1];
	sign = cps[2];
	var prob = new input.Tableau(numVars, numConstraints, coef, sign, p, obj, objEq);
	//console.log(prob.vertical, prob.horizon);
	var sol = simplex.twoPhase(prob);
	//simplex.logResult(sol);
	// console.log(u.multiply1DArr(liveRate, am), cost);
	var spread = simplex.calSpread(simplex.parseResult(prIn.spreadVar,sol), u.multiply1DArr(liveRate, unit), u.multiply1DArr(cost, unit));
	//console.log(spread);
	return [liveRate, spread];
}