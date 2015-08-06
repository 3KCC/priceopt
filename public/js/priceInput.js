/*var numOfCcy = 6;
var ccys = ['AUDMYR', 'EURMYR', 'GBPMYR', 'JPYMYR', 'SGDMYR', 'USDMYR'];
var unit = [1, 1, 1, 100, 1, 1];
var quantity = [10, 10, 10, 20, 10, 10];//unit based
var cost_o = [2.8440, 4.0406, 5.5864, 0.0308, 2.7862, 3.7985];*/
var numOfCcy = 12;
var ccys = ['CNYUSD', 'JPYUSD', 'GBPUSR', 'EURUSD',
			'KRWUSD', 'BRLUSD', 'AUDUSD', 'CADUSD',
			'SGDUSD', 'ARSUSD', 'RUBUSD', 'HKDUSD'];
var unit = [1, 100, 1, 1,
			1000, 1, 1, 1,
			1, 1, 10, 1];
var quantity = [10, 10, 10, 10,
			10, 10, 10, 10,
			10, 10, 10, 10];
var cost_o = [0.1611, 0.008009, 1.5607, 1.0897,
			0.00086, 0.28672, 0.7319, 0.7593,
			0.7222, 0.10857, 0.01581, 0.12901];
//modified cost with amount
var cost = multiply(cost_o,unit);
var cost_amount = multiply(cost, quantity);
var total_cost = cost_amount.reduce(function(memo, val){
	return memo + val;
})

//no need to input upperBound from Client side at this version
/*var upperBound_o = [2.8277, 4.2912, 6.0159, 0.0317, 2.8233, 3.8402];
//modified upperBound with amount
var upperBound = multiply(upperBound_o, unit);*/
var targetProfit = 6;

function multiply(arr1, arr2){
	var result = [];
	for(var i=0;i<arr1.length;i++){
		result.push(arr1[i]*arr2[i]);
	}
	return result;
};