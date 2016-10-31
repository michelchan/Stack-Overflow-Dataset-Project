var data = [];
var corr = [];
var attributes = [];
var position = {};
var width = $(window).width()* .7;
var height = $(window).height();
var padding = 20;
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
	items = items.slice(0,5);
	for (var i = 0; i < items.length; i++){
		for (var j = 0; j < items.length; j++){
			corr.push([items[i][0],items[j][0]]);
		}
	}

	for (var i = 0; i < items.length; i++){
		attributes.push(items[i][0]);
	}
});

d3.json("./data/correlation/forCorrelationMatrix.json", function(error2, d) {
	if (error2) return console.warn(error2);
	for (object in d.values){
		var item = [];
		for (i in corr){
			// data.push([corr[i][0], d[object][corr[i][0]]]);
			item[corr[i][0]] = d.values[object][corr[i][0]]
			// data[corr[i][0]] = d[object][corr[i][0]]; //if going back to objects
		}
		data.push(item);
	}

	d.attributes.forEach(function(attribute) {
		function value(d) {return d[attribute]; }
		position[attribute] = d3.scale.linear()
			.domain([d3.min(d.values, value), d3.max(d.values, value)])
			.range([padding/2, 150 - padding/2]);
	});
	$("#body").show();
	$("#loading").hide();
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
		.attr("width", 150 * 5)
		.attr("height", 150* 5)
		.append("g")

	var column = scatterMatrix.selectAll("g")
		.data(attributes)
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(" + i * 150 + ",0)"; });

	var row = column.selectAll("g")
		.data(cross(attributes))
		.enter()
		.append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * 150 + ")"; });

	row.selectAll("line.x")
		.data(function(d) {return position[d.x].ticks(5).map(position[d.x]); })
		.enter()
		.append("line")
		.attr("class", "x")
		.attr("x1", function(d) {return d;})
		.attr("x2", function(d) {return d;})
		.attr("y1", padding / 2)
		.attr("y2", 150 - padding/2);

	row.selectAll("line.y")
		.data(function(d) { return position[d.y].ticks(5).map(position[d.y]); })
		.enter().append("svg:line")
		.attr("class", "y")
		.attr("x1", padding / 2)
		.attr("x2", 150 - padding / 2)
		.attr("y1", function(d) { return d; })
		.attr("y2", function(d) { return d; });

	row.append("rect")
		.attr("x", padding/2)
		.attr("y", padding/2)
		.attr("width", 150 - padding)
		.attr("height", 150 - padding)
		.style("fill", "none")
		.style("stroke", "#aaa")
		.style("stroke-width", 1.5);

	row.filter(function(d){
	    var ypos = domain.indexOf(d[1]);
	    var xpos = domain.indexOf(d[0]);
	    	for (var i = (ypos + 1); i < num; i++){
	    		if (i === xpos) return false;
	    	}
	    	return true;
	    })
		.append("text")
		.attr("x", 150/2)
        .attr("y", 150/2)
        .text(function(d) {
        	if (d.x == d.y) {
        		return d.x;
        	}
        })
        .style("fill", "#000");

    row.selectAll("circle")
		.data(cross(data))
		.enter()
		.append("circle")
    	.attr("cx", function(d) {
    		if (d.x.x == d.x.y){
    			return -999;
    		}
    		return position[d.x.x](d.y[d.x.x]); 
    	})
    	.attr("cy", function(d) {
    		if (d.x.x == d.x.y){
    			return -999;
    		}
    		return 150 - position[d.x.y](d.y[d.x.y]);
    	})
		.attr("r", 3)
		.style("fill", function(d){
			return "#000"
		});


	// Original
	// var box = scatterMatrix.selectAll(".box")
	// 	.data(corr)
	// 	.enter()
	// 	.append("g")
	// 	.attr("class", "box")

	// box.append("rect")
	//     .attr("width", xSpace)
 //        .attr("height", ySpace)
 //        .attr("x", - xSpace / 2)
 //        .attr("y", - ySpace / 2)

  //   box.filter(function(d){
	 //    var ypos = domain.indexOf(d[1]);
	 //    var xpos = domain.indexOf(d[0]);
	 //    	for (var i = (ypos + 1); i < num; i++){
	 //    		if (i === xpos) return false;
	 //    	}
	 //    	return true;
	 //    })
		// .append("text")
  //       .attr("y", 5)
  //       .text(function(d) {
  //       	if (d[0] == d[1]) {
  //       		return d[0];
  //       	}
  //       })
  //       .style("fill", "#000");

 //    var scatterplots = box.filter(function(d){
	// 	var ypos = domain.indexOf(d[1]);
	// 	var xpos = domain.indexOf(d[0]);
	// 	for (var i = (ypos + 1); i < num; i++){
	// 		if (i === xpos) return true;
	// 	}
	// 	return false;
	// });
}

function removeMatrix(){
	d3.select("#scatterMatrix").selectAll("div")
	.remove();
	d3.select("#scatterMatrix").selectAll("svg")
	.remove();
}

function cross(a) {
	return function(d) {
		var c = [];
		for (var i = 0, n = a.length; i < n; i++){
			c.push({x: d, y: a[i]});
		}
		return c;
	};
}

$(document).ready(function() {

});