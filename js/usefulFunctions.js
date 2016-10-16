function loadSelect(selectName, attributes){
	var selectHTML="";
	var attr = Object.keys(attributes);
	for (i=1; i<attr.length+1; i++){
		selectHTML += "<option value="+ i +">" + attributes[i] +"</option>\n";
	}
	$(selectName).append(selectHTML);
	$(selectName).trigger('change');
}

function editString(string){
	string = string.replace(/_/g," ");
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function putValuesInArray(jsonArray){
	objectArray = [];
	for (var c in jsonArray){
		objectArray.push(jsonArray[c]);
	}

	return objectArray;
}