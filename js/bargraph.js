var data;
var counts = {};
var width = $(window).width();
var height = $(window).height();
var padding = 5;

d3.json("./data/data.json", function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	loadSelect();
	data = json;
});

function initBarGraph(variable){
	removeBars();
	if (variable)
		bucketData(attributes[variable]);
	makeGraph();
}

function bucketData(string){
	counts = _.countBy(data, string);
	console.log(counts);
}

function makeGraph(){
	var numAttr = Object.keys(counts).length;
	var countsValue = putValuesInArray();

	var svg = d3.select("#barGraph")
		.append("svg")
		.attr("width", width)
		.attr("height", height);

	svg.selectAll("rect")
		.data(countsValue)
		.enter()
		.append("rect")
		.attr("x", function(d,i){
			return i * (width/numAttr);
		})
		.attr("y", function(d){
			return height - d;
		})
		.attr("width", width/numAttr - padding)
		.attr("height", function(d){
			return d;
		})
		.attr("fill", function(d){
			return "rgb("+ d +", 233 , 30)";
		})
		.on("mouseover", function(d){
			var hoveredBar = d3.select(this).style({opacity:'0.8'});
			hoveredBar.select("text").style({opacity:'1.0'});
		})
		.on("mouseout", function(d){
			var outBar = d3.select(this).style({opacity:'1.0'});
			outBar.select("text").style({opacity:'0'});
		});

	svg.selectAll("text")
		.data(countsValue)
		.enter()
		.append("text")
		.text(function(d) {
			return d;
		})
		.attr("x", function(d, i) {
			return i * (width / numAttr) + 50;
		})
		.attr("y", function(d){
			return height - d;
		})
		.attr("font-family", "sans-serif")
		.attr("font-size", (width/numAttr)/5 + "px")
		.attr("fill", "purple")
		.attr("text-anchor", "middle");
}

function putValuesInArray(){
	array = [];
	for (var c in counts){
		array.push(counts[c]);
	}
	console.log(array);
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
	console.log(selectHTML);
	$('#bargraphSelect').append(selectHTML);

	$('#bargraphSelect').trigger('contentChanged');

}

$(document).ready(function() {
	initBarGraph(1);
	$('select').not('.disabled').material_select();
	$('#bargraphSelect').on('contentChanged', function() {
	  	// re-initialize (update)
		$(this).material_select();
	});
	$('#bargraphSelect').on('change', function(e) {
		$("#bargraphLabel").text($("#bargraphSelect").val())
		initBarGraph($("#bargraphSelect").val());
	});
});