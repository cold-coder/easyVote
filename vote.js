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
	var text = fs.readFileSync('Cfg.json','utf8');
	var result = JSON.parse(text.toString());
		return result;
}();

var firstPage = function(res){
	res.writeHead(200,{'Content-Type':'text/html'});
	var html = '<!DOCTYPE html>'+
				'<html><head><title>Vote</title></head>'+
				'<body><form action="/vote" method="post">'+
				createOptions(configureItems)+
				'<input type="submit" value="submit"></form><a href="/result">Show Result</a></body></html>';
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
				res.end('One vote per IP...');
			}else{
				ret[add] = item;
				console.log(ret);
				res.end('Thank you');
			}
		}
	});
}

var viewResult = function(res){
	res.end(showResult());
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
		html += '<input type="radio"  value="'+ key +'" name="items">'+ itemObj[key] +'</radio>';
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
	//console.log(retSet);
	var html = "<table><tr><th>Name</th><th>Count</th></tr>";
	for(key in retSet){
		html += '<tr><td>'+ configureItems[key] + '</td><td>'+ retSet[key] +'</td></tr>';
	}
	html += '</table>';
	return html;
}


server.on('request', onRequest);

server.listen(8080,"127.0.0.1");

console.log('server is on');
