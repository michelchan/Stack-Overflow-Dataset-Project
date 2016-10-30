var data = [];
var width = $(window).width()* .7;
var height = $(window).height() * .8;
var padding = 5;
var counter = 1;
var margin = {top: 10, right: 10, bottom: 20, left: 30};

function initScatterMatrix(){
	removeMatrix();
	makeScatterMatrix();
}

function makeScatterMatrix(){
	var xScale = d3.scale.linear()
		.domain([d3.min(data,function(d) {return d[0];}), d3.max(data, function(d) { return d[0]; })])
		.range([padding, width - padding * 2]);

	var yScale = d3.scale.linear()
		.domain([d3.min(data,function(d) {return d[1];}), d3.max(data, function(d) { return d[1]; })])
		.range([height - padding, padding]);

	//Define X axis
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom");

	//Define Y axis
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	var scatterMatrix = d3.select("#scatterMatrix")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	scatterMatrix.append("g")
		.call(xAxis)
        .attr("transform", "translate(0," + height + ")")
        .append("text")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
	scatterMatrix.append("g")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")

	var colors = d3.scale.category10();

	scatterMatrix.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d) {
			return xScale(d[0]);
		})
		.attr("cy", function(d) {
			return yScale(d[1]);
		})
		.attr("r", 4)
		.attr("fill", function(d,i){
			return colors(i);
		})
		.append("title");
}

function removeMatrix(){
	d3.select("#scatterMatrix").selectAll("div")
	.remove();
	d3.select("#scatterMatrix").selectAll("svg")
	.remove();
}

$(document).ready(function() {
	$("#body").show();
	$("#loading").hide();
	initScatterMatrix();

	// delete this when done VVVV
	d3.json("./data/correlation/correlation.json", function(error, json){
		var correlations = {};
		var objects = [];
		for (i in json){
			correlations[i] = 0;
			objects.push(json[i]);
		}
		for (var key in objects){
			for (var k in objects[key]){
				correlations[k] += objects[key][k];
			}
		}
		// Create items array
		var items = Object.keys(correlations).map(function(key) {
		    return [key, correlations[key]];
		});

		// Sort the array based on the second element
		items.sort(function(first, second) {
		    return second[1] - first[1];
		});
		items = items.slice(0,5);
	})
});