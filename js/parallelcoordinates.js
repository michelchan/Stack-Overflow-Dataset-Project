var data = [];
var attributes = [];
var width = $(window).width() * .6;
var height = $(window).height() * .8;
var padding = 5;
var counter = 1;
var margin = {top: 100, right: 80, bottom: 25, left: 60};

var x = d3.scale.ordinal().rangePoints([0, width], 1),
y = {},
dragging = {};

var line = d3.svg.line(),
axis = d3.svg.axis().orient("left"),
background,
foreground;

var svg = d3.select("#parallelCoord").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json("./data/correlation/correlation.json", function(error, json){
	if (error) return console.warn(error);
	attributes = Object.keys(json);
});

d3.json("./data/correlation/forCorrelationMatrix.json", function(error, json){
	if (error) return console.warn(error);
	$("#body").show();
	$("#loading").hide();
	data = json.values;

	  // Extract the list of dimensions and create a scale for each.
	  x.domain(attributes);
	  attributes.forEach(function(d) {
	  	y[d] = d3.scale.linear()
		  	.domain(d3.extent(data, function(p) {return +p[d];}))
		  	.range([height, 0])
	  });


  // Add grey background lines for context.
  background = svg.append("g")
	  .attr("class", "background")
	  .selectAll("path")
	  .data(data)
	  .enter().append("path")
	  .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("g")
	    .attr("class", "foreground")
	    .selectAll("path")
	    .data(data)
	    .enter().append("path")
	    .attr("d", path);


  // Add a group element for each dimension.
  var g = svg.selectAll(".dimension")
	  .data(attributes)
	  .enter().append("g")
	  .attr("class", "dimension")
	  .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
	  .call(d3.behavior.drag()
	  	.origin(function(d) { return {x: x(d)}; })
	  	.on("dragstart", function(d) {
	  		dragging[d] = x(d);
	  		background.attr("visibility", "hidden");
	  	})
	  	.on("drag", function(d) {
	  		dragging[d] = Math.min(width, Math.max(0, d3.event.x));
	  		foreground.attr("d", path);
	  		attributes.sort(function(a, b) { return position(a) - position(b); });
	  		x.domain(attributes);
	  		g.attr("transform", function(d) { return "translate(" + position(d) + ")"; })
	  	})
	  	.on("dragend", function(d) {
	  		delete dragging[d];
	  		transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
	  		transition(foreground).attr("d", path);
	  		background
	  		.attr("d", path)
	  		.transition()
	  		.delay(500)
	  		.duration(0)
	  		.attr("visibility", null);
  	}));

  // Add an axis and title.
  g.append("g")
	  .attr("class", "axis")
	  .each(function(d) { d3.select(this).call(axis.scale(y[d])); })
	  .append("text")
	  .style("text-anchor", "middle")
	  .attr("y", -9)
	  .text(function(d) { return d; });

  // Add and store a brush for each axis.
  g.append("g")
	  .attr("class", "brush")
	  .each(function(d) {
	  	d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brushstart).on("brush", brush));
	  })
	  .selectAll("rect")
	  .attr("x", -8)
	  .attr("width", 16);
})

function position(d) {
	var v = dragging[d];
	return v == null ? x(d) : v;
}

function transition(g) {
	return g.transition().duration(500);
}

function brushstart() {
	d3.event.sourceEvent.stopPropagation();
}

// Handles a brush event, toggling the display of foreground lines.
function brush() {
	var actives = attributes.filter(function(p) { return !y[p].brush.empty(); }),
	extents = actives.map(function(p) { return y[p].brush.extent(); });
	foreground.style("display", function(d) {
		return actives.every(function(p, i) {
			return extents[i][0] <= d[p] && d[p] <= extents[i][1];
		}) ? null : "none";
	});
}

function path(d) {
	return line(attributes.map(function(p) { return [position(p), y[p](d[p])]; }));
}

function removeMatrix(){
	d3.select("#parallelCoord").selectAll("div")
		.remove();
	d3.select("#parallelCoord").selectAll("svg")
		.remove();
}