var data;
var rows = {};
var margin = {top: 10, right: 10, bottom: 20, left: 30};
var width = $(window).width()* .8;
var height = $(window).height() * .8;

var padding = 5;
var counter = 1;

d3.json("./data/datawithInts.json", function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	loadSelect(bivariateSelect1, attributes);
	loadSelect(bivariateSelect2, attributes);
	data = json;
	dataObjects = putValuesInArray(data);
	initBivariateGraph();
});

function initBivariateGraph () {
	removeGraph();
	makeBivariateGraph();
}

function makeBivariateGraph() {
	var variable1 = attributes[$('#bivariateSelect1').val()];
	var variable2 = attributes[$('#bivariateSelect2').val()];

	var var1Data = getDataByVariable(variable1);
	var var2Data = getDataByVariable(variable2);
	var varCombined = combineVariables(var1Data, var2Data);

	var xMin = Math.ceil(d3.min(var1Data)),
		xMax = Math.ceil(d3.max(var1Data));
	var yMin = Math.ceil(d3.min(var2Data)),
		yMax = Math.ceil(d3.max(var2Data));

	var x = d3.scale.linear().range([0, width]).domain([xMin,xMax]),
		xValue = function(d) { return d[0]; },
		xMap = function(d) { return x(xValue(d)); },
		xAxis = d3.svg.axis().scale(x).orient("bottom");

	var y = d3.scale.linear().range([height, 0]).domain([yMin,yMax]),
		yValue = function(d) { return d[1]; },
		yMap = function(d) { return y(yValue(d)); },
		yAxis = d3.svg.axis().scale(y).orient("left");

	var bivariateGraph = d3.select("#bivariateGraph")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	bivariateGraph.append("g")
		.call(xAxis)
        .attr("transform", "translate(0," + height + ")")
        .append("text")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text(variable1)
	bivariateGraph.append("g")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")
		.text(variable2);

	var colors = d3.scale.category20();

	bivariateGraph.selectAll("circle")
		.data(varCombined)
		.enter()
		.append("circle")
		.attr("cx", xMap)
		.attr("cy", yMap)
		.attr("r", 4)
		.attr("fill", function(d,i){
			return colors(i);
		})
		.append("title")
		.text(function(d){
			return variable1 + ": " + d[0] + ", " + variable2 + ": " + d[1];
		});
}

function getDataByVariable(str) {
	var array = [];
	for (var c in data) {
		array.push(data[c][str]);
	}
	return array;
}

function removeGraph(){
	d3.select("#bivariateGraph")
		.selectAll("div")
		.remove();
	d3.select("#bivariateGraph")
		.selectAll("svg")
		.remove();
}

function combineVariables(var1Data, var2Data) {
	var array = [];
	for (var i = 0; i < var1Data.length; i++){
		array.push([var1Data[i], var2Data[i]]);
	}
	return array;
}

$(document).ready(function() {
	$('select').not('.disabled').material_select();

	$('#bivariateSelect1').on('change', function(e) {
		$(this).material_select();
		var string = editString(attributes[$("#bivariateSelect1").val()]);
		initBivariateGraph();
	});
	$('#bivariateSelect2').on('change', function(e) {
		$(this).material_select();
		var string = editString(attributes[$("#bivariateSelect2").val()]);
		initBivariateGraph();
	});
});