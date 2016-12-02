var data; // original json of the data
var counts = {}; // object that holds each option + # of times it appears
var width = $(window).width()* .7;
var height = $(window).height() * .7;
var padding = 5;
var counter = 1;

d3.json("./data/original/data.json", function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	loadSelect('#bargraphSelect', attributes);
	data = json;
	initBarGraph();
});

function initBarGraph(){
	removeBars();
	if (counter)
		bucketData(attributes[counter]);
	makeBarGraph();
}

function bucketData(string){
	counts = _.countBy(data, string);
}

function makeBarGraph(){
	var numAttr = Object.keys(counts).length;
	var countsValue = putValuesInArray(counts); // everything in counts as an array
	var adjusted = []; // countsValue but adjusted to the new scale

	var arrayMin = Math.ceil(d3.min(countsValue));
	var arrayMax = Math.ceil(d3.max(countsValue));

	var x = d3.scale.linear()
		.domain([0, countsValue.length])
		.range([0,width]);

	var y = d3.scale.linear()
		.domain([arrayMin, arrayMax]);


	for (var i = 0; i<countsValue.length; i++){
		adjusted[i] = x(countsValue[i]);
	}

	var barGraph = d3.select("#barGraph")
		.append("svg:svg")
		.attr("width", width)
		.attr("height", height);

	var colors = d3.scale.category20();

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
		.attr("fill",function(d,i){
			return colors(i)
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
			.attr({
				transform:"translate("+offsetX+ ","+offsetY+") "+
				"scale(2) "+
				"translate(-"+offsetX+",-"+offsetY+ ")"
			});
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
		initBarGraph();
	});
	$('#barGraph').click(function() {
		counter++;
		var string = editString(attributes[counter]);
		$("#bargraphLabel").text(string)
		$('#barGraphSelect').val(attributes[counter]);
		$('#barGraphSelect').material_select();
		initBarGraph();
	});
});