# request_http

## DESCRIPTION
`version`: `v2.9.1`
`author`: `Blind Holmes`

This is a simplified and powerful and Human-friendly HTTP request client.

## useAge:
```
var reqHttp = require("request_http");

var options = {
	method: 'get', // default 'get'
	url: 'https://www.google.com',
	port: 443,	// if http default 80, if https default 443
	headers: {
		'Content-Type': 'text/xml'	// default 'application/x-www-form-urlencoded'
	},
	data: {
		deviceId: 977748,
		deviceStatus: 'inGame'
	}
};

reqHttp(options, function (err, json, resHeaders) {
	if (err) {
		console.log(err);
	}
	console.log(resHeaders);
	console.log(json);
});
```

## test code
```

// GET TEST
var options = {
	url: 'https://www.google.com'
};

reqHttp(options, function (err, resBody, resHeaders) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(resHeaders);
	console.log(resBody);
});

// POST TEST
var options = {
	method: 'post',
	url: 'https://www.google.com'
};

reqHttp(options, function (err, resBody, resHeaders) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(resHeaders);
	console.log(resBody);
});

// POST DATA TEST
var options = {
	method: 'post',
	url: 'https://www.google.com',
	data: {
		a: 111,
		b: "2a2"
	}
};

reqHttp(options, function (err, resBody, resHeaders) {
	if (err) {
		console.log(err);
		return;
	}
	console.log(resHeaders);
	console.log(resBody);
});

// RESPONSE DATA CHUNK MODE
var options = {
	url: 'https://www.google.com/',
	chunkMode: true
};
var firstChunk = true;
reqHttp(options, function (err, chunkObj, resHeaders) {
	if (err) {
		console.log(err);
		return;
	}
	if (firstChunk) {
		console.log(resHeaders);
		firstChunk = false;
	}
	console.log(chunkObj);
	if (chunkObj.ended) {
		console.log("ALL DOCUMENT HAS READ COMLETED");
	}
});

// RESPONSE DATA LINE MODE
var options = {
	url: 'https://www.google.com/',
	lineMode: true
};
var firstLine = true;
reqHttp(options, function (err, lineObj, resHeaders) {
	if (err) {
		console.log(err);
		return;
	}
	if (firstLine) {
		console.log(resHeaders);
		firstLine = false;
	}
	console.log(lineObj);
	if (lineObj.ended) {
		console.log("ALL DOCUMENT HAS READ COMLETED");
	}
});

```