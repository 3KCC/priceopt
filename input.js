var _ = require('underscore');
var live = require('./liveFeed');

//input: number of variables(int), number of constraints(int), coefficients array (2D-array), sign array, last column array
var Tableau = function(numOfVars, numOfCons, coef, sign, pCol, objective, objCoef){
	this.cps = arrangeMatrix(coef, pCol, sign);
	this.coef = this.cps[0];
	this.pCol = this.cps[1];
	this.sign = this.cps[2];
	this.numOfVars = numOfVars;
	this.numOfCons = numOfCons;
	this.numOfSlacks = numOfASign(sign, '<=') + numOfASign(sign, '>=');
	this.numOfArt = numOfASign(sign, '>=') + numOfASign(sign, '=');
	this.numOfEq = numOfASign(sign, '=');
	this.pRow = addZero(0, this.numOfSlacks + this.numOfArt + 1, coefSign(objective, objCoef));
	this.pArt = addZero(this.numOfSlacks + this.numOfVars, 1, arrOfNum(-1, this.numOfArt));
	this.varName = varName(numOfVars,'x');
	this.slkName = varName(this.numOfSlacks, 'z');
	this.artName = varName(this.numOfArt, 'y');
	this.slack = push0Rows(identityMatrix(this.numOfSlacks,coefOfSlack(sign)), this.numOfArt - this.numOfEq, numOfCons - this.numOfSlacks);
	this.art = artMatrix(numOfCons, this.numOfArt, sign);
	this.table = multiConcat([coef, this.slack, this.art, pCol]).concat([this.pRow, this.pArt]);
	this.horizon = this.varName.concat(this.slkName, this.artName);
	this.vertical = replaceArtificial(this.slkName, sign);
};

//input: minimize or maximize (string), coeffients array
function coefSign(objective, coef){
	if(objective === "minimize"){
		coef = _.map(coef, function(value){ return value*(-1);});
	}
	return coef;
}

function addZero(numBefore, numAfter, arr){
	for(var i = 0; i < numAfter; i++){
		arr.push(0);
	}

	for(var i = 0; i < numBefore; i++){
		arr.unshift(0);
	}

	return arr;
}

function arrOfNum(num, len){
	var arr = [];
	for(var i = 0; i < len; i++){
		arr.push(num);
	}
	return arr;
}

//input: number of variables (int), type of them (string){x: problem variables, z: slack variables, y: artificial variables}
//output: array of variable name
function varName(numOfVars, type){
	var arr = [];
	for(var i = 1; i <= numOfVars; i++){
		arr.push(type + i);
	}
	return arr;
}

function coefOfSlack(sign){
	var arr = [];
	for(var i in sign){
		if(sign[i] === '>='){
			arr.push(-1);
		}
		if(sign[i] === '<='){
			arr.push(1);
		}
	}
	return arr;
}

function numOfASign(arr,sign){
	var count = 0;
	for(var i in arr){
		if(arr[i] === sign){
			count++;
		}
	}
	return count;
}

function replaceArtificial(arr, sign){
	var result = arr.slice();
	var index;
	for(var i in sign){
		if(sign[i] === '>='){
			result[i] = result[i].replace('z','y');
		}else if(sign[i] === '='){
			index = parseInt(i) + 1;
			result.splice(i, 0, 'y' + index);
		}
	}
	return result;
}


//input: size of matrix (int), array of leading entries
//out: identity matrix (2D-array)
function identityMatrix(num,arr){
	if(typeof(arr) !== 'undefined'){
		if(num !== arr.length){
			throw "Length of leading entries array is not matched."
		}
	}
	var matrix = [];
	for(var i = 0; i < num; i++){
		matrix.push([]);
		for(var j = 0; j < num; j++){
			if(i===j){
				if(typeof(arr) !== 'undefined'){
					matrix[i].push(arr[i]);
				}else{
					matrix[i].push(1);
				}
			}else{
				matrix[i].push(0);
			}
		}
	}
	return matrix;
}

//input: arr must be a 2D-arr
function push0Rows(arr, index, num){
	//prepare row of 0
	var row0 = [];
	for(var i = 0; i < arr[0].length; i++){
		row0.push(0);
	}
	for(var i = 0; i < num; i++){
		arr.splice(index, 0, row0);
	}
	return arr;
}

function artMatrix(m,n,sign){
	var result = [];
	var pos = 0;
	for(var i = 0; i < m; i++){
		result.push([]);
		for(var j = 0; j < n; j++){
			if(sign[i] === '>=' || sign[i] === '='){
				if( j === pos){
					result[i].push(1);
				}else{
					result[i].push(0);
				}
			}else{
				result[i].push(0);
			}
		}
		pos++;
	}
	return result;
}

//input: 2 2D-array with the number of same rows, side = True -> put table next to each other, False -> put table one on top of others
function concatTable(arr1, arr2){
	var result = [];

	if(arr1.length !== arr2.length){
		throw "2 tables have different # of rows";
	}
	for(var i = 0; i < arr1.length; i++){
		result.push(arr1[i].concat(arr2[i]));
	}
	return result;
}

function multiConcat(arr){
	var result = arr[0];
	for(var i = 1; i < arr.length; i++){
		result = concatTable(result, arr[i]);
	}
	return result;
}

function arrangeMatrix(table, p, sign){
	var sI = [], sII = [], sIII = [];
	var tI = [], tII = [], tIII = [];
	var pI = [], pII = [], pIII = [];
	for(var i = 0; i < sign.length; i++){
		if(sign[i] === ">="){ 
			sI.push(sign[i]);
			tI.push(table[i]);
			pI.push(p[i]);
		}
		if(sign[i] === "="){ 
			sII.push(sign[i]);
			tII.push(table[i]);
			pII.push(p[i]);
		}
		if(sign[i] === "<="){ 
			sIII.push(sign[i]);
			tIII.push(table[i]);
			pIII.push(p[i]);
		}
	}
	sign = sI.concat(sII, sIII);
	table = tI.concat(tII, tIII);
	p = pI.concat(pII, pIII);

	return [table, p, sign];
}

/*
var coef = [[1,1],[0,1],[2,-1]];
var sign = ['>=','<=','>='];
var p = [1,2,1];
var result = arrangeMatrix(coef, p, sign);
coef = result[0];
p = result[1];
sign = result[2];

var prob = new Tableau(2, 3, coef, sign, p, 'minimize', [6, 3]);
//console.log(prob);
//console.log(arrangeMatrix(prob.coef, prob.pCol, prob.sign));
*/
exports.Tableau = Tableau;
exports.arrangeMatrix = arrangeMatrix;