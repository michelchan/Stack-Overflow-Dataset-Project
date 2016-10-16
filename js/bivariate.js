var data;
var counts = {};
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
	initBarGraph();
});

function initBivariateGraph () {
	var xAxis = d3.svg.axis();
}