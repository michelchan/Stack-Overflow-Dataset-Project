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
	var brushText = d3.select("#brushText")
		.append("g");
	var text = brushText.append("text")
		.attr("id", "brushNumber")
	    .text("Number of participants who selected these options: " + 0)
	    .attr("x", 35)
	    .attr("y", 12);
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
	var adjustedHeights = [];

	var arrayMin = Math.ceil(d3.min(countsValue));
	var arrayMax = Math.ceil(d3.max(countsValue));

	var xScale = d3.scale.linear()
		.domain([0, countsValue.length])
		.range([0, width])
		.nice();

	var yScale = d3.scale.linear()
		.range([padding, graphHeight - padding])
		.domain([0, arrayMax])
		.nice();

	for (var i = 0; i<countsValue.length; i++){
		adjustedHeights[i] = yScale(countsValue[i]);
		console.log(countsValue[i] + " new : " + adjustedHeights[i])
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

	var colors = d3.scale.category20();

	barGraph.selectAll("rect")
		.data(adjustedHeights)
		.enter()
		.append("svg:rect")
		.attr("x", function(d,i){
			return xScale(i);
		})
		.attr("y", function(d){
			return graphHeight - d;
			// return yScale(i);
		})
		.attr("height", function(d) {
			return d;
		})
		.attr("width", width/numAttr - padding)
		.attr("fill", function(d,i){
			return colors(i);
		});

	var trying = [];
	var sum = 0;
	for (i in counts){
		var dict = {};
		dict[i] = counts[i];
		sum += counts[i];
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
	
	var brushStart = 0;
	var brushEnd = sum;
	var range = width/numAttr;

	var brush = d3.svg.brush()
		.x(xScale)
		.on("brush", function() {
			    b = brush.extent();

			    var localBrushStart = (brush.empty()) ? brushStart : Math.ceil(xScale(b[0])/range)*range,
			        localBrushEnd = (brush.empty()) ? brushEnd : Math.ceil(xScale(b[1])/range)*range;

			    // Snap to rect edge
			    d3.select("g.brush").call((brush.empty()) ? brush.clear() : 
			    	brush.extent([xScale.invert(localBrushStart), xScale.invert(localBrushEnd)]));

			    // Fade all years in the histogram not within the brush
			    d3.selectAll("rect.bar").style("opacity", function(d, i) {
			      return d.x >= localBrushStart && d.x < localBrushEnd || brush.empty() ? "1" : ".4";
			    });
			})
		.on("brushend", function(){
			var localBrushStart = (brush.empty()) ? brushStart : Math.ceil(xScale(b[0])/range)*range;
		    var localBrushEnd = (brush.empty()) ? brushEnd : Math.ceil(xScale(b[1])/range)*range;

		    d3.selectAll("rect.bar").style("opacity", function(d, i) {
		      return d.x >= localBrushStart && d.x <= localBrushEnd || brush.empty() ? "1" : ".4";
		    });

		    var startingIndex = localBrushStart/range;
		    var endingIndex = localBrushEnd/range;
		    var selectedSum = 0;
		    for (var i = startingIndex; i < endingIndex; i++){
		    	selectedSum += countsValue[i];
		    }
		    d3.select("#brushNumber")
		    	.text(localBrushStart == localBrushEnd ? 
		    		"Number of participants who selected these options: " + 0 : 
		    		"Number of participants who selected these options: " + selectedSum);

		});

	var arc = d3.svg.arc()
		.outerRadius(height / 15)
		.startAngle(0)
		.endAngle(function(d,i) {return i ? -Math.PI : Math.PI});

	var brushing = barGraph.append("g")
		.attr("class", "brush")
		.call(brush);

	brushing.selectAll(".resize").append("path")
		.attr("transform", "translate(0," + height/2 + ")")
		.attr("d", arc);
	brushing.selectAll("rect")
		.attr("height", height);

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
	// $('#barGraph').click(function() {
	// 	counter++;
	// 	var string = editString(attributes[counter]);
	// 	$("#bargraphLabel").text(string)
	// 	$('#barGraphSelect').val(attributes[counter]);
	// 	$('#barGraphSelect').material_select();
	// 	init();
	// });
});