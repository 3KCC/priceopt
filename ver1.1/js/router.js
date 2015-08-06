var request = require('request');
var connect = require('connect');
var http = require('http');
var async = require('async');
var fs = require('fs');
var app = connect();

http.createServer(app).listen(3000);

function ajax_routing(res){
	var xmlhttp = new XMLHttpRequest();    
	xmlhttp.onreadystatechange=function()
		{
		  if (xmlhttp.readyState==4 && xmlhttp.status==200)
		  {
		    document.getElementById("content").innerHTML="new Page";
		  }
		}
	xmlhttp.open("GET","/res",true);
	xmlhttp.send();
}