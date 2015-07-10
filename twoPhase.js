var _ = require('underscore');

problem = {
	'A': [[1, 2, 1, 0, 6],
			[1, -1, 0, 1, 3],
			[-1, -1, 0, 0, 0]],
}

problem.m = problem.A.length;
problem.n = problem.A[0].length;

//input: 2D-array matrix, [row, column] of the pivot cell
function GuassElimination(matrix, pivot){
	var m = matrix;
	var pRow = pivot[0], pCol = pivot[1];
	var pCel = m[pRow][pCol];
	//pivot be a positive number
	if(pCel !== 0){
		m[pRow] = xNumArr(m[pRow], 1/pCel);
	}else {
		throw "pivot is 0";
	}
	pCel = m[pRow][pCol];
	for (var r in m) {
		//multiply non-pivot rows with lcm and add with the pivot row
		if (parseInt(r) !== pRow){
			var coef = - pCel/m[r][pCol];
			m[r] = sumArr(xNumArr(m[r], coef), m[pRow]);
		}
	}
	return m;
}

function getpCol(matrix){
	var lastR = matrix[matrix.length - 1];
	for(var i = 0; i < lastR.length - 1; i++){
		if(lastR[i] > 0){ return i;}
	}
	return -1; //no positive entry
}

function getpRow(matrix, col){
	var pCol = getACol(matrix, col);
	var lastCol = getACol(matrix, matrix[0].length - 1);
	var r, val;
	for(var i = 0; i < pCol.length - 1; i++){
		if(pCol[i] > 0){
			if(typeof(r) === 'undefined'){
				r = i;
				val = lastCol[i]/pCol[i];
			}else{
				if(lastCol[i]/pCol[i] < val){
					r = i;
					val = lastCol[i]/pCol[i];
				}
			}
		}
	}
	if(typeof(r) === 'undefined'){
		return -1;
	}else{
		return r;
	}
}

function getACol(matrix, index){
	var arr = [];
	if( index < 0 || index > matrix[0].length - 1){
		throw "index is not valid";
	}
	for (var i = 0; i < matrix.length; i++){
		arr.push(matrix[i][index]);
	}
	return arr
}
function gcd(x, y){
	var temp;
	while (y){
		temp = y;
		y = x%y;
		x = temp;
	}
	return x
}

function lcm(arr){
	return _.reduce(arr, function(memo, num){return memo*num/gcd(memo,num);});
}

//pass all arrays to sum
function sumArr(){
	//convert object to nested array
	var arr = _.map(arguments, function(value, index){
		return value;
	});
	//zip them with the trick of .apply(), help pass arguments using an Array
	arr = _.zip.apply(_.zip, arr);
	return _.map(arr, function(pieces){
		return _.reduce(pieces, function(memo, num){ return memo + num;},0);
	});
}

function xNumArr(arr, constant){
	return _.map(arr, function(value){ return value*constant;});
}

function simplex(matrix){
	var A = matrix.A, m = matrix.m, n = matrix.n;
	var c = getpCol(A);
	var horizon = ['x1', 'x2', 'z1', 'z2', 'p'];
	var vertical = ['z1', 'z2', 'p'];
	if( c == -1){
		return [vertical, getACol(A, n -1)];
	}else{
		var r = getpRow(A, c);

	}
}

console.log(simplex(problem));