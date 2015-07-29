var numOfCcy = 6;
var ccys = ['AUDMYR', 'EURMYR', 'GBPMYR', 'JPYMYR', 'SGDMYR', 'USDMYR'];
var unit = [1, 1, 1, 100, 1, 1];
var cost_o = [2.8440, 4.0406, 5.5864, 0.0308, 2.7862, 3.7985];
//modified cost with amount
var cost = multiply(cost_o,unit);
var upperBound_o = [2.8440, 4.2, 6.0, 0.0310, 2.8, 3.9];
//modified upperBound with amount
var upperBound = multiply(upperBound_o, unit);
var targetProfit = 0.6;

function multiply(arr1, arr2){
	var result = [];
	for(var i=0;i<arr1.length;i++){
		result.push(arr1[i]*arr2[i]);
	}
	return result;
};