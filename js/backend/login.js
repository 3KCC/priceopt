var userId = 'priceopt';
var pw = 'priceopt';
var cookies = [];

function validate(req, res){
	try{
		var auth = req.headers['authorization'].split(' ')[1];
		auth = new Buffer(auth, 'base64').toString().split(':');
		var username = auth[0];
		var password = auth[1];
		if(username === userId && password === pw){
			var ck = 'mycookie=' + req.headers['authorization'].split(' ')[1] + Math.round(Math.random()*100000);
			cookies.push(ck);
			res.writeHead(200, {
				'Set-Cookie': ck + '; expires='+new Date(new Date().getTime()+300000).toUTCString(),
			    'Content-Type': 'text/plain'
			  });
			res.end();
		}
	}catch(err){
		res.end('fasle');
	}
}

function checkCookie(req){
	return cookies.indexOf(req.headers['cookie']) !== -1;
}

function clearCookie(){
	cookies = [];
}
exports.validate = validate;
exports.checkCookie = checkCookie;
exports.clearCookie = clearCookie;