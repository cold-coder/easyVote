var http = require('http');
var fs = require('fs');
var server = http.createServer();
var queryString = require('querystring');

var ret = {}

/**
* Get the vote items according to the configure json file.
* @return Object 
*/
var configureItems = function(){
	var text = fs.readFileSync('Cfg.json');
	var result = JSON.parse(text);
		return result;
}();

var firstPage = function(res){
	res.writeHead(200,{'Content-Type':'text/html;charset=utf-8'});
	var html = '<!DOCTYPE html>'+
				'<html><head><title>Vote</title><link href="sty.css" rel="stylesheet" media="screen"></head>'+
				'<body><div id="block_l"></div><div id="block_r"></div><div id="main"><form action="/vote" method="post"><div class="radio-toolbar">'+
				createOptions(configureItems)+
				'</div><div id="btn"><input type="submit" value="Vote" class="btnn red"><a href="/result" class="btnn">Show Result</a></div></form></main></body></html>';
	res.end(html);
}

var vote = function(req, res){
	var info = '';
	req.addListener('data', function(chunk){
		info += chunk;
	}).addListener('end', function(){
		info = queryString.parse(info);
		var item = info.items;
		if(item){
			var add = req.connection.remoteAddress;
			if(add in ret){
				showMsg(res, 'One vote per IP...');
			}else{
				ret[add] = item;
				console.log(ret);
				showMsg(res, 'Thanks for your voting.');
			}
		}else{
			showMsg(res, 'Please select one name.');
		}
	});
}

var getSty = function(res){
	var expires = new Date();
	res.setHeader("Cache-Control","max-age=60");
	res.setHeader("Expires",expires.toUTCString());	
	
		fs.readFile("sty.css", 'utf-8', function(err, data){
			if(err) throw err;
			res.writeHead(200, {"Content-Type":	"text/css"});
			res.end(data);
		});
}

var viewResult = function(res){
	res.writeHead(200,{'Content-Type':'text/html'});
	var html = '<!DOCTYPE html>'+
				'<html><head><title>Vote</title><link href="sty.css" rel="stylesheet" media="screen"></head>'+
				'<body><div id="block_l"></div><div id="block_r"></div><div id="main">'+
				showResult()+
				'<div id="btn"><a href="/" class="btnn">Home</a></div></body></html>';
	res.end(html);
}

var showMsg = function(res, msg){
	res.writeHead(200,{'Content-Type':'text/html'});
	var html = '<!DOCTYPE html>'+
				'<html><head><title>Vote</title><link href="sty.css" rel="stylesheet" media="screen"></head>'+
				'<body><div id="block_l"></div><div id="block_r"></div><div id="main">'+
				msg+
				'<div id="btn"><a href="/" class="btnn">Home</a><a href="/result" class="btnn">Show Result</a></div></body></html>';
	res.end(html);
}

/**
* The Router, handle the coming request.
*/
var onRequest = function(req, res){
	if(req.url == '/'){
		return firstPage(res);
	}
	if(req.url == '/vote' && req.method == 'POST'){
		return vote(req, res);
	}
	if(req.url == '/sty.css'){
		return getSty(res);
	}
	if(req.url == '/result'){
		return viewResult(res);
	}else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.write("404 Not found");
		res.end();
  }
}


/**
* Generate Html options by input Object
* @param Object eg. {1:opt1, 2:opt2, 3:opt3}
* @return string
*/
var createOptions = function(itemObj){
	var html = "";
	for(key in itemObj){
		html += '<input type="radio"  value="'+ key +'" id="'+ key +'" name="items"><label for="'+ key +'">'+ itemObj[key] +'</label>';
	}
	return html;
}

/**
* Generate the Html poll result by ret obj
* @return string
*/
var showResult = function(){
	var retSet = {};
	for(key in configureItems){
		retSet[key] = 0;
	}
	for(key in ret){
		for(item in retSet){
			if(ret[key] == item) retSet[item]++;
		 }
	}
	var html = '<table class="pure-table pure-table-bordered"><thead><tr><th>Name</th><th>Count</th></tr></thead><tbody>';
	for(key in retSet){
		html += '<tr><td>'+ configureItems[key] + '</td><td>'+ retSet[key] +'</td></tr>';
	}
	html += '</tbody></table>';
	return html;
}


server.on('request', onRequest);

server.listen(8080);

console.log('server is on');
