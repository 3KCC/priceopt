var _ = require('underscore');

var Tableau = function(A, numConstraints, numVars, numSlacks){
	this.A = A;
	this.m = A.length;
	this.n = A[0].length;
	this.horizon = function(){
		
		var arr = [];
		for (var i = 1; i <= numVars; i++){
			arr.push('x' + i);
		}
		for (var i = 1; i <= numSlacks; i++){
			arr.push('z' + i);
		}
		return arr;
	}();

	this.numVars = numVars;
	this.numSlacks = numSlacks;
	this.numConstraints = numConstraints;
	this.vertical = this.horizon.slice(numVars);
	this.getArt = function(){

		var count = 0, pos = numVars;

		for( var row in A){
			if(A[row][pos] < 0){
				count++;
			}
			pos++;
		}

		return count;
	};

};

problem = new Tableau([[1, 1, -1, 0, 0, 1],
			[2, -1, 0, -1, 0, 1],
			[0, 3, 0, 0, 1, 0, 0, 2],
			[-6, -3, 0, 0, 0, 0, 0, 0],
			[3, 0, -1, -1, 0, 0, 0, 2]],
			3, 2, 3);

console.log(problem);

//input: 2D-array matrix, [row, column] of the pivot cell
//output: new matrix (2-D array)
function GuassElimination(matrix, pivot){
	var m = matrix;
	var pRow = pivot[0], pCol = pivot[1];
	var pCel = m[pRow][pCol];
	//pivot be a positive number
	if(pCel !== 0){
		m[pRow] = xNumArr(m[pRow], 1/pCel); //pivot entry = 1
	}else {
		throw "pivot is 0";
	}
	pCel = m[pRow][pCol];
	for (var r in m) {
		//multiply non-pivot rows with lcm and add with the pivot row
		if (parseInt(r) !== pRow){
			var coef =  - m[r][pCol]/pCel;
			m[r] = sumArr(m[r], xNumArr(m[pRow], coef));// to guarantee that the solutions is feasible (positive)
		}
	}
	return m;
}

//input: 2-D array for matrix
//output: index (integer) of the pivot column or -1 if all entries in the last row is non-positive
function getpCol(matrix){
	var lastR = matrix[matrix.length - 1];
	for(var i = 0; i < lastR.length - 1; i++){
		if(lastR[i] > 0){ return i;}
	}
	return -1; //no positive entry
}

//input: matrix 2D-array and pivot column index
function getpRow(matrix, col){
	var pCol = getACol(matrix, col);
	var lastCol = getACol(matrix, matrix[0].length - 1);
	var r, val;
	for(var i = 0; i < pCol.length - 1; i++){
		if(pCol[i] > 0){// to guarantee that the solutions is feasible (positive)
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

//input: array, number
//output: new array after multiplying
function xNumArr(arr, constant){
	return _.map(arr, function(value){ return value*constant;});
}

//input: matrix (object)
function simplex(matrix){
	var A = matrix.A, m = matrix.m, n = matrix.n;
	var h = matrix.horizon, v = matrix.vertical;
	var c = getpCol(A);
	var r;

	//console.log(h);
	//console.log(v, A);
	while( c !== -1){//the solution is optimal
		r = getpRow(A, c);
		v[r] = h[c];
		A = GuassElimination(A,[r,c]);
		//console.log(v, A);
		c = getpCol(A);
	}
	//console.log(v, getACol(A,n-1));
	var result = new Tableau(A, h, v);
	return result;
}

//input: matrix (object)
//output: result matrix (object)
function twoPhase(matrix){
	//Phase 1: return the BFS for next stage
	var newMatrix = simplex(matrix);
	newMatrix.A.pop();
	newMatrix.horizon = ['x1', 'x2', 'z1', 'z2', 'z3', 'p'];
	matrix.vertical.pop();
	for( var row in newMatrix.A){
		newMatrix.A[row].splice(5,2);
	}

	return simplex(newMatrix);
}

//console.log(twoPhase(problem));