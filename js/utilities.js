var _ = require('underscore');

//pass all arrays to sum
function sumArr(){
	//convert object to nested array
	var arr = Array.prototype.slice.call(arguments);
	//alternative way
	/*var arr = _.map(arguments, function(value, index){
		return value;
	});*/

	//only numeric arrays are accepted
	if(arr.length === 0){throw "sumArr() fail: input is empty";}
	for( var i = 0; i < arr.length; i++){
		if(arr[i].constructor !== Array){ 
			throw "sumArr() fail: item at " + i +" is not a array but a/an " + typeof(arr[i]);
		}
		if(notNumber(arr[i]) !== -1){ throw 'sumArr() fail: array at ' + i + ' contains non-numeric item';}
	}

	//all arrays must have same length
	if(arr.length === 1){ return arr[0];} //no arguments/only one arguments was passed
	var len = arr[0].length;
	for( var i = 0; i < arr.length; i++){
		if(arr[i].length !== len){ throw "sumArr() fail: arrays have different length at index " + i}
	}

	//zip them with the trick of .apply(), help pass arguments using an Array
	arr = _.zip.apply(_.zip, arr);
	return _.map(arr, function(pieces){
		return _.reduce(pieces, function(memo, num){ 
			return memo + num;
		},0);
	});
}

//pass all arrays to sum
function multiply1DArr(arr1, arr2){
	//convert object to nested array
	var arr = Array.prototype.slice.call(arguments);
	//alternative way
	/*var arr = _.map(arguments, function(value, index){
		return value;
	});*/

	//only numeric arrays are accepted
	if(arr.length === 0){throw "multiply1DArr() fail: input is empty";}
	//only 2 arrays are supported
	if(arr.length !== 2){throw "multiply1DArr() fail: must be exactly 2 1-D arrays input";}
	for( var i = 0; i < arr.length; i++){
		if(arr[i].constructor !== Array){ 
			throw "multiply1DArr() fail: item at " + i +" is not a array but a/an " + typeof(arr[i]);
		}
		if(notNumber(arr[i]) !== -1){ throw 'multiply1DArr() fail: array at ' + i + ' contains non-numeric item';}
	}

	//all arrays must have same length
	if(arr.length === 1){ return arr[0];} //no arguments/only one arguments was passed
	var len = arr[0].length;
	for( var i = 0; i < arr.length; i++){
		if(arr[i].length !== len){ throw "multiply1DArr() fail: arrays have different length at index " + i}
	}

	//zip them with the trick of .apply(), help pass arguments using an Array
	arr = _.zip.apply(_.zip, arr);
	return _.map(arr, function(pieces){
		return _.reduce(pieces, function(memo, num){ 
			return memo * num;
		});
	});
}

//input: 1-D array
//output: its transpose
function transpose1D(arr){
	if(arr.constructor !== Array){ 
		throw "transpose1D() fail: input is not a array but a/an " + typeof(arr);
	}

	var tp = [];
	for(var i=0;i<arr.length;i++){
		//no nested array
		if(arr[i].constructor === Array){ throw 'transpose1D() fail: nested array is given at ' + i + 'arr[i] = ' + arr[i];}
		tp.push([arr[i]]);
	}
	return tp;
}

//input: array, number
//output: new array after multiplying
function xNumArr(arr, constant){
	if(arr.constructor !== Array){ 
		throw "xNumArr() fail: the first argument is not a array but a/an " + typeof(arr);
	}
	if(!isNumeric(constant)){ throw "xNumArr() fail: constant-input is not a number."}
	return _.map(arr, function(value){ return value*constant;});
}

//input: passing obj/number/string/...
//output: boolean(True/False)
//check whether input is a Number (NaN -> false)
function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//input: array
//output: index of non-numeric item or -1 if not found
//return the index of first item found which is not a number
function notNumber(arr){
	if(arr.constructor !== Array){ 
		throw "notNumber() fail: input is not a array but a/an " + typeof(arr);
	}
	if(arr.length === 0){ throw "notNumber(): input is an empty arr."}

	for(var i=0; i<arr.length; i++){
		if(!isNumeric(arr[i])){ return i;}
	}

	return -1;
}

exports.xNumArr = xNumArr;
exports.sumArr = sumArr;
exports.isNumeric = isNumeric;
exports.transpose1D = transpose1D;
exports.multiply1DArr = multiply1DArr;