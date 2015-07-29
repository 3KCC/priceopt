var numOfCcy = 6;
var ccys = ['AUDMYR', 'EURMYR', 'GBPMYR', 'JPYMYR', 'SGDMYR', 'USDMYR'];
var unit = [1, 1, 1, 100, 1, 1];
var cost_o = [2.8440, 4.0406, 5.5864, 0.0308, 2.7862, 3.7985];
//modified cost with amount
var cost = multiply(cost_o,unit);
var total_cost = cost.reduce(function(memo, val){
	return memo + val;
})
var upperBound_o = [2.8277, 4.2912, 6.0159, 0.0317, 2.8233, 3.8402];
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