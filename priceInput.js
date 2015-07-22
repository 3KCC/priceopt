var u = require('./utilities');
var _ = require('underscore');

var numOfCcy = 6;
var ccys = ['AUDMYR', 'EURMYR', 'GBPMYR', 'JPYMYR', 'SGDMYR', 'USDMYR'];
var amount = [1, 1, 1, 100, 1, 1];
var market = [2.8353, 4.1936, 5.9467, 3.0308, 2.7902, 3.8030];
var cost = [2.8440, 4.0410, 5.5864, 3.0308, 2.7862, 3.7985];
var upperBound = [2.8440, 4.2, 6.0, 3.1, 2.8, 3.9];
var markToMarket = _.reduce(u.sumArr(market,u.xNumArr(cost, -1)),
						function(memo, num){
							return memo + num;
						});
var b = u.sumArr(upperBound,u.xNumArr(market, -1));
var targetProfit = 0.6;
var targetResidues = targetProfit - markToMarket;
var avgR = targetResidues / numOfCcy;

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
var oneTo12 = itemToArr([avgR], numOfCcy*2);
var p = function(){
				var result = oneTo12.concat([ [targetResidues] ]);
				for(var i=0;i<b.length;i++){
					result = result.concat([ [b[i]] ]);
				}
				return result;
			}();

function itemToArr(item, len){
	if(!u.isNumeric(len)){ throw 'itemToArr() fail: 2nd arg is not a number.'}
	var result = [];
	for(var i = 0; i < len; i++){
		result.push(item);
	}
	return result;
}

exports.coef = coef;
exports.sign = sign;
exports.p = p;