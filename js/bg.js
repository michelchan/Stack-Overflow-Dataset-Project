var data; // original json of the data
var counts = {}; // object that holds each option + # of times it appears

var width = $(window).width() * .9;
var height = $(window).height() * .7;
var padding = 5;
var counter = 1;
var margin = {top: 10, right: 10, bottom: 20, left: 50};

d3.json("./data/original/data.json", function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	loadSelect('#bargraphSelect', attributes);
	data = json;
	init();
});

function init(){
	removeBars();
	if (counter)
		bucketData(attributes[counter]);
	makeBarGraph();
}

function bucketData(string){
	counts = _.countBy(data, string);
}

function makeBarGraph(){
	var graphHeight = 500;
	var numAttr = Object.keys(counts).length;
	var countsValue = putValuesInArray(counts); // everything in counts as an array
	var adjusted = []; // countsValue but adjusted to the new scale
	var adjustedHeights = [];

	var arrayMin = Math.ceil(d3.min(countsValue));
	var arrayMax = Math.ceil(d3.max(countsValue));

	var xScale = d3.scale.linear()
		.domain([0, countsValue.length])
		.range([0, width])
		.nice();

	var yScale = d3.scale.linear()
		.range([graphHeight - padding, padding])
		.domain([0, arrayMax])
		.nice();

	for (var i = 0; i<countsValue.length; i++){
		adjusted[i] = xScale(countsValue[i]);
	}

	for (var i = 0; i<countsValue.length; i++){
		adjustedHeights[i] = yScale(countsValue[i]);
	}

	//Define X axis
	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient("bottom")
		.tickFormat("");

	//Define Y axis
	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient("left");

	var barGraph = d3.select("#barGraph")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	barGraph.append("g")
		.call(xAxis)
        .attr("transform", "translate(0," + graphHeight + ")")
        .append("text")
        .attr("x", width)
        .attr("y", -6)
        .style("text-anchor", "end")
	barGraph.append("g")
		.call(yAxis)
		.append("text")
		.attr("transform", "rotate(-90)")
		.attr("y", 6)
		.attr("dy", ".71em")
		.style("text-anchor", "end")

	var colors = d3.scale.category10();

	barGraph.selectAll("rect")
		.data(adjusted)
		.enter()
		.append("svg:rect")
		.attr("x", function(d,i){
			return xScale(i)
		})
		.attr("y", function(d,i){
			return graphHeight - adjustedHeights[i];
			// return yScale(i);
		})
		.attr("height", function(d, i) {
			console.log(adjustedHeights[i]);
			return adjustedHeights[i];
			// return graphHeight - yScale(d);
		})
		.attr("width", width/numAttr - padding)
		.attr("fill", function(d,i){
			return colors(i);
		});

	var trying = []
	for (i in counts){
		var dict = {};
		dict[i] = counts[i];
		trying.push(dict);
	}

	barGraph.selectAll("rect")
		.data(trying)
		.append("svg:title")
		.text(function(d,i){
			var dKey = Object.keys(d)[0];
			return dKey != "" ? dKey + ": " + d[dKey] : "Didn't Answer" + ": " + d[dKey];
		});
	// if (trying.length < 12){
	// 	trying.forEach(function(d,i){
	// 		var dKey = Object.keys(d)[0];
	// 		barGraph.append("text")
	// 		.text(function(d){
	// 			return dKey != "" ? dKey : "Didn't Answer";
	// 		})
	// 		.attr("fill", "black")
	// 	    .attr("text-anchor", "end")
	// 	    .attr('x', margin.left)
	// 	    .attr("transform", function(d){
	// 	    	var w = width/(trying.length);
	//     		return "translate("+ (i * w + i )+ ", " + (graphHeight + margin.top + margin.bottom)+ ")";
	//     	});
	// 	})
	// }
	

	barGraph.selectAll("rect")
		.on("mouseover", hoverOver)
		.on("mouseout", hoverOut);
}

function hoverOver(){
	d3.selectAll('rect')
		.style({opacity:'0.3'})
		.transition()
		.duration(5000)

		var selection = d3.select(this);
		var offsetX = parseFloat(selection.attr("x")) + parseFloat(selection.attr("width")/2.0);
		var offsetY = parseFloat(selection.attr("y")) + parseFloat(selection.attr("height")/2.0);
		selection.style({opacity:'1'})
			.transition()
			.duration(500)
			.style("fill",function(d){
				var color = d3.rgb($(this).attr("fill"))
				return color.darker(1);
			})
			// .attr({
			// 	transform:"translate("+offsetX+ ","+offsetY+") "+
			// 	"scale(2) "+
			// 	"translate(-"+offsetX+",-"+offsetY+ ")"
			// });
		this.parentNode.appendChild(this);
}

function hoverOut(){
	var value = $(this).children('title').val();
	// value = x(value);
	var colors = d3.scale.category20();

	d3.selectAll('rect')
		.style({opacity:'1'});

	d3.select(this)
		.transition()
		.duration(500)
		.attr("transform", "scale(1)")
		.style("fill",function(d,i){
			return colors[i];
		});
}

function removeBars(){
	counts = {};
	d3.select("#barGraph").selectAll("div")
	.remove();
	d3.select("#barGraph").selectAll("svg")
	.remove();
}

$(document).ready(function() {
	$('select').not('.disabled').material_select();

	$('#bargraphSelect').on('change', function(e) {
		$(this).material_select();
		var string = editString(attributes[$("#bargraphSelect").val()]);
		$("#bargraphLabel").text(string)
		counter = $("#bargraphSelect").val();
		init();
	});
	$('#barGraph').click(function() {
		counter++;
		var string = editString(attributes[counter]);
		$("#bargraphLabel").text(string)
		$('#barGraphSelect').val(attributes[counter]);
		$('#barGraphSelect').material_select();
		init();
	});
});