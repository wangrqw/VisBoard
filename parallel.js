/**
  Set the dimensions and margins of the graph
*/
const pc_margin = {top: 50, right: 100, bottom: 60, left: 300},
pc_width = window.innerWidth - pc_margin.left - pc_margin.right,
pc_height = window.innerHeight - pc_margin.top - pc_margin.bottom;

/**
  Append the svg object to division
*/
var svg = d3.select("#parallel").append("svg")
.attr("width", window.innerWidth)
.attr("height", window.innerHeight)
.append("g")
.attr("transform","translate(" + pc_margin.left + "," + pc_margin.top + ")");

var palette = ['cornflowerblue', 'darkgreen', 'blueviolet', 'gold'];
var symbolTypes = ['symbolCircle', 'symbolCross', 'symbolDiamond', 'symbolSquare', 'symbolStar', 'symbolTriangle', 'symbolWye'];


/*Build the X scale -> it find the best position for each Y axis*/
var xVars = Array.from(Array(32), (x, i) => i);
var x = d3.scalePoint().range([0, pc_width]).domain(xVars);

/** Draw function */
// jsonfile = "embedding_results_last_conv.json";
// draw_parallel(jsonfile);
function draw_parallel(jsonfile){
  svg.selectAll("g").remove();
  svg.selectAll("path").remove();
  /*Parse the Data*/
  d3.json("./data/"+jsonfile, function(data) {
    console.log(data);
    
    // y axis
    var y={};
    for (i in xVars) {
      var range = [d3.extent(data, function(d) { return +d.embed[i]; })];
      if(range[0][1]-range[0][0]<0.5) range[0][1] = range[0][0]+0.5;
      y[i] = d3.scaleLinear().domain(range[0]).range([pc_height, 0]);
    }
    for(var i=0; i<xVars.length; i++){
      svg.append("g")
      .attr("class", "axis")
      .attr("transform", "translate("+x(i)+","+0+")")
      .call(d3.axisLeft(y[i]));
      // .call(d3.axisLeft(y[i]).tickFormat(""));
    }
    
    function path(d) {
      return d3.line()(xVars.map(function(p) {
        return [x(p), y[p](d.embed[p])];
      }));
    }

    /*Draw the lines*/
    svg.selectAll("mypath")
    .data(data)
    .enter().append("path")
    .attr("d", path)
    .style("fill", "none")
    .style("stroke", function(d){
      return palette[d.m];
    })
    .style("opacity", 0.1);
  });

  var keys = ["bamboo flute","erhu","pipa","zheng"];
  var legend = svg.append("g").selectAll("g").data(keys).enter();
  legend.append("rect")
  .attr("x", -200).attr("y", function(d, i){ return 30*i; })
  .attr("width", 25).attr("height",5)
  .style("fill",function(d,i){ return palette[i]});
  legend.append("text")
  .attr("x", -170).attr("y", function(d, i){ return 30*i; })
  .attr("font-family", "sans-serif").attr("font-weight","bold").attr("font-size", "20px")
  .attr("dy", ".35em").style("text-anchor", "start")
  .text(function(d){return d;});

}


