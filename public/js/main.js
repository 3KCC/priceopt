var HTMLRowGeneral = '<tr>%data%</tr>';
var HTMLCcy = '<td class="ccy">%data%</td>';
var HTMLLive = '<td class="live">%data%</td>';
var liveRate;
$(document).ready(function() {
	for(var i=0;i<ccys.length;i++){
		$("#input-tb").append(HTMLRowGeneral.replace("%data%",HTMLCcy.replace("%data%",ccys[i])));
	}
	$(".ccy").first().append(HTMLLive.replace('%data%', 'N/A'));
});


	//setInterval(function(){
		var xmlhttp = new XMLHttpRequest();    
		xmlhttp.onreadystatechange=function()
		{
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		  {
		    liveRate = JSON.parse(xmlhttp.responseText);
		    liveRate = $.map(liveRate, function(elm) { return elm; });
		    //console.log(liveRate);

	    /*for(var i=0;i<ccys.length;i++){
			$(".").append(HTMLRowGeneral.replace("%data%",HTMLccy.replace("%data%",ccys[i])));
		}*/
			$(".ccy").first().append(HTMLLive.replace('%data%', liveRate[0]));
		  }
		}
		xmlhttp.open("GET","/rate",true);
		xmlhttp.send();
	//},30000);
