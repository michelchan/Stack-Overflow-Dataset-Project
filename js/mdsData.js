var data = [];
var xvector = [];
var yvector = [];
var width = $(window).width()* .7;
var height = $(window).height() * .8;
var padding = 5;
var counter = 1;
var margin = {top: 10, right: 10, bottom: 20, left: 100};

d3.json('../data/mds/mdsData.json', function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	data = json;
	initmdsData();
});


function initmdsData(){
	removePlots();
	makemdsData();
}

function makemdsData(){
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

	var mdsData = d3.select("#mdsData")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	mdsData.append("g")
		.call(xAxis)
        .attr("transform", "translate(0," + height + ")")
        .append("text")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
	mdsData.append("g")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")

	var colors = d3.scale.category10();

	mdsData.selectAll("circle")
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
		});

	var n = xvector.length;
	mdsData.selectAll()
}

function removePlots(){
	d3.select("#mdsData").selectAll("div")
	.remove();
	d3.select("#mdsData").selectAll("svg")
	.remove();
}