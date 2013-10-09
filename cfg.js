var fs = require('fs');

var configure = function(){
	var text = fs.readFileSync('Cfg.json');
	var result = JSON.parse(text);
		return result;
}



var obj = configure();

var createOptions = function(itemObj){
	var html = "";
	for(key in itemObj){
		html += '<input type="radio"  value="'+ key +'" name="item">'+ itemObj[key] +'</radio>'
	}
	return html;
}

console.log(createOptions(obj));