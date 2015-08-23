function login(){
	var xmlhttp = new XMLHttpRequest();    
	xmlhttp.onreadystatechange=function(){
		if (xmlhttp.readyState==4 && xmlhttp.status==200){
			if(xmlhttp.responseText === 'false'){
				document.getElementById("loginMess").innerHTML = "Your login attempt was not successful. Please try again."	
			}else{
				window.location.replace('./home');
			}
		}
	}
	var userId = $('#LoginControl_UserName').val();
	var pw = $('#LoginControl_Password').val();
	var ss = Math.round(Math.random()*100000);
	var query = "/login?userId=" + userId + "&pw=" + pw + "&ss=" + ss;
	var auth = 'Basic ' + window.btoa(userId+':'+pw);
	xmlhttp.open("GET",query,true);
	xmlhttp.setRequestHeader("Authorization", auth);
	xmlhttp.send();
}