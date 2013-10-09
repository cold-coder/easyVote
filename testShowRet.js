var ret = {
'2.2.3.4': '5',
'2.5.3.4': '5',
'2.1.3.4': '4',
'2.8.3.4': '5',
'2.2.1.4': '4',
'4.2.1.4': '1'
}

var configureItems = { '1': 'BMW',
  '2': 'Porsche',
  '3': 'Benz',
  '4': 'Ferrari',
  '5': 'SAAB',
  '6': 'Audi' }

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
	var html = "<table><tr><th>Name</th><th>Count</th></tr>";
	for(key in retSet){
		html += '<tr><td>'+ configureItems[key] + '</td><td>'+ retSet[key] +'</td></tr>';
	}
	html += '</table>';
	console.log(html);
}

showResult();