var data = [];
var attributes = [];
var width = $(window).width() * .6;
var height = $(window).height() * .8;
var padding = 5;
var counter = 1;
var margin = {top: 100, right: 80, bottom: 25, left: 60};

d3.csv("./data/correlation/correlation.csv", function(error, rows){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	
	// contains the attributes and the value associated with each box
	rows.forEach(function(d) {
		var x = d[""];
		delete d[""];
		for (prop in d) {
			var y = prop,
				value = d[prop];
			data.push({
				x: x,
				y: y,
				value: +value
			});
		}
	});
	initCorrMatrix();
});

function initCorrMatrix(){
	removeMatrix();
	makeCorrMatrix();
}

function makeCorrMatrix(){
	var domain = d3.set(data.map(function(d) {
          return d.x
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
	var color = d3.scale.linear()
		.domain([-1, 0, 1])
		.range(["#000091", "#fff", "#D90000"]);

	var corrMatrix = d3.select("#corrMatrix")
		.append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

	var box = corrMatrix.selectAll(".box")
		.data(data)
		.enter()
		.append("g")
		.attr("class", "box")
		.attr("transform", function(d) {
          return "translate(" + (x(d.x) + margin.left + margin.right )+ "," + y(d.y) + ")";
        });

	box.append("rect")
	    .attr("width", xSpace)
        .attr("height", ySpace)
        .attr("x", - xSpace / 2)
        .attr("y", - ySpace / 2)

    box.filter(function(d){
	    	var ypos = domain.indexOf(d.y);
	    	var xpos = domain.indexOf(d.x);
	    	for (var i = (ypos + 1); i < num; i++){
	    		if (i === xpos) return false;
	    	}
	    	return true;
	    })
		.append("rect")
		.attr("width", xSpace)
		.attr("height", ySpace)
		.attr("x", - xSpace / 2)
        .attr("y", - ySpace / 2)
		.style("fill", function(d){
			if (d.value === 1) {
				return "#D90000";
			}
			else {
				return color(d.value);
			}
		});

	box.filter(function(d){
			var ypos = domain.indexOf(d.y);
			var xpos = domain.indexOf(d.x);
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
		.style("fill", function(d){
			if (d.value === 1) {
				return "#D90000";
			} else {
				return color(d.value);
			}
		});

	var colorScale = d3.scale.linear()
		.range([-margin.top + 5, height + margin.bottom - 5])
		.domain([1, -1]);

    var colorAxis = d3.svg.axis()
      .orient("right")
      .scale(colorScale)
      .tickPadding(7);

    var gs = corrMatrix.append("g")
      .attr("class", "axisClass")
      .call(colorAxis)
      .attr("transform", "translate(" + (boxWidth + margin.right) + " ," + margin.bottom +")")

    var iR = d3.range(-1, 1.01, 0.01);
    var h = height / iR.length + 3;
    iR.forEach(function(d){
        gs.append('rect')
          .style('fill',color(d))
          .style('stroke-width', 0)
          .style('stoke', 'none')
          .attr('height', h)
          .attr('width', 10)
          .attr('x', 0)
          .attr('y', colorScale(d))
      });

    var attributeXScale = d3.scale.linear()
    	.range([0,width - margin.left - margin.right])
    	.domain(domain);
    var attributeXAxis = d3.svg.axis()
    	.orient("top")
    	.scale(attributeXScale)
    	.tickPadding(10);
    var agX = corrMatrix.append("g")
    	.call(attributeXAxis)
    	.attr("class", "axisClass")
    	.attr("transform", function(d){
    		return "translate(" + (margin.left+margin.right) + ", " + (height - margin.top + margin.bottom)+ ")";
    	});
    domain.forEach(function(d,i){
    	agX.append("text")
  			.text(d)
  			.attr('y', 0)
  			.attr("transform", function(d) {
  				return "translate(" + (boxWidth/12 * i +i) + ",0)rotate(-90)";
  			})
  			.style("text-anchor", "end")
    })

    var attributeYScale = d3.scale.linear()
    	.range([-margin.top + 5, height + margin.bottom - 5])
    	.domain(domain);
    var attributeYAxis = d3.svg.axis()
    	.orient("top")
    	.scale(attributeYScale)
    	.tickPadding(10);
    var agY = corrMatrix.append("g")
    	.call(attributeXAxis)
    	.attr("class", "axisClass")
    	.attr("transform", function(d){
    		return "translate(" + (margin.right) + "," + (height - margin.top) + ")rotate(-90)";
    	});
    domain.forEach(function(d,i){
    	agY.append("text")
  			.text(d)
  			.attr("transform", function(d) {
  				return "translate(" + height/11 * i + ",0)rotate(90)";
  			})
  			.style("text-anchor", "end")
    })
}

function removeMatrix(){
	d3.select("#corrMatrix").selectAll("div")
	.remove();
	d3.select("#corrMatrix").selectAll("svg")
	.remove();
}

$(document).ready(function() {
	$("#body").show();
	$("#loading").hide();
	initCorrMatrix();

	// delete this when done VVVV
	d3.json("./data/correlation/correlation.json", function(error, json){
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
		console.log(correlations);
	})
});