/*var numOfCcy = 6;
var ccys = ['AUDMYR', 'EURMYR', 'GBPMYR', 'JPYMYR', 'SGDMYR', 'USDMYR'];
var unit = [1, 1, 1, 100, 1, 1];
var quantity = [10, 10, 10, 20, 10, 10];//unit based
var cost_o = [2.8440, 4.0406, 5.5864, 0.0308, 2.7862, 3.7985];*/
var numOfCcy = 12;
var ccys = ['CADUSD', 'EURUSD', 'GBPUSD', 'JPYUSD',
			'AUDUSD', 'NZDUSD', 'CHFUSD', 'HKDUSD',
			'SGDUSD', 'SEKUSD', 'DKKUSD', 'PLNUSD'];
var unit = [10, 1, 1, 1000,
			10, 10, 1, 100,
			10, 100, 100, 100];
var quantity = [100, 100, 300, 400,
			100, 100, 100, 100,
			100, 100, 100, 100];
var cost_o = [0.76834, 1.1111, 1.5623, 0.0080292,
			0.73325, 0.65749, 1.0227, 0.129010,
			0.71588, 0.117401, 0.14891, 0.26552];

//modified cost with amount
var cost = multiply(cost_o,unit);
var cost_amount = multiply(cost, quantity);
var total_cost = cost_amount.reduce(function(memo, val){
	return memo + val;
});

//no need to input upperBound from Client side at this version
/*var upperBound_o = [2.8277, 4.2912, 6.0159, 0.0317, 2.8233, 3.8402];
//modified upperBound with amount
var upperBound = multiply(upperBound_o, unit);*/
var profitPercent = 0.025;
var targetProfit = total_cost*profitPercent;

function multiply(arr1, arr2){
	var result = [];
	for(var i=0;i<arr1.length;i++){
		result.push(arr1[i]*arr2[i]);
	}
	return result;
};