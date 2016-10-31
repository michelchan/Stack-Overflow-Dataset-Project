var data = [];
var attributes = [];
var width = $(window).width() * .6;
var height = $(window).height() * .8;
var padding = 5;
var counter = 1;
var margin = {top: 100, right: 80, bottom: 25, left: 60};

d3.csv("./data/correlation/correlation.json", function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();

	data = json;
	
	initParallelCoord();
});

function initParallelCoord(){
	removeMatrix();
	makeParallelCoord();
}

function makeParallelCoord(){
	var x = d3.scale.ordinal()
		.rangePoints([0, width], 1)
		.domain(d3.keys()),
		y = {};

	var line = d3.svg.line(),
		axis = d3.svg.axis().orient("left");

	var parallelCoord = d3.select("#parallelCoord")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

}

function removeMatrix(){
	d3.select("#parallelCoord").selectAll("div")
	.remove();
	d3.select("#parallelCoord").selectAll("svg")
	.remove();
}

$(document).ready(function() {
	$("#body").show();
	$("#loading").hide();
	initParallelCoord();
});