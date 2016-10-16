var data;
var rows = {};
var width = $(window).width()* .7;
var height = $(window).height() * .8;
var padding = 5;
var counter = 1;

d3.json("./data/datawithInts.json", function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	loadSelect();
	data = json;
	initBivariateGraph();
});

function initBivariateGraph () {
	makeBivariateGraph();
}

function makeBivariateGraph() {
	var numAttr = Object.keys(rows).length;
	var countsValue = putValuesInArray();
	var adjusted = [];

	var arrayMin = Math.ceil(d3.min(array));
	var arrayMax = Math.ceil(d3.max(array));

	var x = d3.scale.linear()
		.domain([0, countsValue.length])
		.range([0,width]);

	var y = d3.scale.linear()
		.domain([arrayMin, arrayMax]);

	var xAxis = d3.svg.axis();
	xAxis.scale(x);
	xAxis.orient("bottom");
}