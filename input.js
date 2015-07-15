var _ = require('underscore');

//input: number of variables(int), number of constraints(int), coefficients array (2D-array), sign array, last column array
var Tableau = function(numOfVars, numOfCons, coef, sign, pCol, objective, objCoef){
	this.coef = coef;
	this.pCol = pCol;
	this.numOfVars = numOfVars;
	this.numOfCons = numOfCons;
	this.numOfArt = numOfArtificial(sign);
	this.pRow = addZero(0, this.numOfCons + this.numOfArt + 1, coefSign(objective, objCoef));
	this.pArt = addZero(this.numOfCons + this.numOfVars, 1, arrOfNum(-1, this.numOfArt));
	this.varName = varName(numOfVars,'x');
	this.slkName = varName(numOfCons, 'z');
	this.artName = varName(this.numOfArt, 'y');
	this.slack = identityMatrix(numOfCons,coefOfSlack(sign));
	this.art = artMatrix(numOfCons, numOfVars, sign);
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
		if(sign[i] === '='){
			arr.push(0);
		}else if(sign[i] === '<='){
			arr.push(1);
		}else {
			arr.push(-1);
		}
	}
	return arr;
}

function numOfArtificial(sign){
	var count = 0;
	for(var i in sign){
		if(sign[i] === '>='){
			count++;
		}
	}
	return count;
}

function replaceArtificial(arr, sign){
	var result = arr;
	for(var i in sign){
		if(sign[i] === '>='){
			result[i] = result[i].replace('z','y');
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

function artMatrix(m,n,sign){
	var result = [];
	var pos = 0;
	for(var i = 0; i < m; i++){
		result.push([]);
		for(var j = 0; j < n; j++){
			if(sign[i] === ">="){
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

//var prob = new Tableau(2, 3, [[1,1],[2,-1],[0,1]], ['>=','>=','<='], [1,1,2]);
//console.log(prob);

exports.Tableau = Tableau;