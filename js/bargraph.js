var data;
var counts = {};

d3.json("./data/data.json", function(error, json){
	if (error) return console.warn(error);
	data = json;
});

function initBarGraph(variable){
	removeBars();
	if (variable == 1){
		bucketData("job_satisfaction");
	}
	else if (variable == 2){
		bucketData("commit_frequency");
	}
	else {
		alert("Something went wrong");
		return;
	}
	makeGraph();
}

function bucketData(string){
	counts = _.countBy(data, string);
	console.log(counts);
}

function makeGraph(){
	d3.select("#barGraph").selectAll("div")
    .data(putValuesInArray())
    .enter()
    .append("div")
    .attr("class", "bar")
    .style("height", function(d){
    	return d/10 + "px";
    });
}

function putValuesInArray(){
	array = [];
	for (var c in counts){
		array.push(counts[c]);
	}
	return array;
}

function removeBars(){
	counts = {};
	d3.select("#barGraph").selectAll("div")
		.remove();
}

$( document ).ready(function() {
	initBarGraph(1);
	$('select').not('.disabled').material_select();
	$('#bargraphSelect').on('change', function(e) {
		$("#bargraphLabel").text($("#bargraphSelect").val())
		initBarGraph($("#bargraphSelect").val());
	});
});