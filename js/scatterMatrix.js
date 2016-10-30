var data = [];
var corr = [];
var width = $(window).width()* .7;
var height = $(window).height();
var padding = 5;
var counter = 1;
var margin = {top: 40, right: 10, bottom: 20, left: 30};

//@TODO put everything as objects into data. And fix it.

d3.json("./data/correlation/correlation.json", function(error, json){
	if (error) return console.warn(error);

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
	corr = items.slice(0,5);
});

d3.json("./data/correlation/forCorrelationMatrix.json", function(error2, d) {
	if (error2) return console.warn(error2);
	for (object in d){
		for (i in corr){
			data.push([corr[i][0], d[object][corr[i][0]]]);
			// data[items[i][0]] = d[object][items[i][0]]; //if going back to objects
		}
	}
	initScatterMatrix();
});

function initScatterMatrix(){
	removeMatrix();
	makeScatterMatrix();
}

function makeScatterMatrix(){
	var color = d3.scale.category10();
	var domain = d3.set(corr.map(function(d) {
          return d[0]
        })).values();

	var boxWidth = 600, boxHeight = 600;

	var x = d3.scale.ordinal()
		.rangePoints([0,boxWidth - margin.left - margin.right])
		.domain(domain),
		xSpace = x.range()[1] - x.range()[0];
	var y = d3.scale.ordinal()
		.rangePoints([0,boxHeight - margin.top - margin.bottom])
		.domain(domain),
		ySpace = y.range()[1] - y.range()[0];

	var num = Math.sqrt(data.length);

	var scatterMatrix = d3.select("#scatterMatrix")
		.append("svg")			
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var box = scatterMatrix.selectAll(".box")
		.data(corr)
		.enter()
		.append("g")
		.attr("class", "box")
		.attr("transform", function(d) {
        	return "translate(" + (x(d[0]) + margin.left + margin.right )+ "," + (y(d[0]) + margin.top) + ")";
        });

	box.append("rect")
	    .attr("width", xSpace)
        .attr("height", ySpace)
        .attr("x", - xSpace / 2)
        .attr("y", - ySpace / 2)

    box.filter(function(d){
			var ypos = domain.indexOf(d[1]);
			var xpos = domain.indexOf(d[0]);
			for (var i = (ypos + 1); i < num; i++){
				if (i === xpos) return true;
			}
			return false;
		})
		.append("rect")
		.attr("width", xSpace)
		.attr("height", ySpace)
		.attr("x", - xSpace / 2)
        .attr("y", - ySpace / 2)
		.style("fill", "#fff");			

    box.filter(function(d){
	    var ypos = domain.indexOf(d[0]);
	    var xpos = domain.indexOf(d[0]);
	    	for (var i = (ypos + 1); i < num; i++){
	    		if (i === xpos) return false;
	    	}
	    	return true;
	    })
		.append("text")
        .attr("y", 5)
        .text(function(d) {
        	if (d[0]) {
        		return d[0];
        	} else {
        		return d[1].value.toFixed(2);
        	}
        })
        .style("fill", "#000");


	// scatterMatrix.selectAll("circle")
	// 	.data(data)
	// 	.enter()
	// 	.append("circle")
	// 	.attr("cx", function(d) {
	// 		return xScale(d[0]);
	// 	})
	// 	.attr("cy", function(d) {
	// 		return yScale(d[1]);
	// 	})
	// 	.attr("r", 4)
	// 	.attr("fill", function(d,i){
	// 		return colors(i);
	// 	})
	// 	.append("title");
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
});