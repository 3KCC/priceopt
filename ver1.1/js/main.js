var prIn = require('./priceInput');
var live = require('./liveFeed');
var input = require('./input');
var simplex = require('./twoPhase');

var coef = prIn.coef;
var sign = prIn.sign;
var objEq = prIn.objEq;
var obj = prIn.obj;
var numVars = prIn.numVars;
var numConstraints = prIn.numConstraints;

/*var prob = new input.Tableau(numVars, numConstraints, coef, sign, p, obj, objEq);
var result = simplex.twoPhase(prob);
console.log(result[0]);*/

var optimize = function (callback){
  live.getAllRates(callback);
};

setInterval(function(){
  optimize(callback);
},30000);

function callback(res){
  var p = prIn.calculateP(res);
  //console.log(res);
  var cps = input.arrangeMatrix(coef, p, sign);
  coef = cps[0];
  p = cps[1];
  sign = cps[2];
  var prob = new input.Tableau(numVars, numConstraints, coef, sign, p, obj, objEq);
  simplex.logResult(simplex.twoPhase(prob));
}