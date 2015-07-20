var _ = require('underscore');
var tb = require('./input');

//input: 2D-array matrix, [row, column] of the pivot cell
//output: new matrix (2-D array)
function GuassElimination(matrix, pivot){
	var m = matrix.slice();
	var pRow = pivot[0], pCol = pivot[1];
	var pCel = m[pRow][pCol];
	//pivot be a positive number
	if(pCel !== 0){
		m[pRow] = xNumArr(m[pRow], 1/pCel); //pivot entry = 1
	}else {
		throw "pivot is 0";
	}
	pCel = m[pRow][pCol];
	var test;
	for (var r=0; r<m.length; r++) {
		//multiply non-pivot rows with a suitable number and add with the pivot row
		test = m[0].length;

		console.log('init',test,m[0].length);
		
		if (r !== pRow){
			var coef =  - m[r][pCol]/pCel;
			var multiplied = xNumArr(m[pRow], coef);
			//m[r] = sumArr(m[r], xNumArr(m[pRow], coef));// to guarantee that the solutions is feasible (positive)
			m[r] = sumArr(m[r],multiplied);

		}
		
		if(test !== m[0].length){
			console.log('diff',test,m[0].length);
			console.log('wrong',r, pRow, m[r].length, m[pRow].length);
		}
		
	}
	return m;
}

/*var A = [[1,2,3],[4,5,6],[5,5,6],[0,0,-2]];
var pr = 1, pc = 1;
for(var r in A){
	t = A[0].length;
	if (parseInt(r) !== pr){
		var ef = - A[r][pc]/2;
		A[r] = sumArr(A[r], xNumArr(A[pr],ef));
	}
	if(t !== A[0].length){console.log(A[r].length);}
}
console.log(A);*/

//input: last row (array)
//output: index (integer) of the pivot column or -1 if all entries in the last row is non-positive
function getpCol(lastR){
	for(var i = 0; i < lastR.length; i++){
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
	return arr;
}

function lastRow(matrix){
	return matrix[matrix.length - 1].slice();
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
function sumArr(a1,a2){
	//convert object to nested array
	/*var arr = _.map(arguments, function(value, index){
		return value;
	});*/

	//var arr = Array.prototype.slice.call(arguments);

	//zip them with the trick of .apply(), help pass arguments using an Array
	//arr = _.zip.apply(_.zip, arr);
	var arr = _.zip(a1,a2);
	return _.map(arr, function(pieces){
		return _.reduce(pieces, function(memo, num){ 
			return memo + num;
		},0);
	});
}

//input: array, number
//output: new array after multiplying
function xNumArr(arr, constant){
	return _.map(arr, function(value){ return value*constant;});
}

//input: matrix (object)
function simplex(matrix){
	var h = matrix.horizon;
	var v = matrix.vertical;
	var workTb = matrix.table;
	return interate(workTb, h, v, 1);
}

//input: matrix (object)
//output: result matrix (object)
function twoPhase(matrix){
	var h = matrix.horizon;
	var v = matrix.vertical;
	//Phase 1: return the BFS for next stage
	var result;
	result = phaseI(matrix.table, matrix.numOfArt, h, v);
	tb = result[0];
	h = result[1];
	v = result[2];
	//console.log(tb[0].length);
	result = phaseII(tb, matrix.numOfArt, h, v);
	return result;
}

function phaseI(matrix, numArt, h, v){
	var workTb = matrix.slice();
	var lastR = lastRow(matrix);
	var m = matrix.length;
	var n = matrix[0].length;
	var result;
	
	//writte the last row in terms of non-basic variables. All var in basis = 0
	for(var i = 0; i < numArt; i++){
		lastR = sumArr(lastR, matrix[i]);
	}
	workTb[workTb.length - 1] = lastR;
	result = interate(workTb, h, v, 2);
	return result;
}

function phaseII(matrix, numArt, h, v){
	var workTb = matrix.slice();
	var result;
	workTb.pop();
	workTb = removeCol(workTb, workTb[0].length - 1 - numArt, numArt);
	h = h.slice(0, h.length - 1 - numArt);
	result = interate(workTb, h, v, 1);
	return result;
}

function removeCol(table, start, num){
	for(var row in table){
		table[row] = table[row].slice(0, start).concat(table[row].slice(start+num));
	}
	return table;
}

function interate(matrix, h, v, num){
	var workTb = matrix.slice();
	var lastR = lastRow(workTb);
	var m = matrix.length;
	
	var c = getpCol(lastR);
	var r;

	while(c !== -1){
		r = getpRow(workTb.slice(0, m - num), c);
		v[r] = h[c];
		workTb = GuassElimination(workTb, [r,c]);
		//if(typeof(v[r]) === 'undefined'){ console.log(lastRow(workTb).length);}
		c = getpCol(lastRow(workTb));
		
	}

	return [workTb, h, v];
}


var coef = [[1,1,0,0,0,0,0,0,0,0,0,0],
			[-1,1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,1,1,0,0,0,0,0,0,0,0],
			[0,0,-1,1,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,1,0,0,0,0,0,0],
			[0,0,0,0,-1,1,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,1,0,0,0,0],
			[0,0,0,0,0,0,-1,1,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,1,0,0],
			[0,0,0,0,0,0,0,0,-1,1,0,0],
			[0,0,0,0,0,0,0,0,1,0,1,1],
			[0,0,0,0,0,0,0,0,1,0,-1,1],
			[1,0,1,0,1,0,1,0,1,0,1,0],
			[1,0,0,0,0,0,0,0,0,0,0,0],
			[0,0,1,0,0,0,0,0,0,0,0,0],
			[0,0,0,0,1,0,0,0,0,0,0,0],
			[0,0,0,0,0,0,1,0,0,0,0,0],
			[0,0,0,0,0,0,0,0,1,0,0,0],
			[0,0,0,0,0,0,0,0,0,0,1,0]];
var sign = ['>=','<=','>=','<=','>=','<=','>=','<=','>=','<=','>=','<=','=','<=','<=','<=','<=','<=','<='];
var p = [[0.0152],[0.0152],[0.0152],[0.0152],[0.0152],[0.0152],[0.0152],[0.0152],[0.0152],[0.0152],[0.0152],[0.0152],
		[0.0909],[0.0087],[1],[1],[1],[1],[1]];
var result = tb.arrangeMatrix(coef, p, sign);
coef = result[0];
p = result[1];
sign = result[2];

var prob = new tb.Tableau(12, 19, coef, sign, p, 'minimize', [0,1,0,1,0,1,0,1,0,1,0,1]);

//var prob = new tb.Tableau(2, 3, [[1,1],[2,-1],[0,3]], ['>=','>=','<='], [1,1,2], 'minimize', [6, 3]);
//console.log(prob);
result = twoPhase(prob);
//var lastC = getACol(result[0], result[0][0].length - 1);
//console.log(result[2], lastC);
//console.log(result);