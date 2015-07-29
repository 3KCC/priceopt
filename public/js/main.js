var HTMLRowGeneral = '<tr>%data%</tr>';
var HTMLCcy = '<td class="ccy">%data%</td>';
var HTMLLiveNone = '<td class="live"></td>';
var HTMLLive = '<td class="live">%data%</td>';
var HTMLBought = '<td class="bought">%data%</td>';
var HTMLUnit = '<td class="unit">%data%</td>';
var HTMLSpreadAmNone = '<td class="spAm"></td>';
var HTMLSpreadAm = '<td class="spAm">%data%</td>';
var HTMLPercentNone = '<td class="percent"></td>';
var HTMLPercent= '<td class="percent">%data%</td>';
var HTMLUpdate = '<p class="update"><i>Last Updated:&nbsp;<span>%data%</span></i></p>'
$(document).ready(function() {
	for(var i=0;i<ccys.length;i++){
		$("#input-tb").append(HTMLRowGeneral.replace("%data%",HTMLCcy.replace("%data%",ccys[i]) +
															HTMLBought.replace('%data%', cost[i].toFixed(4)) +
															HTMLUnit.replace('%data%', unit[i])
													));
		$('.ccy').last().after(HTMLLiveNone);
		$('.live').last().attr('id', ccys[i]);
		$("#output-tb").append(HTMLRowGeneral.replace("%data%",HTMLSpreadAmNone +
																HTMLPercentNone
													));
	}
});

//$(".ccy").first().append(HTMLLive.replace('%data%', 'N/A'));
setInterval(function(){
	var xmlhttp = new XMLHttpRequest();    
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			//console.log(xmlhttp.responseText);
			//result = [live rates, spread]
			var result = JSON.parse(xmlhttp.responseText);
			// result = $.map(result, function(elm) { return elm; });
			var liveRate = multiply(result[0],unit);
			var spread = result[1];
			var dt = new Date();
			var time = dt.getDate() + "/" + dt.getMonth() + "/" + dt.getFullYear() + " " +
						dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
			console.log(spread);

			// console.log(result.constructor);

			$('.live').each(function(i){
				$(this).replaceWith(HTMLLive.replace('%data%', liveRate[i].toFixed(4)));
			});

			$('.update').replaceWith(HTMLUpdate.replace('%data%', time));
				
			$('.spAm').each(function(i){
				$(this).replaceWith(HTMLSpreadAm.replace('%data%', spread[i].toFixed(4)));
			});

			$('.percent').each(function(i){
				$(this).replaceWith(HTMLPercent.replace('%data%', ((spread[i]/cost[i])*100).toFixed(2)));
			});
		
		}
	}
	xmlhttp.open("GET","/rate",true);
	xmlhttp.send();
},15000);