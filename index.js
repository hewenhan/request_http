// useAge:
// var reqHttp = require("request_http");

// var options = {
// 	method: 'get', // default 'get'
// 	url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential',
// 	port: 443,	// if http default 80, if https default 443
//	headers: {
//		'Content-Type': 'text/xml'	// default 'application/x-www-form-urlencoded'
//	},
// 	data: {
// 		deviceId: 977748,
// 		deviceStatus: 'inGame'
// 	}
// };

// reqHttp(options, function (err, json) {
// 	if (err) {
// 		console.log(err);
// 	}
// 	console.log(json);
// });

var querystring = require('qs');
var https = require('https');
var http = require('http');
var url = require('url');
var piXml = require('pixl-xml');

var resDataParse = function (resData) {
	try {
		JSON.parse(resData);
	} catch(e) {
		try {
			piXml.parse(resData);
		} catch(e) {
			return resData;
		}
		return piXml.parse(resData);
	}
	return JSON.parse(resData);
};

var maxListenersAdd = function (emitter, number) {
	return emitter.setMaxListeners(emitter.getMaxListeners() + number);
};

var doCallBack = function (reqOptions, callback) {
	if (!reqOptions.canBeCallBacked) {
		return;
	}
	reqOptions.canBeCallBacked = false;
	callback();
};

var tryHttp = function (protocol, reqOptions, callback) {

	if (typeof reqOptions.data == 'object' && reqOptions.headers['Content-Type'] != 'application/octet-stream') {
		var dataStr = querystring.stringify(reqOptions.data);
	} else {
		var dataStr = reqOptions.data;
	}

	if (reqOptions.method == null) {
		reqOptions.method = '';
	}
	if (reqOptions.timeout == null) {
		reqOptions.timeout = 60000;
	}

	switch (reqOptions.method.toLowerCase()) {
		case 'get':
		var concatStr = '?';
		if (reqOptions.hasQuery) {
			concatStr = '&';
		}
		if (dataStr != null) {
			reqOptions.path += concatStr + dataStr;
		}
		reqOptions.method = 'GET';
		break;
		case 'post':
		reqOptions.method = 'POST';
		if (reqOptions.headers['Content-Type'] == 'application/json') {
			dataStr = JSON.stringify(reqOptions.data);
		}
		break;
		default:
		var concatStr = '?';
		if (reqOptions.hasQuery) {
			concatStr = '&';
		}
		if (dataStr != null) {
			reqOptions.path += concatStr + dataStr;
		}
		reqOptions.method = 'GET';
	}


	var json;
	var resData = '';
	var err;

	// console.log(reqOptions);

	var req = protocol.request(reqOptions, function (res) {
		if (reqOptions.headers['Content-Type'] != 'application/octet-stream') {
			res.setEncoding('utf8');
		}
		res.on('data', function (chunk) {
			if (resData == "") {
				resData = chunk;
				return;
			}
			resData += chunk;
		});
		res.on('end', function () {
			if (res.statusCode >= 400) {
				doCallBack(reqOptions, function () {
					callback(`REQUEST GET CODE ${res.statusCode}`);
				});
				req.abort();
				return;
			}
			doCallBack(reqOptions, function () {
				callback(err, resDataParse(resData));
			});
		})
	});

	req.on('error', function (err) {
		doCallBack(reqOptions, function () {
			callback(err);
		});
	});

	req.setTimeout(reqOptions.timeout, function () {
		console.log(`${new Date()}: REQUEST_TIMEOUT ${reqOptions.hostname} ${reqOptions.method} ${reqOptions.path}`);
		doCallBack(reqOptions, function () {
			callback(`${new Date()}: REQUEST_TIMEOUT ${reqOptions.hostname} ${reqOptions.method} ${reqOptions.path}`);
		});
		req.abort();
	});

	if (reqOptions.method.toLowerCase() == 'post') {
		// write post data to request body
		req.write(dataStr);
	}

	req.end();
};

var reqHttp = function (options, callback) {
	if (callback == null) {
		callback = function () {};
	}
	if (options.url == null) {
		callback('url is null');
		return;
	}
	var urlParse = url.parse(options.url);
	if (options.headers == null) {
		options.headers = {};
	}
	if (options.headers['Content-Type'] == null) {
		options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
	}
	var reqOptions = {
		hostname: urlParse.hostname,
		path: urlParse.path,
		method: options.method,
		headers: options.headers,
		data: options.data,
		timeout: options.timeout,
		hasQuery: false,
		canBeCallBacked: true
	};

	if (urlParse.query != null) {
		reqOptions.hasQuery = true;
	}
	if (urlParse.protocol == null) {
		callback('protocol is null');
		return;
	}
	if (urlParse.protocol == 'http:') {
		reqOptions.port = options.port == null ? 80 : options.port;
		protocol = http;
	}
	if (urlParse.protocol == 'https:') {
		reqOptions.port = options.port == null ? 443 : options.port;
		protocol = https;
	}
	if (urlParse.port != null) {
		reqOptions.port = urlParse.port;
	}
	tryHttp(protocol, reqOptions, callback);
};

module.exports = reqHttp;
