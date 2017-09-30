# request_http

## useAge:
```
var reqHttp = require("request_http");

var options = {
	method: 'get', // default 'get'
	url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
	port: 443,	// if http default 80, if https default 443
	headers: {
		'Content-Type': 'text/xml'	// default 'application/x-www-form-urlencoded'
	},
	data: {
		deviceId: 977748,
		deviceStatus: 'inGame'
	}
};

reqHttp(options, function (err, json) {
	if (err) {
		console.log(err);
	}
	console.log(json);
});
```