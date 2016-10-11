var data;
var counts = {};
var width = $(window).width()* .7;
var height = $(window).height() * .5;
var padding = 5;
var counter = 1;

d3.json("./data/data.json", function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	loadSelect();
	data = json;
});

function initBarGraph(){
	removeBars();
	if (counter)
		bucketData(attributes[counter]);
	makeGraph();
}

function bucketData(string){
	counts = _.countBy(data, string);
	console.log(counts);
}

function makeGraph(){
	var numAttr = Object.keys(counts).length;
	var countsValue = putValuesInArray();
	var adjusted = [];

	var arrayMin = Math.floor(d3.min(array));
	var arrayMax = Math.floor(d3.max(array));

	// var x = d3.scaleLinear()
	// 		.domain([0, countsValue.length])
	// 		.range([0,width]);
	var x = d3.scale.linear()
		.domain([0, countsValue.length])
		.range([0,width]);

	// var y = d3.scaleLinear()
	// 		.domain([arrayMin,arrayMax]);
	var y = d3.scale.linear()
		.domain([arrayMin, arrayMax]);

	for (var i = 0; i<array.length; i++){
		adjusted[i] = x(array[i]);
	}

	var barGraph = d3.select("#barGraph")
		.append("svg:svg")
		.attr("width", width)
		.attr("height", height);

	var rect = barGraph.selectAll("rect")
		.data(adjusted)
		.enter()
		.append("svg:rect")
		.attr("x", function(d,i){
			return x(i)
		})
		.attr("y", function(d){
			return height - y(d);
		})
		.attr("height", function(d) {
			return y(d);
		})
		.attr("width", width/numAttr - padding)
		.attr("fill","green")


	// barGraph.selectAll("rect")
	// 	.data(countsValue)
	// 	.enter()
	// 	.append("svg.title")
	// 	.text(function(d){
	// 		return d;
	// 	});

	barGraph.selectAll("rect")
		.on("mouseover", hoverOver)
		.on("mouseout", hoverOut);

	// barGraph.selectAll("text")
	// 	.append("svg:text")

	// barGraph.selectAll("text.yAxis")
	// 	.data(countsValue)
	// 	.enter()
	// 	.append("svg:text")
	// 	.attr("x", function(d,i){
	// 		return x(i)+(width/numAttr - padding)
	// 	})
	// 	.attr("y", height)
	// 	.attr("dx", -(width/numAttr - padding)/2)
	// 	.attr("text-anchor", "middle")
	// 	.attr("style", "font-family: Helvetica, sans-serif")
	// 	.text(function(d){
	// 		return d;
	// 	})
	// 	.attr("class","yAxis");

	// var svg = d3.select("#barGraph")
	// 	.append("svg")
	// 	.attr("width", width)
	// 	.attr("height", height);

	// svg.selectAll("rect")
	// 	.data(adjusted)
	// 	.enter()
	// 	.append("rect")
	// 	.attr("x", function(d,i){
	// 		return i * (width/numAttr);
	// 	})
	// 	.attr("y", function(d){
	// 		return height - d;
	// 	})
	// 	.attr("width", width/numAttr - padding)
	// 	.attr("height", function(d){
	// 		return d;
	// 	})
	// 	.attr("fill", function(d){
	// 		return "rgb("+ d +", 233 , 30)";
	// 	})
	// 	.on("mouseover", function(d){
	// 		var hoveredBar = d3.select(this).style({opacity:'0.8'});
	// 		hoveredBar.select("text").style({opacity:'1.0'});
	// 	})
	// 	.on("mouseout", function(d){
	// 		var outBar = d3.select(this).style({opacity:'1.0'});
	// 		outBar.select("text").style({opacity:'0'});
	// 	});
}

function hoverOver(){
	d3.select(this)
		.style({opacity:'0.8'});
}

function hoverOut(){
	d3.selectAll("rect")
		.style({opacity:'1.0'})
}

function putValuesInArray(){
	array = [];
	for (var c in counts){
		array.push(counts[c]);
	}

	return array;
}

function removeBars(){
	counts = {};
	d3.select("#barGraph").selectAll("div")
	.remove();
	d3.select("#barGraph").selectAll("svg")
	.remove();
}

function loadSelect(){
	var selectHTML="";
	var attr = Object.keys(attributes);
	for (i=1; i<attr.length+1; i++){
		selectHTML += "<option value="+ i +">" + attributes[i] +"</option>\n";
	}
	$('#bargraphSelect').append(selectHTML);
	$('#bargraphSelect').trigger('change');
}

function editString(string){
	string = string.replace("_"," ");
	return string.charAt(0).toUpperCase() + string.slice(1);
}

$(document).ready(function() {
	$('select').not('.disabled').material_select();

	$('#bargraphSelect').on('change', function(e) {
		$(this).material_select();
		var string = editString(attributes[$("#bargraphSelect").val()]);
		$("#bargraphLabel").text(string)
		counter = $("#bargraphSelect").val();
		initBarGraph(counter);
	});
	$('#barGraph').click(function() {
		counter++;
		var string = editString(attributes[$("#bargraphSelect").val()]);
		$("#bargraphLabel").text(string)
		$('#barGraphSelect').val(counter);
		$('#barGraphSelect').material_select();
		initBarGraph(counter);
	});
});